import React from "react";
import {useRouter} from "next/router";

import Spiner from "@shared/components/common/Spiner";
import {useDaos} from "@shared/hooks/daos";
import Card from "@shared/components/common/Card";
import {Button} from "@shared/components/common/Forms";

const Dashboard = () => {
  const {daos, loaded} = useDaos();
  const router = useRouter();

  const onSelectDao = () => {
    const eventId = "1";
    router.push(`/events/${eventId}`);
  };

  return (
    <>
      <div className="flex flex-col items-center w-full overflow-scroll pt-20 pb-4 h-full">
        {daos.length > 0 ? (
          <div className="w-full mb-20 flex justify-center">
            <Card className="p-4 rounded-2xl max-w-md">
              <div className="w-full flex justify-center mb-5">
                <img
                  src="/multimedia/assets/eth_denver.jpeg"
                  alt="ETH"
                  width={400}
                  height={200}
                  className="rounded-xl"
                />
              </div>
              <span className="text-violet-500 font-bold">ETH Denver</span>
              <p className="mb-4">
                In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to
                demonstrate the visual form of a document or a typeface without relying on
                meaningful content
              </p>
              <Button
                className="w-full p-4 bg-violet-500 text-white rounded-xl font-bold"
                onClick={onSelectDao}
              >
                View
              </Button>
            </Card>
          </div>
        ) : loaded ? (
          <div className="w-full h-full flex justify-center items-center">
            <span className="text-xl">There are no DAOs to show</span>
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <Spiner size={50} />
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
