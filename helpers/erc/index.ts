import axios from "axios";
import {ethers} from "ethers";
import {TokenList} from "@uniswap/token-lists";

import {attach} from "@helpers/contracts";
import {getNetworkConfig} from "@helpers/network";
import {TransactionRequest} from "@ethersproject/providers";

export const DEFAULT_TOKEN_LIST = "https://gateway.ipfs.io/ipns/tokens.uniswap.org";

const listCache = new Map<string, TokenList>();

export const getTokenList = async (): Promise<TokenList> => {
  const cached = listCache?.get(DEFAULT_TOKEN_LIST); // avoid spurious re-fetches
  if (cached) {
    return cached;
  }
  const res = await axios.get(DEFAULT_TOKEN_LIST);
  return res.data;
};

export const approveERC1155 = (args: {contract: string; target: string}): TransactionRequest => {
  const {contract, target} = args;
  const erc1155 = attach("ERC1155", args.contract);

  return {
    to: contract,
    data: erc1155.interface.encodeFunctionData("setApprovalForAll", [target, true]),
    value: 0,
  };
};

export const approveERC20 = (args: {
  amount: string;
  target: string;
  contract: string;
}): CheloTransactionRequest => {
  const {amount, target, contract} = args;
  console.log({approveERC20: args});

  const res = {
    to: contract,
    signature: "approve(address,uint256)",
    args: [target, amount],
    value: 0,
  };
  return res;
};

export const approveERC721 = (args: {
  id: string;
  target: string;
  contract: string;
}): CheloTransactionRequest => {
  const {contract, id, target} = args;

  return {
    to: contract,
    signature: "approve(address,uint256)",
    args: [target, id],
  };
};

export const addDecimals = async (token: string, value: string, provider: string) => {
  const tokenContract = attach("ERC20", token, provider);
  const decimals = await tokenContract.decimals();
  return addTokenDecimals({value, decimals});
};

export const addTokenDecimals = (args: {value: string; decimals: number}) => {
  const {value, decimals} = args;
  return value + (10 ** decimals).toString().replace("1", "");
};

export const formatValue = async ({
  token,
  value,
  maxDecimals,
}: {
  token: string;
  value: string;
  maxDecimals?: number;
}) => {
  const tokenContract = attach("ERC20", token);
  const decimals = await tokenContract.decimals();

  return formatValueWithDecimals({value, decimals, maxDecimals});
};

export const formatValueWithDecimals = ({
  value,
  decimals,
  maxDecimals,
}: {
  value: string;
  decimals: number;
  maxDecimals?: number;
}) => {
  const bg = ethers.BigNumber.from(value);
  const pow = ethers.BigNumber.from(10).pow(decimals);
  const last = bg.mod(pow).toString();
  return `${bg.div(pow).toString()}.${maxDecimals ? last.slice(0, maxDecimals) : last}`;
};

const ARBITRUM_LIST = "https://bridge.arbitrum.io/token-list-42161.json";

export const getTokensList = async () => {
  const {
    data: {tokens},
  } = await axios.get(ARBITRUM_LIST);
  return tokens.filter((tkn: any) => tkn.chainId === 1);
};

export const loadERC20 = async (token: string, networkId: SupportedNetworks): Promise<ERC20> => {
  const {provider} = getNetworkConfig(networkId);
  const tokenContract = attach("ERC20", token, provider);
  const [symbol, name, totalSupply, decimals] = await Promise.all([
    tokenContract.symbol(),
    tokenContract.name(),
    tokenContract.totalSupply(),
    tokenContract.decimals(),
  ]);

  return {symbol, name, totalSupply: totalSupply.toString(), decimals, address: token};
};

export const getNextERC721Enummerable = async (args: {
  contract: string;
  owner: string;
  index: number;
  networkId: SupportedNetworks;
}): Promise<string> => {
  const {contract, owner, index, networkId} = args;
  const {provider} = getNetworkConfig(networkId);
  const nftContract = attach("ERC721", contract, provider);
  return (await nftContract.tokenOfOwnerByIndex(owner, index)).toString();
};
