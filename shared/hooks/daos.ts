import React from "react";

import {onGetUserDaos} from "@redux/actions/daos";
import {useAppDispatch, useAppSelector} from "@redux/store";
import {useWeb3React} from "@web3-react/core";
import {onSubscribeEvents} from "@redux/actions";

export const useDaos = () => {
  const {daos, loaded} = useAppSelector((state) => state.daos);
  const dispatch = useAppDispatch();
  const {provider} = useWeb3React();

  const loadDaos = async (loaded: boolean) => {
    if (!loaded) {
      await dispatch(onGetUserDaos(provider));
      await dispatch(onSubscribeEvents());
    }
  };

  React.useEffect(() => {
    loadDaos(loaded);
  }, [loaded]);

  return {daos, loaded};
};

export const useProposals = (daoId?: string) => {
  const {daos, loaded} = useAppSelector((state) => state.daos);
  const {provider} = useWeb3React();
  const dispatch = useAppDispatch();
  const dao = (daoId ? daos.find((d) => d.id === daoId) : daos[0]) as MiniDAO;

  React.useEffect(() => {
    if (!loaded) dispatch(onGetUserDaos(provider));
    //if (!dao.proposals)
  }, [loaded]);

  return {proposals: dao.proposals, loaded};
};
