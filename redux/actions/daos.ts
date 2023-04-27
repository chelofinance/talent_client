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
import {GovernorsQuery} from "__generated__/gql/graphql";

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
  const coreContract = attach("RoundVoting", coreAddress, provider);
  const rawRound = await coreContract.getRound(roundId);

  const round: GovernorsQuery["proposalRounds"][0] = {
    id: roundId.toString(),
    startBlock: rawRound.voteStart.toString(),
    endBlock: rawRound.voteEnd.toString(),
    description: rawRound.description.toString(),
    executeThreshold: rawRound.executeThreshold.toString(),
    roleVotes: [],
  };

  return {round: await getRoundInfo(round), daoId: coreAddress};
});

export const onTokenMint = createAsyncThunk<
  {coreAddress: string; account: string; role: string; stake: string},
  {
    from: string;
    to: string;
    coreAddress: string;
    id: BigNumber;
    amount: BigNumber;
  },
  {state: RootState}
>(actionTypes.TOKEN_MINT, async ({coreAddress, to, id, amount}) => ({
  coreAddress,
  account: to.toString(),
  role: id.toString(),
  stake: amount.toString(),
}));

export const onTokenBurn = createAsyncThunk<
  {coreAddress: string; account: string; role: string; stake: string},
  {
    from: string;
    to: string;
    coreAddress: string;
    id: BigNumber;
    amount: BigNumber;
  },
  {state: RootState}
>(actionTypes.TOKEN_BURN, async ({coreAddress, from, id, amount}) => ({
  coreAddress,
  account: from.toString(),
  role: id.toString(),
  stake: amount.toString(),
}));
