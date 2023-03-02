import {onGetUserDaos} from "@redux/actions/daos";
import {useAppDispatch, useAppSelector} from "@redux/store";

export const useDaos = () => {
  const daos = useAppSelector((state) => state.daos);
  const dispatch = useAppDispatch();

  if (daos.daos.length > 0) return daos;
  else dispatch(onGetUserDaos());

  return daos;
};
