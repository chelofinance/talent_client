import {ethers, BigNumber} from "ethers";

import {attach} from "@helpers/contracts";
import {getProvider} from "@helpers/index";
import {getNetworkConfig} from "@helpers/network";
import {loadERC20} from "@helpers/erc";

export const getDaoMembers = async (networkId: SupportedNetworks, tokenManagerOrVoting: string) => {
  const {provider: rpc} = getNetworkConfig(networkId);
  const tokenManager = attach("TokenManager", tokenManagerOrVoting, rpc);
  const minime = attach("MiniMeToken", await tokenManager.token(), rpc);
  const provider = getProvider(rpc);

  const initBlock = (await minime.creationBlock()).toNumber();
  const events = await minime.queryFilter(
    minime.filters.Transfer(),
    initBlock,
    await provider.getBlockNumber()
  );

  const members = events.reduce((acc, cur) => {
    const {_from: from, _to: to, _amount: value} = cur.args;
    const balances = {
      from: acc[from] ? acc[from] : ethers.BigNumber.from(0),
      to: acc[to] ? acc[to] : ethers.BigNumber.from(0),
    };

    return {
      ...acc,
      [from]: ethers.BigNumber.from(from).gt(0)
        ? balances.from.sub(value)
        : ethers.BigNumber.from(0),
      [to]: balances.to.add(value),
    };
  }, {} as Record<string, BigNumber>);

  return Object.entries(members)
    .filter((entry) => ethers.BigNumber.from(entry[0]).gt(0) && entry[1].gt(0))
    .map((entry) => ({account: entry[0], stake: entry[1].toString()}));
};

export const getMiniDaoToken = async (args: {
  tokenManagerOrVoting: string;
  networkId: SupportedNetworks;
}) => {
  const {tokenManagerOrVoting, networkId} = args;
  const {provider: rpc} = getNetworkConfig(networkId);

  const tokenManager = attach("TokenManager", tokenManagerOrVoting, rpc);
  const token: string = await tokenManager.token();
  return await loadERC20(token, networkId);
};
