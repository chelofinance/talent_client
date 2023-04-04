import React from "react";
import { useRouter } from "next/router";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";

import Card from "@shared/components/common/Card";
import { Button } from "@shared/components/common/Forms";
import AvatarElement from "@shared/components/common/AvatarElement";
import { useDaos, useProposals } from "@shared/hooks/daos";
import { useAppDispatch } from "@redux/store";
import { onShowTransaction } from "@redux/actions";
import { useWeb3React } from "@web3-react/core";
import { attach } from "@helpers/contracts";
import { getNetworkProvider, getProvider } from "@helpers/index";

const Accordion = styled(MuiAccordion)(({ theme }) => ({
  backgroundColor: "#f1f2f4",
  borderRadius: theme.shape.borderRadius,
  boxShadow: "none",
  "&:not(:last-child)": {
    marginBottom: theme.spacing(1),
  },
  "&:before": {
    display: "none",
  },
  "& .Mui-expanded": {
    margin: "0",
  },
}));

const AccordionSummary = styled(MuiAccordionSummary)(() => ({
  "& .MuiAccordionSummary-content": {
    fontWeight: "bold",
  },
}));

const Event = () => {
  const router = useRouter();
  const { daos } = useDaos();
  const { account, chainId } = useWeb3React();
  const { proposals } = useProposals(router.query.id as string);

  const dispatch = useAppDispatch();
  const proposal = proposals[Number(router.query.userId)];
  const isFinished = false;
  const email =
    proposal?.metadata?.metadata.questions.find((q) => q.question.toLowerCase().includes("email"))
      ?.answer || "N/A";
  const twitter =
    proposal?.metadata?.metadata.questions.find((q) => q.question.toLowerCase().includes("twitter"))
      ?.answer || "N/A";
  const telegram =
    proposal?.metadata?.metadata.questions.find((q) =>
      q.question.toLowerCase().includes("telegram")
    )?.answer || "N/A";

  const handleVoteYes = async () => {
    const provider = getNetworkProvider(chainId as SupportedNetworks);
    const dao = daos[daos.length - 1] as MiniDAO;
    const token = attach("ERC20Votes", dao.token.address, provider);
    const delegatee = await token.delegates(account);
    const castVoteTx = {
      to: dao.id,
      signature: "castVote(uint256,uint8)",
      args: [proposal.proposalId, 1],
    };
    const txs =
      delegatee.toLowerCase() === account.toLowerCase()
        ? [castVoteTx]
        : [
            {
              to: dao.token.address,
              signature: "delegate(address)",
              args: [account],
            },
            castVoteTx,
          ];

    dispatch(
      onShowTransaction({
        txs,
        type: "wallet",
        dao: dao.id,
      })
    );
  };

  return (
    <>
      <div className="flex flex-col items-center w-full overflow-scroll pt-5 pb-4 h-full">
        <div className="w-full mb-20 flex justify-center gap-5">
          {!isFinished && (
            <div className="1/2">
              <NewcomersList />
            </div>
          )}
          <Card
            className={`p-4 w-2/3 bg-neutral-50 text-black rounded-3xl border border-gray-200 shadow-md`}
            custom
          >
            <div className="flex justify-between">
              <AvatarElement
                address={proposal?.metadata?.metadata.wallet}
                badge={true}
                size={80}
                infoComponent={
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <p className="text-lg font-semibold ">{proposal?.metadata?.metadata.name}</p>
                      <p className="text-gray-500 ml-2 text-sm">(Alumni)</p>
                    </div>
                    <p className="text-xs">Email: {email}</p>
                    <p className="text-xs">Twitter: {twitter}</p>
                    <p className="text-xs">Telegram: {telegram}</p>
                  </div>
                }
              />
              <Button
                className="px-10 py-1 h-10 bg-violet-500 text-white font-bold rounded-full"
                onClick={handleVoteYes}
              >
                Vote
              </Button>
            </div>
            <div className="mb-10 mt-8 overflow-scroll" style={{ maxHeight: "500px" }}>
              {proposal?.metadata?.metadata.questions.map((q, index) => (
                <Accordion key={index}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index + 1}-content`}
                    id={`panel${index + 1}-header`}
                  >
                    <Typography>{q.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{q.answer || "N/A"}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
            {isFinished && (
              <div>
                <span className="text-violet-500 font-bold text-xl">Candidate Winner</span>
                <div className="flex flex-wrap mt-5 px-5">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full overflow-hidden" style={{ height: 60 }}>
                      <img
                        width={60}
                        src="/multimedia/assets/ronald_duck.jpeg"
                        className="rounded-full"
                      />
                    </div>

                    <div className="flex flex-col">
                      <p className="text-lg font-semibold">Ronald Duck</p>
                      <p className="text-sm color-gray-500">Ronald Duck</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

const NewcomersList: React.FunctionComponent<{}> = (props) => {
  const router = useRouter();
  const { proposals } = useProposals(router.query.id as string);

  const handleClick = (userIndex: string) => () => {
    router.push({
      pathname: `/events/${router.query.id as string}/participants`,
      query: {
        userId: userIndex,
      },
    });
  };

  return (
    <Card
      className="py-10 pt-0 w-full bg-neutral-50 text-black rounded-3xl border border-gray-200 shadow-md"
      custom
    >
      <div className="p-4 border-b border-gray-200 flex justify-center">
        <span className="text-violet-500 font-semibold">Candidates</span>
      </div>
      <div className="overflow-scroll" style={{ maxHeight: "600px" }}>
        {proposals.map(({ metadata, votesYes }, i) => (
          <div className={"mt-8 hover:bg-gray-100 px-8"} onClick={handleClick(String(i))}>
            <AvatarElement
              address={metadata?.metadata.wallet}
              badge={true}
              count={Number(votesYes)}
              infoComponent={
                <div className="flex flex-col">
                  <p className="text-md font-semibold whitespace-nowrap">
                    {metadata?.metadata.name}
                  </p>
                  <p className="text-xs text-gray-600">{metadata?.metadata.name}</p>
                </div>
              }
              badgeContent={
                <div className="w-6 h-6 rounded-full bg-violet-500 text-white font-semibold flex items-center justify-center">
                  {votesYes}
                </div>
              }
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Event;
