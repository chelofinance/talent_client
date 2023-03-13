import React from "react";
import {useRouter} from "next/router";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Card from "@shared/components/common/Card";
import {Button} from "@shared/components/common/Forms";
import AvatarElement from "@shared/components/common/AvatarElement";

const Event = () => {
  const router = useRouter();
  const eventId = router.query.id;
  const isFinished = false;

  return (
    <>
      <div className="flex flex-col items-center w-full overflow-scroll pt-20 pb-4 h-full">
        <div className="w-full mb-20 flex justify-center gap-5">
          {!isFinished && (
            <div className="w-1/3">
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
                    <p className="text-lg font-semibold whitespace-nowrap">Ronald Duck</p>
                    <p className="text-xs">Identity: Male</p>
                    <p className="text-xs">Ethnicity: Latino</p>
                    <p className="text-xs">Nationality: Canada</p>
                  </div>
                }
              />
              <Button className="px-10 py-1 h-10 bg-violet-500 text-white font-bold rounded-full">
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

const NewcomersList: React.FunctionComponent<{}> = () => {
  const router = useRouter();

  const newcomers = [
    {
      name: "Ronald Duck",
      role: "Alumni",
      votes: 30,
    },
    {
      name: "Ronald Duck",
      role: "Alumni",
      votes: 27,
    },
    {
      name: "Ronald Duck",
      role: "Alumni",
      votes: 26,
    },
    {
      name: "Ronald Duck",
      role: "Alumni",
      votes: 26,
    },
    {
      name: "Ronald Duck",
      role: "Alumni",
      votes: 10,
    },
    {
      name: "Ronald Duck",
      role: "Alumni",
      votes: 2,
    },
  ];

  const handleClick = () => {
    const eventId = "1";
    router.push(`/events/${eventId}/participants`);
  };

  return (
    <Card className="px-12 py-10 pt-0 w-full bg-neutral-50 text-black rounded-3xl border border-gray-200 shadow-md">
      {newcomers.map(({name, role, votes}) => (
        <div className={"mt-8 hover:bg-gray-100"} onClick={handleClick}>
          <AvatarElement
            badge={true}
            count={votes}
            badgeContent={
              <div className="w-6 h-6 rounded-full bg-violet-500 text-white font-semibold flex items-center justify-center">
                {votes}
              </div>
            }
          />
        </div>
      ))}
    </Card>
  );
};

export default Event;
