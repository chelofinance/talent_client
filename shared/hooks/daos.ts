import React from "react";

import { onGetUserDaos } from "@redux/actions/daos";
import { useAppDispatch, useAppSelector } from "@redux/store";

export const useDaos = () => {
  const { daos, loaded } = useAppSelector((state) => state.daos);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (!loaded) dispatch(onGetUserDaos());
  }, [loaded]);

  return { daos, loaded };
};

export const useProposals = (daoId?: string) => {
  const { daos, loaded } = useAppSelector((state) => state.daos);
  const dispatch = useAppDispatch();
  const dao = (daoId ? daos.find((d) => d.id === daoId) : daos[0]) as MiniDAO;

  React.useEffect(() => {
    if (!loaded) dispatch(onGetUserDaos());
    //if (!dao.proposals)
  }, [loaded]);

  return { proposals: dao.proposals, loaded };
};
