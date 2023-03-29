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

import Card from "@shared/components/common/Card";
import {Button, TextInput} from "@shared/components/common/Forms";
import {useAppDispatch} from "@redux/store";
import {onShowTransaction} from "@redux/actions";
import {useDaos} from "@shared/hooks/daos";
import {upload, uploadJson} from "@helpers/chelo";
import {ArrowForwardIosSharp} from "@mui/icons-material";
import ImageUpload from "@shared/components/common/ImageUpload";

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

type FormValues = {
  firstName: string;
  lastName: string;
  wallet: string;
  image: File | null;
};

const AddParticipant = () => {
  const router = useRouter();
  const {daos, loaded} = useDaos();
  const [uploading, setUploading] = React.useState(false);
  const dispatch = useAppDispatch();

  const [questions, setQuestions] = useState([{question: "", answer: ""}]);

  const handleNormalSubmit = async (values: FormValues) => {
    setUploading(true);
    const dao = daos[daos.length - 1] as MiniDAO;
    const imageCid = values.image ? await upload([values.image]) : "";
    const data: MiniDaoProposal["metadata"] = {
      title: "Add member to Talent DAO",
      description: `Member is ${values.firstName} ${values.lastName}`,
      image: imageCid,
      metadata: {
        firstName: values.firstName,
        lastName: values.lastName,
        wallet: values.wallet,
        questions,
      },
    };
    const cid = await uploadJson(data);
    console.log({cid});

    try {
      dispatch(
        onShowTransaction({
          txs: [
            {
              to: dao.token.address,
              signature: "mint(address,uint256)",
              args: [values.wallet, 1], //TODO calculate mint amount
            },
          ],
          dao: dao.id,
          type: "chelo",
          metadata: {
            cid,
          },
        })
      );
    } catch (err) {
      console.log(err);
    }
    setUploading(false);
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
          <Card className="w-full py-5 flex flex-col justify-between" style={{height: "400px"}}>
            <div className="w-full">
              <div className="border-b border-gray-200 pb-2 w-full flex justify-center">
                <span className="text-violet-500 font-semibold text-lg">Add Candidate List</span>
              </div>
              <div className="flex w-full">
                <div className="flex flex-col w-1/2">
                  <div className="px-5 flex flex-col w-full px-20 pt-5">
                    <div className="mb-4">
                      <span className="text-violet-500">Details</span>
                    </div>
                    <Formik
                      onSubmit={handleNormalSubmit}
                      initialValues={{
                        firstName: "",
                        lastName: "",
                        wallet: "",
                        image: null,
                      }}
                      validationSchema={Yup.lazy((values: FormValues) => {
                        return Yup.object({
                          firstName: Yup.string().required("Principal required"),
                          lastName: Yup.string().required("APR required"),
                          wallet: (
                            Yup.string().required("User wallet required") as any
                          ).isEthAddress(),
                        });
                      })}
                    >
                      {({errors, ...props}) => {
                        return (
                          <Form className="flex flex-col justify-between w-full h-full">
                            <TextInput
                              white
                              name="firstName"
                              classes={{root: "w-full mb-4"}}
                              placeholder="First Name"
                            />
                            <TextInput
                              white
                              name="lastName"
                              classes={{root: "w-full mb-4"}}
                              placeholder="Last Name"
                            />
                            <TextInput
                              white
                              name="wallet"
                              classes={{root: "w-full"}}
                              placeholder="Wallet Address"
                            />
                            {
                              //<ImageUpload
                              //text="User photo (optional)"
                              //classes={{root: "w-full mt-5"}}
                              //value={props.values.image}
                              //onChange={(file) => props.setFieldValue("image", file)}
                              ///>
                            }
                            <Button
                              className="w-72 p-2 bg-violet-500 text-sm text-white rounded-full font-semibold mt-8 ml-5"
                              type="submit"
                            >
                              {uploading ? "Uploading..." : "Save"}
                            </Button>
                          </Form>
                        );
                      }}
                    </Formik>
                  </div>
                </div>
                <div className="w-1/2 flex flex-col pt-3">
                  <div className="w-full flex items-center ml-5 text-violet-500">
                    <span className="">Questions and Answers</span>
                    <IconButton onClick={addQuestion} color="inherit" size="small">
                      <AddIcon />
                    </IconButton>
                  </div>
                  <div className="flex flex-col w-full h-72 overflow-scroll">
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
                            onChange={(e) => updateQuestion(index, "question", e.target.value)}
                            classes={{root: "w-full"}}
                            placeholder="Question"
                          />
                          <IconButton onClick={() => deleteQuestion(index)} color="secondary">
                            <DeleteIcon />
                          </IconButton>
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextInput
                            noFormik
                            white
                            value={answer}
                            onChange={(e) => updateQuestion(index, "answer", e.target.value)}
                            classes={{root: "w-full mt-1 pl-6 pr-10"}}
                            placeholder="Answer"
                          />
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex"></div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AddParticipant;
