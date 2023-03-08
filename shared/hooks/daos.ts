import React from "react";

import {onGetUserDaos} from "@redux/actions/daos";
import {useAppDispatch, useAppSelector} from "@redux/store";

export const useDao = () => {
  const {daos, loaded} = useAppSelector((state) => state.daos);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (!loaded) dispatch(onGetUserDaos());
  }, [loaded]);

  return {dao: daos[0], loaded};
};
