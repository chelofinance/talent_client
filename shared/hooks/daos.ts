import React from "react";

import {onGetUserDaos} from "@redux/actions/daos";
import {useAppDispatch, useAppSelector} from "@redux/store";
import {useWeb3React} from "@web3-react/core";
import {onLoadWalletAssets, onSubscribeEvents} from "@redux/actions";

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

  return {daos: daos as MiniDAO[], loaded};
};

export const useProposals = (roundId: string) => {
  const {daos, loaded} = useAppSelector((state) => state.daos);
  const {provider} = useWeb3React();
  const dispatch = useAppDispatch();
  const dao = daos[daos.length - 1] as MiniDAO;
  const round = dao?.rounds?.find((round) => round.id === roundId);

  React.useEffect(() => {
    if (!loaded) dispatch(onGetUserDaos(provider));
    //if (!dao.proposals)
  }, [loaded]);

  return {proposals: round?.proposals || [], loaded, round};
};

export const useRole = (): Record<RoleNames, boolean> => {
  const {account} = useAppSelector((state) => state.user);
  const roles = account.roles.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.name]: true,
    }),
    {} as Record<RoleNames, boolean>
  );

  return roles;
};
