import React from "react";
import {useRouter} from "next/router";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import Card from "@shared/components/common/Card";
import AvatarElement from "@shared/components/common/AvatarElement";
import {Button} from "@shared/components/common/Forms";
import {useProposals} from "@shared/hooks/daos";

const Event = () => {
  const router = useRouter();
  const eventId = router.query.id;
  const isFinished = false;

  const handleAddList = () => {
    router.push(`/events/${eventId}/add_participant`);
  };

  return (
    <>
      <div className="flex flex-col items-center w-full overflow-scroll pt-20 pb-4 h-full">
        <div className="w-full mb-20 flex justify-center gap-5">
          <Card
            className={`p-4 max-w-5xl bg-neutral-50 text-black rounded-3xl border border-gray-200 shadow-md`}
            custom
          >
            <div className="w-full flex justify-center rounded-2xl mb-5 w-full max-h-96 overflow-hidden">
              <img
                src="/multimedia/assets/eth_denver.jpeg"
                alt="ETH"
                className="w-full object-none"
                style={{height: "auto"}}
              />
            </div>
            <div className="mb-4">
              <span className="text-violet-500 font-bold text-3xl">ETH Denver</span>
            </div>
            <div className="flex justify-between mb-10">
              <div className="flex gap-3 items-center w-1/2">
                <CalendarMonthIcon fontSize="large" color="primary" />
                <div className="flex flex-col">
                  <p className="text-md">Date and time</p>
                  <p className="text-gray-500 text-md">Date and time</p>
                </div>
              </div>
              <div className="flex gap-3 items-center w-1/2">
                <LocationOnIcon fontSize="large" color="primary" />
                <div className="flex flex-col">
                  <p className="text-md">Location</p>
                  <p className="text-gray-500 text-md">Location</p>
                </div>
              </div>
            </div>
            <div className="mb-10">
              <p>
                In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to
                demonstrate the visual form of a document or a typeface without relying on
                meaningful content. In publishing and graphic design, Lorem ipsum is a placeholder
                text commonly used to demonstrate the visual form of a document or a typeface
                without relying on meaningful content
              </p>
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
            <div className="w-full flex flex-col items-end">
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
  const {proposals} = useProposals();

  const handleClick = () => {
    const eventId = "1";
    router.push(`/events/${eventId}/participants`);
  };

  return (
    <Card className="px-12 py-10 pt-0 w-full bg-neutral-50 text-black rounded-3xl border border-gray-200 shadow-md">
      {proposals.map(({metadata, votesYes}) => (
        <div className={"mt-8 hover:bg-gray-100"} onClick={handleClick}>
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
