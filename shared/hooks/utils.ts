import React from "react";
import {useRouter} from "next/router";

import {useAppDispatch, useAppSelector} from "@redux/store";
import {onLoadCollateral, onLoadDaoMembers, onLoadVotes} from "@redux/actions";

export const useLoading = <T extends Record<string, boolean>>(initState: T) => {
  const [loading, setLoading] = React.useState<T>(initState);

  const handleSetLoading = (field: keyof T, value?: boolean) => {
    if (value === undefined) value = !loading[field];
    setLoading((prev) => ({...prev, [field]: value}));
  };

  return [loading, handleSetLoading] as [T, typeof handleSetLoading];
};

const defaultMiniDao: MiniDAO = {
  id: "",
  wallet: "",
  apps: [],
  createdAt: 0,
  address: "",
  token: {} as any,
  name: "",
  type: "membership",
  manager: {} as any,
  vote_duration: "",
  support: "",
  quorum: "",
  votesLength: "",
};

export const useMiniDao = (daoOrAddress?: string) => {
  const router = useRouter();
  const {mini_dao} = router.query;
  const finalId = daoOrAddress || mini_dao;
  const mini_daos = useGetMiniDaos();

  const miniDao =
    mini_daos.find((dao) => dao.id == finalId || dao.address === finalId) || defaultMiniDao;

  return miniDao;
};

export const useMainDao = (daoOrAddress?: string): DAO => {
  const router = useRouter();
  const {main_dao} = router.query;
  const miniDao = useMiniDao(daoOrAddress);
  const daos = useAppSelector((state) => state.daos);

  return (
    daos.find(
      (dao) => dao.mini_daos?.find((mini) => mini.id === miniDao.id) || dao.id === main_dao
    ) || daos[2]
  );
};

export const useVotes = (daoOrAddress?: string) => {
  const miniDao = useMiniDao(daoOrAddress);
  const dispatch = useAppDispatch();
  const loaded = Array.isArray(miniDao.votes);

  const {active, inactive} = React.useMemo(() => {
    return {
      active: miniDao.votes?.filter((vote) => vote.active) || [],
      inactive: miniDao.votes?.filter((vote) => !vote.active) || [],
    };
  }, [miniDao]);

  React.useEffect(() => {
    if (!loaded) dispatch(onLoadVotes({daoAddress: miniDao.address}));
  }, [miniDao.votes, miniDao.votesLength]);

  return {active, inactive, loaded};
};

export const useGetMembers = (daoId: string) => {
  const daos = useAppSelector((state) => state.daos);
  const mini_daos = useGetMiniDaos();
  const finalDao = daos.find(({id}) => id === daoId) || mini_daos.find(({id}) => id === daoId);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (!finalDao?.members) dispatch(onLoadDaoMembers({daoId}));
  }, []);

  return finalDao?.members || [];
};

export const useGetMiniDaos = (): (MiniDAO & {main_dao: string})[] => {
  const daos = useAppSelector((state) => state.daos);
  return daos.daos.reduce(
    (acc, cur) => acc.concat(cur.mini_daos?.map((mini) => ({...mini, main_dao: cur.id})) || []),
    [] as (MiniDAO & {main_dao: string})[]
  );
};
