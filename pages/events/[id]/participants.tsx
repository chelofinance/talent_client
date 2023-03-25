import React from "react";
import {useRouter} from "next/router";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Card from "@shared/components/common/Card";
import {Button} from "@shared/components/common/Forms";
import AvatarElement from "@shared/components/common/AvatarElement";
import {useDaos, useProposals} from "@shared/hooks/daos";
import {useAppDispatch} from "@redux/store";
import {onShowTransaction} from "@redux/actions";
import {useWeb3React} from "@web3-react/core";

const Event = () => {
  const {proposals} = useProposals();
  const {daos} = useDaos();
  const {account} = useWeb3React();

  const dispatch = useAppDispatch();
  const router = useRouter();
  const eventId = router.query.id;
  const proposal = proposals[Number(eventId)];
  const isFinished = false;

  const handleVoteYes = () => {
    const dao = daos[daos.length - 1] as MiniDAO;

    dispatch(
      onShowTransaction({
        txs: [
          {
            to: dao.token.address,
            signature: "delegate(address)",
            args: [account],
          },
          {
            to: dao.id,
            signature: "castVote(uint256,uint8)",
            args: [proposal.proposalId, 1],
          },
        ],
        type: "wallet",
        dao: dao.id,
      })
    );
  };

  return (
    <>
      <div className="flex flex-col items-center w-full overflow-scroll pt-20 pb-4 h-full">
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
                badge={true}
                size={80}
                infoComponent={
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold whitespace-nowrap">{`${proposal.metadata.metadata.firstName} ${proposal.metadata.metadata.lastName}`}</p>
                    <p className="text-xs">Identity: Male</p>
                    <p className="text-xs">Ethnicity: Latino</p>
                    <p className="text-xs">Nationality: Canada</p>
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
            <div className="mb-10 mt-8">
              <div className="bg-gray-100 px-5 py-4 rounded-xl flex justify-between mb-4">
                <p>Question 1?</p>
                <ExpandMoreIcon fontSize="large" color="primary" />
              </div>
              <div className="bg-gray-100 px-5 py-4 rounded-xl flex justify-between mb-4">
                <p>Question 2?</p>
                <ExpandMoreIcon fontSize="large" color="primary" />
              </div>
              <div className="bg-gray-100 px-5 py-4 rounded-xl flex justify-between mb-4">
                <p>Question 3?</p>
                <ExpandMoreIcon fontSize="large" color="primary" />
              </div>
              <div className="bg-gray-100 px-5 py-4 rounded-xl flex justify-between mb-4">
                <p>Question 4?</p>
                <ExpandMoreIcon fontSize="large" color="primary" />
              </div>
            </div>
            {isFinished && (
              <div>
                <span className="text-violet-500 font-bold text-xl">Candidate Winner</span>
                <div className="flex flex-wrap mt-5 px-5">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full overflow-hidden" style={{height: 60}}>
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
  const {proposals} = useProposals();

  const handleClick = (userIndex: string) => () => {
    router.push(`/events/${userIndex}/participants`);
  };

  return (
    <Card className="px-12 py-10 pt-0 w-full bg-neutral-50 text-black rounded-3xl border border-gray-200 shadow-md">
      {proposals.map(({metadata, votesYes}, i) => (
        <div className={"mt-8 hover:bg-gray-100"} onClick={handleClick(String(i))}>
          <AvatarElement
            badge={true}
            count={Number(votesYes)}
            infoComponent={
              <div className="flex flex-col">
                <p className="text-md font-semibold whitespace-nowrap">{`${metadata.metadata.firstName} ${metadata.metadata.lastName}`}</p>
                <p className="text-xs text-gray-600">{`${metadata.metadata.firstName} ${metadata.metadata.lastName}`}</p>
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
    </Card>
  );
};

export default Event;
