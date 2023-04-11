import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {JsonRpcProvider, Web3Provider} from "@ethersproject/providers";

import * as actionTypes from "@redux/constants";
import {RootState} from "@redux/store";
import {DaoManager} from "@shared/sdk";
import {BigNumber} from "ethers";
import {getIpfsProposal, getRoundInfo} from "@helpers/chelo";
import {attach} from "@helpers/contracts";
import {getNetworkConfig} from "@helpers/network";
import {getProvider} from "@helpers/index";

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
  roundId: BigNumber;
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
    roundId,
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
    const metadata = await getIpfsProposal(description);
    const proposal: MiniDaoProposal = {
      calls: [],
      roundId: roundId.toString(),
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
  }) => {
    return {
      payload,
    };
  }
);

export const onProposalExecuted = createAction(
  actionTypes.PROPOSAL_EXECUTED,
  (payload: {proposalId: BigNumber; coreAddress: string}) => ({
    payload,
  })
);

export const onRoundCreated = createAsyncThunk<
  {round: ProposalRound; daoId: string},
  {roundId: BigNumber; coreAddress: string},
  {state: RootState}
>(actionTypes.ROUND_CREATED, async ({roundId, coreAddress}, {getState}) => {
  const {
    user: {
      account: {networkId},
    },
  } = getState();
  const {provider: rpc} = getNetworkConfig(networkId);
  const provider = getProvider(rpc);
  const block = await provider.getBlock("latest");
  const coreContract = attach("RoundVoting", coreAddress, provider);
  const rawRound = await coreContract.getRound(roundId);

  const round: ProposalRound = {
    id: roundId.toString(),
    finished: block.number >= Number(rawRound.voteEnd),
    startBlock: rawRound.voteStart.toString(),
    endBlock: rawRound.voteEnd.toString(),
    description: rawRound.description.toString(),
    executeThreshold: rawRound.executeThreshold.toString(),
    proposals: [],
  };

  return {round: await getRoundInfo(round), daoId: coreAddress};
});
