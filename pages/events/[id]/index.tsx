import React from "react";
import {useRouter} from "next/router";
import Link from "next/link";

import Button from "@shared/components/common/Forms/Button";
import Card from "@shared/components/common/Card";
import AvatarElement from "@shared/components/common/AvatarElement";
import {useDaos, useProposals} from "@shared/hooks/daos";
import {prettifyNumber} from "@helpers/erc";
import {toBN} from "@helpers/index";
import EventCard from "@shared/components/talent/EventCard";

const Event = () => {
  const {daos, loaded} = useDaos();
  const router = useRouter();
  const {proposals, round} = useProposals(router.query.id as string);
  const winners = [...proposals]
    .sort((a, b) => Number(b.votesYes) - Number(a.votesYes))
    .slice(0, round?.executeThreshold || 0);

  const event = daos[0]?.rounds.find((round) => round.id === router.query.id);
  const isFinished = event?.finished;

  const handleWinnerClick = (participantWallet: string) => () => {
    router.push({
      pathname: `/events/${router.query.id}/mint_nft`,
      query: {
        userId: participantWallet,
      },
    });
  };

  return (
    <>
      <div className="flex flex-col items-center w-full overflow-scroll pt-4 pb-4 h-full">
        <div className="w-full mb-20 flex justify-center gap-5">
          <div className="max-w-4xl h-full">
            <EventCard
              image={event?.metadata.image}
              eventTitle={event?.metadata.title}
              numberOfWinners={event?.executeThreshold}
              startDate={event?.metadata.metadata.startDate}
              endDate={event?.metadata.metadata.endDate}
              location={event?.metadata.metadata.location}
              isFinished={isFinished}
              description={event?.metadata.description}
              winners={winners.map(({metadata}) => ({
                wallet: metadata?.metadata.wallet,
                name: metadata?.metadata.name,
              }))}
              handleWinnerClick={handleWinnerClick}
            />
          </div>

          {!isFinished && proposals.length > 0 && (
            <div className="w-1/3 flex flex-col ">
              <h2 className="text-violet-500 text-xl mb-4">Leaderboard</h2>
              <NewcomersList proposals={proposals} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const NewcomersList: React.FunctionComponent<{proposals: MiniDaoProposal[]}> = (props) => {
  const {proposals} = props;
  const router = useRouter();
  const {daos} = useDaos();
  const decimals = daos.length > 0 ? daos[0].token.decimals : 6;
  const sortedProposals = [...proposals].sort((a, b) => Number(b.votesYes) - Number(a.votesYes));

  const handleAddList = () => {
    router.push(`/events/${router.query.id}/add_participant`);
  };

  const handleClick = (userIndex: string) => () => {
    router.push({
      pathname: `/events/${router.query.id}/participants`,
      query: {
        userId: userIndex,
      },
    });
  };

  return (
    <div className="flex flex-col items-end">
      <Card
        className="py-10 pt-0 mb-5 w-full bg-neutral-50 text-black rounded-3xl border border-gray-200 shadow-md"
        custom
      >
        <div className="overflow-y-scroll max-h-[30.7rem] px-12 ">
          {proposals.length === 0 ? (
            <p className="text-gray-500">There are no participants</p>
          ) : (
            sortedProposals.map(({metadata, votesYes}, i) => (
              <div
                key={i}
                className={"mt-8 hover:bg-gray-100 cursor-pointer"}
                onClick={handleClick(String(i))}
              >
                <AvatarElement
                  badge={true}
                  address={metadata?.metadata.wallet}
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
                    <div className="w-8 h-8 rounded-full bg-violet-500 text-white font-semibold flex items-center justify-center text-xs">
                      {prettifyNumber(toBN(votesYes).div(toBN(10).pow(decimals)))}
                    </div>
                  }
                />
              </div>
            ))
          )}
        </div>
        <Link href={`/events/${router.query.id}/leaderboard`}>
          <span className="text-violet-500 text-md mt-4 block w-full text-center cursor-pointer">
            View all rankings
          </span>
        </Link>
      </Card>

      <Button classes={{root: "w-52 rounded-xl text-sm"}} onClick={handleAddList}>
        Add Candidate List
      </Button>
    </div>
  );
};

export default Event;
