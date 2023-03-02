import {createAsyncThunk} from "@reduxjs/toolkit";

import * as actionTypes from "@redux/constants";
import {getAragonDAO} from "@helpers/aragon";
import {getSnapshotDao, getSyndicateDao} from "@helpers/chelo/services/graph";
import {RootState} from "@redux/store";
import {ConnectionType} from "@helpers/connection";
import {DaoManager} from "@shared/sdk";
import {getProvider} from "@helpers/index";
import {getNetworkConfig} from "@helpers/network";

export const onGetAragonDao = createAsyncThunk<
  AragonDAO,
  {ens: string; daoAddress: string},
  {state: RootState}
>(actionTypes.GET_ARAGON, async ({daoAddress, ens}, {rejectWithValue, getState}) => {
  try {
    const {user} = getState();
    const dao = await getAragonDAO(daoAddress, user.account.networkId);
    const agent = dao.apps.find(({repoName}) => repoName === "agent").address;

    const res: AragonDAO = {
      ...dao,
      id: daoAddress,
      wallet: agent,
      apps: dao.apps,
      name: ens.split(".")[0],
      type: "aragon",
      isRoot: true,
      createdAt: 0,
    };
    return res;
  } catch (err) {
    console.log("onGetAragonDao", err);
    rejectWithValue(err.message);
  }
});

export const onGetSnapshotDao = createAsyncThunk<
  SnapshotDAO,
  {ens: string},
  {state: RootState}
>(
  actionTypes.GET_SNAPSHOT,
  async (
    {
      ens,
    }: {
      ens: string;
    },
    {rejectWithValue, getState}
  ): Promise<SnapshotDAO> => {
    try {
      const {user} = getState();
      const space = await getSnapshotDao(ens);
      if (!space) return null;

      return {
        id: space.id,
        ens: ens,
        wallet: user.account.wallet === ConnectionType.GNOSIS_SAFE ? user.account.address : "",
        isRoot: true,
        members: space.members.concat(space.admins).map((account) => ({account, stake: "0"})),
        name: space.name,
        type: "snapshot",
      };
    } catch (err) {
      console.log("onGetSnapshotDao", err);
      rejectWithValue(err.message);
    }
  }
);

export const onGetSyndicateDao = createAsyncThunk<
  SyndicateDao,
  {address: string},
  {state: RootState}
>(actionTypes.GET_SYNDICATE, async ({address}, {rejectWithValue, getState}) => {
  try {
    const {user} = getState();
    const syndicate = await getSyndicateDao({address, networkId: user.account.networkId});

    if (!syndicate) return null;

    return {
      id: syndicate.id,
      wallet: syndicate.ownerAddress,
      members: syndicate.members.map((member) => ({
        account: member.member.memberAddress,
        stake: member.depositAmount,
      })),
      isRoot: true,
      name: syndicate.name,
      type: "syndicate",
    };
  } catch (err) {
    console.log("connect aragon dao", err);
    rejectWithValue(err.message);
  }
});

export const onGetUserDaos = createAsyncThunk<DAO[], void, {state: RootState}>(
  actionTypes.GET_USER_DAOS,
  async (_, {rejectWithValue, getState}) => {
    try {
      const {user} = getState();
      const {provider: rpc} = getNetworkConfig(user.account.networkId);
      const provider = getProvider(rpc);
      const controllers = await DaoManager.getUserDaos(provider, user.account.address);

      return controllers.map((controller) => controller.dao);
    } catch (err) {
      console.log("onGetUserDaos", err);
    }
  }
);
