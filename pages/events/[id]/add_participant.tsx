import React, {useState} from "react";
import {useRouter} from "next/router";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAccordion, {AccordionProps} from "@mui/material/Accordion";
import MuiAccordionSummary, {AccordionSummaryProps} from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {styled} from "@mui/material/styles";
import {useDropzone} from "react-dropzone";
import Papa from "papaparse";

import Card from "@shared/components/common/Card";
import {Button, TextInput} from "@shared/components/common/Forms";
import {useAppDispatch, useAppSelector} from "@redux/store";
import {onShowTransaction, onUpdateError} from "@redux/actions";
import {useDaos} from "@shared/hooks/daos";
import {upload, uploadJson} from "@helpers/chelo";
import {ArrowForwardIosSharp} from "@mui/icons-material";
import {attach} from "@helpers/contracts";
import {parseCheloTransaction} from "@helpers/chelo";
import {
  calculateGasMargin,
  getLatestBlock,
  getNetworkProvider,
  isProduction,
  toBN,
} from "@helpers/index";
import {useWeb3React} from "@web3-react/core";
import {Contract, ethers} from "ethers";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({theme}) => ({
  border: `none`,
  "& .MuiAccordionDetails-root": {
    paddingTop: 9,
    paddingBottom: 3,
    background: "transparent",
  },
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharp sx={{fontSize: "0.9rem"}} />}
    {...props}
  />
))(({theme}) => ({
  background: "transparent",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-content": {
    marginBottom: "3px",
  },
  "& .MuiAccordionSummary-root .Mui-focusVisible": {
    backgroundColor: "transparent",
  },
}));

type ProposalInfo = {
  targets: string[];
  values: number[];
  calldatas: string[];
  description: string;
  roundId: string;
};

type FormValues = {
  name: string;
  wallet: string;
  image: File | null;
};

