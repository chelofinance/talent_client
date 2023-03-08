import {createAsyncThunk} from "@reduxjs/toolkit";

import * as actionTypes from "@redux/constants";
import {RootState} from "@redux/store";
import {DaoManager} from "@shared/sdk";
import {getProvider} from "@helpers/index";
import {getNetworkConfig} from "@helpers/network";

export const onGetUserDaos = createAsyncThunk<DAO[], void, {state: RootState}>(
  actionTypes.GET_USER_DAOS,
  async (_, {rejectWithValue, getState}) => {
    try {
      const {user} = getState();
      const {provider: rpc} = getNetworkConfig(user.account.networkId);
      const provider = getProvider(rpc);
      const controllers = await DaoManager.getAllDaosOfType(
        provider,
        user.account.address,
        "chelo"
      );

      const res = controllers.map((controller) => controller.dao);
      return res;
    } catch (err) {
      console.log("onGetUserDaos", err);
      return rejectWithValue({
        message: err.message,
        code: err.code,
        open: true,
      } as StateErrorType);
    }
  }
);
