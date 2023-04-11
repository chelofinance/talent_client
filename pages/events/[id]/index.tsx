import React from "react";
import {useRouter} from "next/router";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Link from "next/link";

import Card from "@shared/components/common/Card";
import AvatarElement from "@shared/components/common/AvatarElement";
import {Button} from "@shared/components/common/Forms";
import {useDaos, useProposals} from "@shared/hooks/daos";
import {prettifyNumber} from "@helpers/erc";
import {toBN} from "@helpers/index";

const Event = () => {
  const {daos, loaded} = useDaos();
  const router = useRouter();
  const {proposals, round} = useProposals(router.query.id as string);
  const winners = [...proposals]
    .sort((a, b) => Number(b.votesYes) - Number(a.votesYes))
    .slice(0, round.executeThreshold);
  console.log({winners, round});

  const event = daos[0]?.rounds.find((round) => round.id === router.query.id);
  const isFinished = event?.finished;

  const handleAddList = () => {
    router.push(`/events/${router.query.id}/add_participant`);
  };

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
          <Card
            className={`w-2/3 p-4 max-w-4xl bg-neutral-50 text-black rounded-3xl border border-gray-200 shadow-md `}
            custom
          >
            <div className="w-full flex justify-center rounded-2xl mb-5 w-full max-h-96 overflow-hidden">
              <div className="w-full flex justify-center mb-5 h-72 relative flex items-center h-max-96">
                <img
                  src={event?.metadata.image}
                  alt="ETH"
                  className={`rounded-xl ${event?.metadata.image === "/multimedia/chelo/logo_black.png" ? "opacity-75" : ""
                    } w-full max-h-72 object-cover object-center`}
                />
              </div>
            </div>
            <div className="mb-4">
              <span className="text-violet-500 font-bold text-2xl">{event?.metadata.title}</span>
            </div>
            <div className="flex justify-between items-start mb-10">
              <div className="flex gap-3 items-center w-1/2">
                <span className="text-violet-500">
                  <CalendarMonthIcon fontSize="medium" color="inherit" />
                </span>
                <div className="flex flex-col">
                  <p className="text-md">Date and time</p>
                  <p className="text-gray-500 text-md">
                    {new Date(event?.metadata.metadata.startDate).toDateString()} -{" "}
                    {new Date(event?.metadata.metadata.endDate).toDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-center w-1/2">
                <span className="text-violet-500">
                  <LocationOnIcon fontSize="medium" color="inherit" />
                </span>
                <div className="flex flex-col">
                  <p className="text-md">Location</p>
                  <p className="text-gray-500 text-md">{event?.metadata.metadata.location}</p>
                </div>
              </div>
              {!isFinished && (
                <Button
                  className="w-64 p-2 text-violet-500 text-sm rounded-xl font-semibold"
                  onClick={handleAddList}
                >
                  Add Candidate List
                </Button>
              )}
            </div>
            <div className="mb-10">
              <p className="text-sm">{event?.metadata.description}</p>
            </div>
            {isFinished && (
              <div>
                <span className="text-violet-500 font-bold text-xl">Candidate Winners</span>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 my-5 mx-0 justify-center">
                  {winners.map(({metadata}, i) => (
                    <div
                      key={i}
                      className={"hover:bg-gray-100 cursor-pointer"}
                      onClick={handleWinnerClick(metadata?.metadata.wallet)}
                    >
                      <AvatarElement
                        address={metadata?.metadata.wallet}
                        infoComponent={
                          <div className="flex flex-col">
                            <p className="text-md font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-28">
                              {metadata?.metadata.name}
                            </p>
                            <p className="text-xs text-gray-600">Alumni</p>
                          </div>
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
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

  const handleClick = (userIndex: string) => () => {
    router.push({
      pathname: `/events/${router.query.id}/participants`,
      query: {
        userId: userIndex,
      },
    });
  };

  return (
    <Card className="py-10 pt-0 w-full bg-neutral-50 text-black rounded-3xl border border-gray-200 shadow-md">
      <div className="overflow-y-scroll max-h-[40rem] px-12 ">
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
  );
};

export default Event;
