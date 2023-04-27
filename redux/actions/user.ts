import {createAsyncThunk, createAction} from "@reduxjs/toolkit";

import * as actionTypes from "@redux/constants";
import {getERC20Balances, getERC721Balances} from "@helpers/erc/utils";
import {addNetwork, getProvider, switchNetwork} from "@helpers/index";
import {ConnectionType, network} from "@helpers/connection";
import {Connector} from "@web3-react/types";
import {getConnection} from "@helpers/connection/utils";
import {TransactionMeta} from "types";
import {getNetworkConfig} from "@helpers/network";
import {RootState} from "@redux/store";
import {attach} from "@helpers/contracts";
import {BigNumber, ethers} from "ethers";
import {
  onCreateProposal,
  onProposalExecuted,
  onRoundCreated,
  onTokenBurn,
  onTokenMint,
  onVoteCast,
} from "./daos";
import {Log} from "@ethersproject/providers";

export const onConnectWallet = createAsyncThunk<
  {
    erc20: ERC20[];
    erc721: ERC721[];
    account: string;
    wallet: ConnectionType;
    networkId: SupportedNetworks;
  },
  {connection: Connector; account: string; chainId: number},
  {rejectValue: StateErrorType}
>(actionTypes.CONNECT_WALLET, async (args, {rejectWithValue, dispatch}) => {
  let {connection, account, chainId} = args;

  return {
    erc20: [],
    erc721: [],
    account,
    wallet: getConnection(connection).type,
    networkId: chainId as SupportedNetworks,
  };
});

export const onLoadWalletAssets = createAsyncThunk<
  {erc20: ERC20[]; erc721: ERC721[]; account: string; wallet: ConnectionType},
  {wallet: ConnectionType; account: string; networkId: SupportedNetworks},
  {rejectValue: StateErrorType}
>(actionTypes.LOAD_ASSETS, async ({wallet, networkId, account}, {rejectWithValue}) => {
  try {
    const userTokens = await getERC20Balances(account, networkId);
    const userNfts = await getERC721Balances(account, networkId);

    return {
      erc20: userTokens,
      erc721: userNfts,
      account,
      wallet,
    };
  } catch (err) {
    console.log("onLoadWalletAssets", err);
    return rejectWithValue({
      message: err.message,
      code: err.code,
      open: true,
    } as StateErrorType);
  }
});

export const onDisconnectWallet = createAsyncThunk(actionTypes.CONNECT_WALLET, () => {
  return {
    account: "",
    erc20: [],
    erc721: [],
    wallet: "",
    networkId: 1,
  };
});

export const onSwitchNetwork = createAsyncThunk<
  {network: SupportedNetworks},
  {networkId: SupportedNetworks; connector: Connector},
  {rejectValue: StateErrorType}
>(
  actionTypes.SWITCH_NETWORK,
  async (
    {networkId, connector}: {networkId: SupportedNetworks; connector: Connector},
    {rejectWithValue}
  ) => {
    try {
      await connector.activate(networkId);
      await switchNetwork(networkId); //rinkeby

      return {network: networkId};
    } catch (err) {
      console.log({err});
      const network = getNetworkConfig(networkId);
      try {
        if (err.code === 4902) {
          await addNetwork({
            chainId: networkId,
            name: network.settings.name,
            currency: {
              name: network.settings.currency,
              decimals: 18,
              symbol: network.settings.currency,
            },
            rpcUrl: network.settings.explorer,
          });
          return {network: networkId};
        } else if (err.code === -32603) {
          return rejectWithValue({
            message: `Seems like we can't switch network automatically. Please check if you can change it from the wallet`,
            code: err.code,
            open: true,
          } as StateErrorType);
        }
      } catch (err) {
        console.log({onConnectWallet: err});
      }
      return rejectWithValue({
        message: err.message,
        code: err.code,
        open: true,
      } as StateErrorType);
    }
  }
);

export const onUpdateError = createAction(
  actionTypes.UPDATE_ERROR,
  (error: {message?: string; code?: string; open?: boolean}) => {
    return {payload: error};
  }
);

export const onShowTransaction = createAction(
  actionTypes.SHOW_TRANSACTION,
  (transactionInfo: TransactionMeta | boolean) => {
    return {
      payload: transactionInfo,
    };
  }
);

export const onSubscribeEvents = createAsyncThunk<boolean, void, {state: RootState}>(
  actionTypes.SUBSCRIBE_EVENTS,
  async (_, {getState, dispatch, rejectWithValue}) => {
    const state = getState();
    const chainId = state.user.account.networkId;
    const dao = state.daos.daos[0] as MiniDAO;
    const {provider: rpc} = getNetworkConfig(chainId);
    const provider = getProvider(rpc);

    const coreContract = attach("RoundVoting", dao.id, provider);
    const token = attach("ERC1155", dao.token.address, provider);

    coreContract.on(
      "ProposalCreated",
      (
        ...args: [
          BigNumber,
          string,
          string[],
          BigNumber[],
          string[],
          string[],
          BigNumber,
          BigNumber,
          BigNumber,
          string,
          Log
        ]
      ) => {
        const [
          proposalId,
          proposer,
          targets,
          values,
          signatures,
          calldatas,
          roundId,
          startBlock,
          endBlock,
          description,
          event,
        ] = args;
        dispatch(
          onCreateProposal({
            proposalId,
            proposer,
            roundId,
            targets,
            values,
            signatures,
            calldatas,
            startBlock,
            endBlock,
            description,
            coreAddress: dao.id,
          })
        );
      }
    );

    coreContract.on("VoteCast", (...args: [string, BigNumber, number, BigNumber, string, Log]) => {
      const [voter, proposalId, support, votes, reason, event] = args;
      console.log("VoteCast", args);
      dispatch(onVoteCast({voter, proposalId, support, votes, reason, coreAddress: dao.id}));
    });

    coreContract.on("ProposalExecuted", (...args: [BigNumber, Log]) => {
      const [proposalId, event] = args;
      console.log("ProposalExecuted", args);
      dispatch(
        onProposalExecuted({
          proposalId,
          coreAddress: dao.id,
        })
      );
    });

    coreContract.on("RoundCreated", (...args: [BigNumber, Log]) => {
      const [roundId, event] = args;
      console.log("RoundCreated", roundId, event);
      dispatch(
        onRoundCreated({
          roundId,
          coreAddress: dao.id,
        })
      );
    });

    token.on(
      "TransferSingle",
      (...args: [string, string, string, BigNumber, BigNumber, unknown, Log]) => {
        const [_operator, from, to, idRole, amount, _data, log] = args;
        console.log("TransferSingle", from, to, idRole, amount);

        if (from === ethers.constants.AddressZero) {
          //mint
          dispatch(
            onTokenMint({
              from,
              to,
              id: idRole,
              amount: amount,
              coreAddress: dao.id,
            })
          );
        } else {
          // burn
          dispatch(
            onTokenBurn({
              from,
              to,
              id: idRole,
              amount: amount,
              coreAddress: dao.id,
            })
          );
        }
      }
    );

    return true;
  }
);
