import {configureStore} from "@reduxjs/toolkit";
import {createWrapper} from "next-redux-wrapper";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import mainReducer from "@redux/reducers/index";

export const makeStore = () =>
  configureStore({
    reducer: mainReducer,
  });

type Store = ReturnType<typeof makeStore>;

export type RootState = ReturnType<Store["getState"]>;
export type AppDispatch = Store["dispatch"];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const wrapper = createWrapper(makeStore, {debug: true});
