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
import { getNetworkProvider, getProvider, toBN } from "@helpers/index";
import { prettifyNumber } from "@helpers/erc";

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
  const hasVoted = proposal?.votes?.some(
    (vote: ProposalVote) => vote.voter.toLowerCase() === account.toLowerCase()
  );
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
    const dao = daos[daos.length - 1] as MiniDAO;
    const castVoteTx = {
      to: dao.id,
      signature: "castVote(uint256,uint8)",
      args: [proposal.proposalId, 1],
    };

    dispatch(
      onShowTransaction({
        txs: [castVoteTx],
        type: "wallet",
        dao: dao.id,
      })
    );
  };

  return (
    <>
      <div className="flex flex-col items-center w-full overflow-scroll pt-5 pb-4 h-full">
        <div className="w-full mb-20 flex justify-center gap-5">
          <div className="1/2">
            <NewcomersList />
          </div>
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
                className={`px-10 py-1 h-10 bg-${
                  hasVoted ? "gray-300" : "violet-500"
                } text-white font-bold rounded-full`}
                disabled={hasVoted}
                onClick={handleVoteYes}
              >
                {hasVoted ? "Already voted" : "Vote"}
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
          </Card>
        </div>
      </div>
    </>
  );
};

const NewcomersList: React.FunctionComponent<{}> = (props) => {
  const router = useRouter();
  const { proposals } = useProposals(router.query.id as string);
  const { daos } = useDaos();
  const decimals = daos.length > 0 ? daos[0].token.decimals : 6;

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
              count={prettifyNumber(toBN(votesYes).div(toBN(10).pow(decimals)))}
              infoComponent={
                <div className="flex flex-col">
                  <p className="text-md font-semibold whitespace-nowrap">
                    {metadata?.metadata.name}
                  </p>
                  <p className="text-xs text-gray-600">{metadata?.metadata.name}</p>
                </div>
              }
              badgeContent={
                <div className="w-8 h-8 rounded-full bg-violet-500 text-white font-semibold flex items-center justify-center text-2xs">
                  {prettifyNumber(toBN(votesYes).div(toBN(10).pow(decimals)))}
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
