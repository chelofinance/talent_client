import {combineReducers, AnyAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
//import {diff} from "jsondiffpatch";

import {daoReducer} from "@redux/reducers/daos";
import {userReducer} from "@redux/reducers/user";
import {tokensReducer} from "@redux/reducers/tokens";

const reducer = combineReducers({
    daos: daoReducer,
    user: userReducer,
    tokens: tokensReducer,
});

const finalReducer = (state: ReturnType<typeof reducer>, action: AnyAction) => {
    if (action.type === HYDRATE) {
        return state;
    } else {
        return reducer(state, action);
    }
};

export default finalReducer;
