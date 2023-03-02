import React from "react";
import {useRouter} from "next/router";

import {Card} from "@shared/components/common/Card";
import {useAppDispatch, useAppSelector} from "@redux/store";
import {getDateDay} from "@helpers/index";
import DataTable from "@shared/components/common/data_table";
import Spiner from "@shared/components/common/Spiner";
import {MiniDaoTypeBadge} from "@shared/components/common/DaoTypeBadge";
import {LocalAtmOutlined, PieChartOutlineOutlined, WidgetsOutlined} from "@mui/icons-material";
import {MiniDaoType} from "@shared/components/CreateMiniDao";
import {useDaos} from "@shared/hooks/daos";

const MINI_DAO_HEADERS = [
  {title: "Name", value: "token_name"},
  {title: "Address", value: "address"},
  {title: "Type", value: "type"},
  {title: "Creation Date", value: "creation_date"},
  {title: "Yes/No (Total)", value: "total_votes"},
];

const Dashboard = () => {
  const daos = useDaos();
  const router = useRouter();
  const parsedDaos = React.useMemo(() => {
    return daos.daos
      .map((dao) => {
        //if (!dao.mini_daos) dispatch(onGetMiniDaos({daoId: dao.id}));

        return {
          ...dao,
          mini_daos: [],
          //mini_daos: dao.mini_daos?.map((mini) => ({
          //token_name: mini.token.name,
          //address: mini.address,
          //type: mini.type,
          //creation_date: getDateDay(Number(mini.createdAt) * 1000),
          //total_votes: mini.votesLength,
          //main_dao: dao.id,
          //id: mini.id,
          //loans: mini.manager.loans.length,
          //pools: mini.manager.pools.length,
          //})),
        };
      })
      .sort((a, b) => b.mini_daos?.length - a.mini_daos?.length);
  }, [daos]);

  const {numberOfMiniDaos, numberOfLoans, numberOfPools} = React.useMemo(() => {
    return parsedDaos.reduce(
      (acc, dao) => {
        acc.numberOfMiniDaos += dao.mini_daos?.length || 0;
        acc.numberOfLoans += dao.mini_daos?.reduce((acc, cur) => acc + cur.loans, 0) || 0;
        acc.numberOfPools += dao.mini_daos?.reduce((acc, cur) => acc + cur.pools, 0) || 0;
        return acc;
      },
      {numberOfMiniDaos: 0, numberOfLoans: 0, numberOfPools: 0}
    );
  }, [parsedDaos]);

  const onSelectDao = (dao: typeof parsedDaos[0]["mini_daos"][0]) => {
    router.push(`/lending/mini_dao?main_dao=${dao.main_dao}&mini_dao=${dao.id}`);
  };

  return (
    <>
      <div className="flex flex-col items-center w-full overflow-scroll pt-20 pb-4 h-full">
        <div className="flex gap-4 w-full h-44">
          <Card className="pt-5 px-5 flex flex-col w-52">
            <div className="bg-orange_custom mb-7 w-12 h-12 rounded-md flex justify-center items-center">
              <WidgetsOutlined style={{fontSize: 28}} className="text-white" />
            </div>
            <span className="text-md font-semibold mb-1">Total Mini Daos</span>
            <span className="text-xl">{numberOfMiniDaos}</span>
          </Card>
          <Card className="pt-5 px-5 flex flex-col w-52">
            <div className="bg-orange_custom mb-7 w-12 h-12 rounded-md flex justify-center items-center">
              <LocalAtmOutlined style={{fontSize: 28}} className="text-white" />
            </div>
            <span className="text-md font-semibold mb-1">Total Loans</span>
            <span className="text-xl">{numberOfLoans}</span>
          </Card>
          <Card className="pt-5 px-5 flex flex-col w-52">
            <div className="bg-orange_custom mb-7 w-12 h-12 rounded-md flex justify-center items-center">
              <PieChartOutlineOutlined style={{fontSize: 28}} className="text-white" />
            </div>
            <span className="text-md font-semibold mb-1">Total Pools</span>
            <span className="text-xl">{numberOfPools}</span>
          </Card>
        </div>
        {parsedDaos.length > 0 ? (
          parsedDaos.map((dao, i) => (
            <div className="w-full mb-20" key={i}>
              <DataTable
                setSelected={onSelectDao}
                data={dao.mini_daos || []}
                headers={MINI_DAO_HEADERS}
                custom_row={{
                  token_name: ({token_name}) => <span className="text-orange">{token_name}</span>,
                  type: ({type}: {type: MiniDaoType}) => <MiniDaoTypeBadge type={type} />,
                }}
                custom={{
                  head: () => (
                    <div className="mt-6 mb-3 w-full flex justify-between">
                      <div className="w-full flex items-center">
                        <span className="capitalize mr-5 text-2xl font-semibold">
                          {dao.type === "aragon" ? dao.name.split(".")[0] : dao.name}
                        </span>
                      </div>
                    </div>
                  ),
                  body: Array.isArray(dao.mini_daos)
                    ? dao.mini_daos.length > 0
                      ? undefined
                      : () => (
                        <div className="p-4 flex justify-center items-center border-t border-gray-700">
                          <span className="text-center"> There are no Mini DAOs</span>
                        </div>
                      )
                    : () => (
                      <div className="h-36 w-full flex justify-center items-center">
                        <Spiner size={50} />
                      </div>
                    ),
                }}
              />
            </div>
          ))
        ) : daos.loaded ? (
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
