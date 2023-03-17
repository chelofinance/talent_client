import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {JsonRpcProvider, Web3Provider} from "@ethersproject/providers";

import * as actionTypes from "@redux/constants";
import {RootState} from "@redux/store";
import {DaoManager} from "@shared/sdk";
import {BigNumber} from "ethers";
import {getIpfsProposal} from "@helpers/chelo";

export const onGetUserDaos = createAsyncThunk<
  DAO[],
  Web3Provider | JsonRpcProvider,
  {state: RootState}
>(actionTypes.GET_USER_DAOS, async (userProvider, {rejectWithValue, getState}) => {
  try {
    const {user} = getState();
    const controllers = await DaoManager.getAllDaosOfType(
      userProvider,
      user.account.address,
      "chelo"
    );

    const res = controllers.map((controller) => controller.dao);
    return res;
  } catch (err) {
    return rejectWithValue({
      message: err.message,
      code: err.code,
      open: true,
    } as StateErrorType);
  }
});

interface CreateProposalArgs {
  proposalId: BigNumber;
  proposer: string;
  targets: string[];
  values: BigNumber[];
  signatures: string[];
  calldatas: string[];
  startBlock: BigNumber;
  endBlock: BigNumber;
  description: string;
  coreAddress: string;
}

export const onCreateProposal = createAsyncThunk(
  actionTypes.CREATE_PROPOSAL,
  async ({
    proposalId,
    proposer,
    targets,
    values,
    signatures,
    calldatas,
    startBlock,
    endBlock,
    description,
    coreAddress,
  }: CreateProposalArgs) => {
    const metadata = await getIpfsProposal(`${description}/upload.json`);
    const proposal: MiniDaoProposal = {
      description,
      endBlock: endBlock.toString(),
      id: coreAddress + "/" + proposalId.toHexString(),
      canceled: false,
      executed: false,
      proposalId: proposalId.toString(),
      votesYes: "0",
      votesNo: "0",
      metadata,
    };

    return {
      proposal,
      coreAddress,
    };
  }
);

export const onVoteCast = createAction(
  actionTypes.VOTE_CAST,
  (payload: {
    voter: string;
    proposalId: BigNumber;
    votes: BigNumber;
    support: number;
    reason: string;
    coreAddress: string;
  }) => ({
    payload,
  })
);

export const onProposalExecuted = createAction(
  actionTypes.PROPOSAL_EXECUTED,
  (payload: {proposalId: BigNumber; coreAddress: string}) => ({
    payload,
  })
);
