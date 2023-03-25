import React from "react";
import {useRouter} from "next/router";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Link from "next/link";

import Card from "@shared/components/common/Card";
import AvatarElement from "@shared/components/common/AvatarElement";
import {Button} from "@shared/components/common/Forms";
import {useDaos, useProposals} from "@shared/hooks/daos";

const Event = () => {
  const {daos, loaded} = useDaos();
  const router = useRouter();
  const isFinished = false;
  const event = daos[0].rounds.find((round) => round.id === router.query.id);

  const handleAddList = () => {
    router.push(`/events/${router.query.id}/add_participant`);
  };

  return (
    <>
      <div className="flex flex-col items-center w-full overflow-scroll pt-4 pb-4 h-full">
        <div className="w-full mb-20 flex justify-center gap-5">
          <Card
            className={`p-4 max-w-6xl bg-neutral-50 text-black rounded-3xl border border-gray-200 shadow-md max-h-fit`}
            custom
          >
            <div className="w-full flex justify-center rounded-2xl mb-5 w-full max-h-96 overflow-hidden">
              {event.metadata.image === "/multimedia/chelo/logo_black.png" ? (
                <div className="h-max-96 flex justify-center">
                  <img src={event.metadata.image} alt="Event" className="h-full opacity-75" />
                </div>
              ) : (
                <img
                  src={event.metadata.image}
                  alt="Event"
                  className="w-full object-none"
                  style={{height: "auto"}}
                />
              )}
            </div>
            <div className="mb-4">
              <span className="text-violet-500 font-bold text-2xl">{event.metadata.title}</span>
            </div>
            <div className="flex justify-between mb-10">
              <div className="flex gap-3 items-center w-1/2">
                <CalendarMonthIcon fontSize="large" color="primary" />
                <div className="flex flex-col">
                  <p className="text-md">Date and time</p>
                  <p className="text-gray-500 text-md">
                    {new Date(event.metadata.metadata.startDate).toLocaleDateString()} -{" "}
                    {new Date(event.metadata.metadata.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-center w-1/2">
                <LocationOnIcon fontSize="large" color="primary" />
                <div className="flex flex-col">
                  <p className="text-md">Location</p>
                  <p className="text-gray-500 text-md">{event.metadata.metadata.location}</p>
                </div>
              </div>
            </div>
            <div className="mb-10">
              <p>{event.metadata.description}</p>
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
          {!isFinished && (
            <div className="w-full flex flex-col ">
              <h2 className="text-violet-500 text-xl mb-4">Leaderboard</h2>
              <NewcomersList />
              <Button
                className="w-1/2 p-2 bg-violet-500 text-sm text-white rounded-xl font-semibold mt-8"
                onClick={handleAddList}
              >
                Add Candidate List
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const NewcomersList: React.FunctionComponent<{}> = () => {
  const router = useRouter();
  const {proposals: prop} = useProposals(router.query.id as string);
  const proposals = [...prop, ...prop, ...prop];

  const handleClick = (userIndex: string) => () => {
    router.push(`/events/${userIndex}/participants`);
  };

  return (
    <Card className="px-12 py-10 pt-0 w-full max-h-[40rem] overflow-y-scroll bg-neutral-50 text-black rounded-3xl border border-gray-200 shadow-md">
      {proposals.length === 0 ? (
        <p className="text-gray-500">There are no participants</p>
      ) : (
        proposals.map(({metadata, votesYes}, i) => (
          <div
            key={i}
            className={"mt-8 hover:bg-gray-100 cursor-pointer"}
            onClick={handleClick(String(i))}
          >
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
        ))
      )}
      <Link href={`/events/${router.query.id}/leaderboard`}>
        <span className="text-violet-500 text-md mt-4 block w-full text-center cursor-pointer">
          View all rankings
        </span>
      </Link>
    </Card>
  );
};

export default Event;
