import axios from "axios";

import {getNetworkConfig} from "@helpers/network";
import {UserDaos, USER_DAOS_QUERY} from "./gql";
import {ethers} from "ethers";
import {decodeWithIfaces} from "@helpers/connection/utils";

type MiniMeFactoryCall = {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  contractAddress: string;
  input: string;
  type: string;
  gas: string;
  gasUsed: string;
  traceId: string;
  isError: string;
  errCode: string;
};

type TokenTransfersCall = {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
};

const makeCall = async ({
  account,
  networkId,
}: {
  account: string;
  networkId: SupportedNetworks;
}) => {
  const {endpoints, addresses} = getNetworkConfig(networkId);
  const responses = await Promise.all([
    axios.request<{result: MiniMeFactoryCall[]; status: string}>({
      method: "get",
      url: `${endpoints.explorer
        }&module=account&action=txlistinternal&address=${addresses.aragonMiniMeFactory.toLowerCase()}&startblock=0&page=1&sort=asc`,
      headers: {
        "Content-Type": "application/json",
      },
    }),
    axios.request<{result: TokenTransfersCall[]; status: string}>({
      method: "get",
      url: `${endpoints.explorer
        }&module=account&action=tokentx&address=${account.toLowerCase()}&startblock=0&sort=asc`,
      headers: {"Content-Type": "application/json"},
    }),
  ]);

  if (responses[0].data.status === "0" || responses[1].data.status === "0")
    return {success: false};

  return {
    success: true,
    rawDaoTokens: responses[0].data.status === "0" ? {result: []} : responses[0].data,
    userTokens: responses[1].data.status === "0" ? {result: []} : responses[1].data,
  };
};

const getDaoTokensTxs = async (args: {account: string; networkId: SupportedNetworks}) => {
  const {networkId} = args;
  let rawDaoTokens: {result: MiniMeFactoryCall[]}, userTokens: {result: TokenTransfersCall[]};

  while (true) {
    const res = await makeCall(args);
    if (res.success) {
      rawDaoTokens = rawDaoTokens?.result ? rawDaoTokens : res.rawDaoTokens;
      userTokens = userTokens?.result ? userTokens : res.userTokens;
      break;
    }
    console.log("trying");
  }

  const daoTokens = rawDaoTokens.result.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.contractAddress]: {creationHash: cur.hash, token: cur.contractAddress},
    }),
    {} as Record<string, {creationHash: string; token: string}>
  );

  const finalTokens = userTokens.result.filter((tkn) => daoTokens[tkn.contractAddress]);

  return finalTokens.map((tkn) => daoTokens[tkn.contractAddress]);
};

export const getUserAragonDAOs = async (args: {
  account: string;
  networkId: SupportedNetworks;
}): Promise<AragonDAO[]> => {
  const {networkId, account} = args;
  const {endpoints} = getNetworkConfig(networkId);

  const data = await fetch(endpoints.chelo_aragon, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: USER_DAOS_QUERY,
      variables: {id: account.toLowerCase()},
    }),
  });

  if (data.ok) {
    const json: {data: {accounts: UserDaos[]}} = await data.json();
    if (!json.data.accounts || !json.data.accounts[0]) {
      return [];
    }
    return json.data.accounts[0]?.ERC20balances.map((balance) => {
      const aragonCompany = new ethers.utils.Interface([
        "function newTokenAndInstance(string _tokenName,string _tokenSymbol,string _id,address[] _holders,uint256[] _stakes,uint64[3] _votingSettings,uint64 _financePeriod,bool _useAgentAsVault)",
      ]);
      const membershipCompany = new ethers.utils.Interface([
        "function newTokenAndInstance(string _tokenName,string _tokenSymbol,string _id,address[] _members,uint64[3] _votingSettings,uint64 _financePeriod,bool _useAgentAsVault)",
      ]);
      const decodedData = decodeWithIfaces(
        [
          {iface: aragonCompany, fn: "newTokenAndInstance"},
          {iface: membershipCompany, fn: "newTokenAndInstance"},
        ],
        balance.contract.organization.txInput
      );

      if (!decodedData) return null;

      const aragon: AragonDAO = {
        id: balance.contract.organization.id,
        name: decodedData._id,
        apps: [],
        address: balance.contract.organization.id,
        wallet: "",
        createdAt: 0,
        type: "aragon",
        isRoot: true,
      };

      return aragon;
    }).filter(Boolean);
  }

  return [];
};
