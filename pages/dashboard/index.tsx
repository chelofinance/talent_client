import React from "react";
import {useRouter} from "next/router";

import Spiner from "@shared/components/common/Spiner";
import {useDao} from "@shared/hooks/daos";

const Dashboard = () => {
  const {dao, loaded} = useDao();
  const router = useRouter();

  const onSelectDao = (dao: DAO) => {
    router.push(`/lending/mini_dao?mini_dao=${dao.id}`);
  };

  return (
    <>
      <div className="flex flex-col items-center w-full overflow-scroll pt-20 pb-4 h-full">
        {dao ? (
          <div className="w-full mb-20"></div>
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
