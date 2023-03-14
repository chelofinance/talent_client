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
