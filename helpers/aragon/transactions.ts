import {encodeActCall, encodeCallScript} from "@1hive/evmcrispr";
import {getNetworkConfig} from "@helpers/network";
import {attach} from "@helpers/contracts";
import {JsonRpcProvider, Web3Provider} from "@ethersproject/providers";
import {ContractTransaction} from "ethers";

export const createMiniDao = (args: {
  daoName: string;
  members: string[];
  stakes: string[];
  type: "membership" | "reputation" | "company";
  quorum: string;
  support: string;
  voteDuration: string;
  networkId: SupportedNetworks;
  depositToken: string;
  deposit: string;
}): CheloTransactionRequest[] => {
  const {
    daoName,
    members,
    stakes,
    type,
    quorum,
    support,
    voteDuration,
    networkId,
    depositToken,
    deposit,
  } = args;
  const {
    addresses: {membership, company, reputation},
  } = getNetworkConfig(networkId);
  const address =
    args.type === "membership" ? membership : args.type === "company" ? company : reputation;
  const membershipArgs = [daoName, members, [support, quorum, voteDuration], depositToken, deposit];
  const companyArgs = [
    daoName,
    members,
    stakes,
    [support, quorum, voteDuration],
    depositToken,
    deposit,
  ];

  return [
    {
      to: address,
      signature:
        args.type === "membership"
          ? "newTokenAndInstance(string,address[],uint64[3],address,uint256)"
          : "newTokenAndInstance(string,address[],uint256[],uint64[3],address,uint256)",
      args: args.type === "membership" ? membershipArgs : companyArgs,
    },
  ];
};

export const addMiniDaoMember = (args: {
  members: {account: string; stake?: string}[];
  tokenManager: string;
}): CheloTransactionRequest[] => {
  const {members, tokenManager} = args;
  const txs = members.map(({account, stake}) => ({
    to: tokenManager,
    signature: "mint(address,uint256)",
    args: [account, stake || "1"],
  }));

  return txs;
};

export const reduceMemberStake = (args: {
  member: {account: string; stake: string};
  tokenManager: string;
}): CheloTransactionRequest[] => {
  const {account, stake} = args.member;
  return [
    {
      to: args.tokenManager,
      signature: "burn(address,uint256)",
      args: [account, stake],
    },
  ];
};

export const simpleAragonExec = async (args: {
  transactions: CheloTransactionRequest[];
  apps: AragonApp[];
  provider: Web3Provider | JsonRpcProvider;
}): Promise<ContractTransaction> => {
  const {transactions, apps, provider} = args;
  const agent = apps.find(({repoName}) => repoName === "agent").address;
  const voting = apps.find(({repoName}) => repoName === "voting").address;
  const manager = apps.find(({repoName}) => repoName === "token-manager").address;

  const votingScript = encodeCallScript(
    transactions.map(({signature, args, to}) => ({
      to: agent,
      data: encodeActCall("execute(address,uint256,bytes)", [
        to,
        0,
        encodeActCall(signature, args),
      ]),
    }))
  );
  const tokenManagerScript = encodeCallScript([
    {
      to: voting,
      data: encodeActCall("newVote(bytes,string)", [votingScript, "metadata"]),
    },
  ]);

  const tokenManager = attach("TokenManager", manager, provider.getSigner());

  return await tokenManager.forward(tokenManagerScript);
};
