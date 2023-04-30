import React, {useState} from "react";
import {useRouter} from "next/router";
import {IconButton} from "@mui/material";
import {ArrowBackIos, ArrowForwardIos} from "@mui/icons-material";

import Spiner from "@shared/components/common/Spiner";
import {useDaos, useRole} from "@shared/hooks/daos";
import Card from "@shared/components/common/Card";
import {Button} from "@shared/components/common/Forms";
import Link from "next/link";

const Dashboard = () => {
  const {daos, loaded} = useDaos();
  const {round} = useRole();
  const router = useRouter();
  const eventRounds = daos[0]?.rounds || [];
  const itemsPerPage = 3;

  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(eventRounds.length / itemsPerPage);

  const onSelectEvent = (eventId: string) => () => {
    router.push(`/events/${eventId}`);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const visibleRounds = eventRounds.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <>
      <div className="flex justify-center items-center min-h-96">
        {loaded && visibleRounds.length > 0 && (
          <IconButton
            onClick={handlePrevPage}
            className="text-violet-500 hover:text-violet-700 transform hover:scale-110"
          >
            <ArrowBackIos />
          </IconButton>
        )}
        <div
          className="flex flex-wrap justify-center items-center w-full overflow-scroll pt-4 pb-4 h-full h-full"
          style={{minHeight: "500px"}}
        >
          {daos.length > 0 && visibleRounds.length > 0 ? (
            visibleRounds.map((round) => (
              <Card
                className={`p-4 rounded-2xl max-w-md ${round.finished && "opacity-75 bg-gray-200"
                  } mx-2 h-full flex-1 flex flex-col justify-between`}
                style={{height: "600px"}}
              >
                <div className="flex flex-col">
                  <div className="w-full flex justify-center mb-5 h-72 relative flex items-center">
                    <img
                      src={round.metadata.image}
                      alt="ETH"
                      className={`rounded-xl ${round.metadata.image === "/multimedia/chelo/logo_black.png"
                          ? "opacity-75"
                          : ""
                        } w-full max-h-72 object-cover object-center`}
                    />
                  </div>
                  <span className="text-violet-500 font-bold">{round.metadata.title}</span>
                  <p className="mb-4 h-[9em] overflow-hidden line-clamp-3">
                    {round.metadata.description}
                  </p>
                </div>
                <Button
                  className="w-full p-4 bg-violet-500 text-white rounded-xl font-bold"
                  onClick={onSelectEvent(round.id)}
                >
                  {round.finished ? "Finished" : "View"}
                </Button>
              </Card>
            ))
          ) : loaded ? (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <span className="text-xl">There are no events to show</span>
              {round && (
                <Link href="/create_event">
                  <p className="text-xl cursor-pointer text-violet-500">Create event</p>
                </Link>
              )}
            </div>
          ) : (
            <div className="w-full h-96 flex justify-center items-center text-violet-500">
              <Spiner size={50} />
            </div>
          )}
        </div>
        {loaded && visibleRounds.length > 0 && (
          <IconButton
            onClick={handleNextPage}
            className="text-violet-500 hover:text-violet-700 transform hover:scale-110"
          >
            <ArrowForwardIos />
          </IconButton>
        )}
      </div>
      <div className="flex justify-center items-center space-x-4 mt-4">
        {Array.from({length: totalPages}).map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index)}
            className={`w-8 h-8 rounded-full border border-violet-500 ${currentPage === index ? "bg-violet-500 text-white" : "bg-transparent"
              } text-violet-500 hover:bg-violet-500 hover:text-white focus:outline-none`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