const AddParticipant = () => {
  const [uploading, setUploading] = React.useState(false);
  const [membersInfo, setMembersInfo] = React.useState<File>(null);
  const [questions, setQuestions] = useState([{question: "", answer: ""}]);
  const [view, setView] = React.useState("ICL");

  const router = useRouter();
  const {
    account: {networkId},
  } = useAppSelector((state) => state.user);
  const {daos, loaded} = useDaos();
  const dispatch = useAppDispatch();
  const {provider, chainId, account} = useWeb3React();
  const {getRootProps, getInputProps} = useDropzone({
    accept: "text/csv",
    maxFiles: 1,
    onDrop: (acceptedFiles) => setMembersInfo(acceptedFiles[0]),
  } as any);

  const dao = daos[daos.length - 1] as MiniDAO;
  const eventId = router.query.id;

  const uploadUsersData = async (
    proposalMeta: MiniDaoProposal["metadata"][]
  ): Promise<string[]> => {
    const files = proposalMeta.map((object, i) => {
      const jsonString = JSON.stringify(object);
      const jsonBlob = new Blob([jsonString], {type: "application/json"});

      return new File([jsonBlob], `metadata.${i}.json`, {
        type: "application/json",
      });
    });

    const cid = await upload(files);

    return proposalMeta.map((_, i) => `${cid}/metadata.${i}.json`);
  };

  const createBatchProposal = (data: ProposalInfo[]) => {
    return parseCheloTransaction({
      to: dao.id,
      signature: "batchPropose(address[][],uint256[][],bytes[][],string[], uint256)",
      args: [
        data.map(({targets}) => targets),
        data.map(({values}) => values),
        data.map(({calldatas}) => calldatas),
        data.map(({description}) => description),
        eventId,
      ],
    });
  };

  const isDataTooLarge = async (data: ProposalInfo[]) => {
    try {
      const signer = provider.getSigner();
      const transaction = createBatchProposal(data);
      const gasLimit = calculateGasMargin(await signer.estimateGas(transaction));

      const block = await getLatestBlock(chainId as SupportedNetworks);
      const blockGasLimit = block.gasLimit;
      return gasLimit.gt(blockGasLimit.mul(70).div(100));
    } catch (err) {
      console.log("isDataTooLarge", err);
      return true;
    }
  };

  const findOptimalBatchSize = async (array: ProposalInfo[]) => {
    let batchSize = array.length;
    let isTooLarge = true;

    while (isTooLarge && batchSize > 80) {
      const batch = array.slice(0, batchSize);
      isTooLarge = await isDataTooLarge(batch);
      if (isTooLarge) {
        batchSize = Math.floor(batchSize / 2) + (batchSize % 2);
      }
    }

    return batchSize;
  };

  const onImportSubmit = async () => {
    setUploading(true);
    try {
      const parseCSV = (file: File): Promise<{data: string[][]}> => {
        return new Promise((resolve, reject) => {
          Papa.parse(file, {
            complete: (results) => {
              resolve(results);
            },
            error: (err) => {
              reject(err);
            },
          });
        });
      };
      const results = await parseCSV(membersInfo);
      const headers: string[] = results.data[0];
      const data: string[][] = results.data.slice(1).filter((cur) => cur.length === headers.length);

      const mappedData = data.map((row) => {
        return row.reduce((acc, value, index) => {
          const columnName = headers[index];
          acc[columnName] = value;
          return acc;
        }, {} as Record<string, string>);
      });

      const questionedData = data.map((row, i) => {
        const user = mappedData[i];
        const name = user[`What's your name?`] || user["Name"] || "Anonymous";
        const questions = row.reduce((acc, value, index) => {
          const question = headers[index];
          acc.push({question, answer: value});
          return acc;
        }, []);
        const wallet = isProduction() ? user["wallet"] : user["wallet"] || account;

        return {
          title: "Add member to Talent DAO",
          description: `Member is ${name}`,
          image: "",
          seed: String(Math.random()) + wallet,
          metadata: {
            name,
            wallet,
            questions,
          },
        } as MiniDaoProposal["metadata"];
      });

      if (questionedData.some((user) => !ethers.utils.isAddress(user.metadata.wallet))) {
        const index = questionedData.findIndex(
          (user) => !ethers.utils.isAddress(user.metadata.wallet)
        );
        dispatch(onUpdateError({code: "WALLET_REQUIRED_CSV", message: "", open: true}));
        throw Error("Users wallet");
      }

      const tokenContract = attach("ERC1155", dao.token.address, getNetworkProvider(networkId));
      const cids = await uploadUsersData(questionedData);
      const mintAmount = 1;

      const proposalsArray: ProposalInfo[] = cids.map((cid, i) => {
        const addGroupCalldata = tokenContract.interface.encodeFunctionData("addToGroup", [
          questionedData[i].metadata.wallet,
          2,
        ]);
        const mintCalldata = tokenContract.interface.encodeFunctionData("mint", [
          questionedData[i].metadata.wallet,
          mintAmount,
        ]);

        return {
          targets: [dao.token.address, dao.token.address],
          values: [0, 0],
          calldatas: [addGroupCalldata, mintCalldata],
          description: cid,
          roundId: eventId as string,
        };
      });

      const batchSize = await findOptimalBatchSize(proposalsArray);
      let txs: CheloTransactionRequest[] = [];

      for (let i = 0; i < proposalsArray.length; i += batchSize) {
        const batch = proposalsArray.slice(i, i + batchSize);
        const {targets, values, calldatas, descriptions} = batch.reduce(
          (acc, cur) => {
            return {
              targets: acc.targets.concat([cur.targets]),
              values: acc.values.concat([cur.values]),
              calldatas: acc.calldatas.concat([cur.calldatas]),
              descriptions: acc.descriptions.concat([cur.description]),
            };
          },
          {targets: [], values: [], calldatas: [], descriptions: []} as {
            targets: string[][];
            values: number[][];
            calldatas: string[][];
            descriptions: string[];
          }
        );

        console.log({descriptions});
        txs = txs.concat({
          to: dao.id,
          signature: "batchPropose(address[][],uint256[][],bytes[][],string[],uint256)",
          args: [targets, values, calldatas, descriptions, eventId],
        });
      }

      dispatch(
        onShowTransaction({
          txs,
          type: "wallet",
        })
      );
    } catch (err) {
      console.log("File proposals", err);
    }
    setUploading(false);
  };

  const dataCid = async (values: FormValues) => {
    const imageCid = values.image ? await upload([values.image]) : "";
    const data: MiniDaoProposal["metadata"] = {
      title: "Add member to Talent DAO",
      description: `Member is ${values.name}`,
      image: imageCid,
      seed: String(Math.random()) + values.wallet,
      metadata: {
        name: values.name,
        wallet: values.wallet,
        questions,
      },
    };
    return await uploadJson(data);
  };

  const handleNormalSubmit = async (values: FormValues) => {
    setUploading(true);

    try {
      const cid = await dataCid(values);
      const token = attach("ElasticVotes", dao.token.address, getNetworkProvider(networkId));
      const mintAmount = await calculateMintAmount(token);

      const txs = [
        {
          to: dao.id,
          signature: "proposeWithRound(address[],uint256[],bytes[],string,uint256)",
          args: [
            [token.address, token.address],
            [0, 0],
            [
              token.interface.encodeFunctionData("addToGroup", [values.wallet, 2]),
              token.interface.encodeFunctionData("mint", [values.wallet, mintAmount]),
            ],
            cid,
            eventId,
          ],
        },
      ];

      dispatch(
        onShowTransaction({
          txs,
          dao: dao.id,
          type: "wallet",
        })
      );
    } catch (err) {
      console.log(err);
    }
    setUploading(false);
  };

  const toggleView = () => {
    setView(view === "ICL" ? "ACL" : "ICL");
  };

  const addQuestion = () => {
    setQuestions([...questions, {question: "", answer: ""}]);
  };

  const updateQuestion = (index: number, field: keyof typeof questions[0], value: string) => {
    const updatedQuestions = questions.map((q, i) => (i === index ? {...q, [field]: value} : q));
    setQuestions(updatedQuestions);
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="flex flex-col items-center w-full pt-20 pb-4 h-full">
        <div className="w-full mb-20 flex justify-center gap-5">
          {view === "ICL" && (
            <Card className="py-5 flex flex-col justify-between" style={{height: "400px"}}>
              <div className="w-full">
                <div className="border-b border-gray-200 pb-2 w-full flex justify-center">
                  <span className="text-violet-500 font-semibold text-lg">
                    Import Candidate List
                  </span>
                </div>
                <div className="px-5 flex flex-col w-full pt-5">
                  <div className="w-full flex flex-col items-center justify-center">
                    <div
                      {...getRootProps()}
                      className="w-72 flex items-center justify-center border-2 border-gray-400 border-dashed py-2 cursor-pointer my-10"
                    >
                      <input {...getInputProps()} />
                      <p className="text-violet-500">
                        {membersInfo ? `${membersInfo.name} selected` : <AddIcon />}
                      </p>
                    </div>
                    <Button
                      className="w-72 p-2 bg-violet-500 text-sm text-white rounded-full font-semibold mt-8"
                      onClick={onImportSubmit}
                    >
                      {uploading ? "Uploading..." : "Save"}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-end pr-5">
                <Button className="p-2 text-sm text-violet-500 font-semibold" onClick={toggleView}>
                  Use form
                </Button>
              </div>
            </Card>
          )}
          {view === "ACL" && (
            <Card className="w-full flex justify-between items-center py-4">
              <div className="w-full">
                <div className="border-b border-gray-200 pb-2 w-full flex justify-center">
                  <span className="text-violet-500 font-semibold text-lg">Add Candidate List</span>
                </div>
                <Formik
                  onSubmit={handleNormalSubmit}
                  initialValues={{
                    name: "",
                    wallet: "",
                    image: null,
                  }}
                  validationSchema={Yup.lazy((values: FormValues) => {
                    return Yup.object({
                      name: Yup.string().required("Principal required"),
                      wallet: (Yup.string().required("User wallet required") as any).isEthAddress(),
                    });
                  })}
                >
                  {({errors, ...props}) => {
                    return (
                      <Form className="flex flex-col justify-between w-full">
                        <div className="flex w-full">
                          <div className="flex flex-col w-1/2">
                            <div className="px-5 flex flex-col w-full px-20 pt-5">
                              <div className="mb-4">
                                <span className="text-violet-500">Details</span>
                              </div>
                              <TextInput
                                white
                                name="name"
                                classes={{root: "w-full mb-4"}}
                                placeholder="First Name"
                              />
                              <TextInput
                                white
                                name="wallet"
                                classes={{root: "w-full"}}
                                placeholder="Wallet Address"
                              />
                            </div>
                          </div>
                          <div className="w-1/2 flex flex-col pt-3">
                            <div className="w-full flex items-center ml-5 text-violet-500">
                              <span className="">Questions and Answers</span>
                              <IconButton onClick={addQuestion} color="inherit" size="small">
                                <AddIcon />
                              </IconButton>
                            </div>
                            <div className="flex flex-col w-full overflow-scroll max-h-64">
                              {questions.map(({question, answer}, index) => (
                                <Accordion
                                  key={index}
                                  sx={{
                                    boxShadow: "none",
                                    background: "transparent",
                                    padding: "0",
                                  }}
                                >
                                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <TextInput
                                      noFormik
                                      white
                                      value={question}
                                      onChange={(e) =>
                                        updateQuestion(index, "question", e.target.value)
                                      }
                                      classes={{root: "w-full"}}
                                      placeholder="Question"
                                    />
                                    <IconButton
                                      onClick={() => deleteQuestion(index)}
                                      color="secondary"
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <TextInput
                                      noFormik
                                      white
                                      value={answer}
                                      onChange={(e) =>
                                        updateQuestion(index, "answer", e.target.value)
                                      }
                                      classes={{root: "w-full mt-1 pl-6 pr-10"}}
                                      placeholder="Answer"
                                    />
                                  </AccordionDetails>
                                </Accordion>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between w-full items-center px-5 pt-5">
                          <Button
                            className="w-72 bg-violet-500 text-sm text-white rounded-full font-semibold p-2"
                            type="submit"
                          >
                            {uploading ? "Uploading..." : "Save"}
                          </Button>
                          <Button
                            className="text-sm text-violet-500 font-semibold"
                            onClick={toggleView}
                          >
                            Use cvs
                          </Button>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default AddParticipant;
