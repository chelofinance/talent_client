import {createReducer} from "@reduxjs/toolkit";
import * as actions from "../actions/daos";

const dao_state: {daos: DAO[]; loaded: boolean} = {
    daos: [],
    loaded: false,
};

export const daoReducer = createReducer(dao_state, (builder) => {
    builder.addCase(actions.onGetUserDaos.fulfilled, (state, action) => {
        state.daos.push(...action.payload);
        state.loaded = true;
    });
});
