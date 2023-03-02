import axios from "axios";
import {ethers} from "ethers";
import ENS from "ethjs-ens";
import Web3 from "web3";

import {getProvider, wait} from "@helpers/index";
import {getNetworkConfig} from "@helpers/network";
import {decodeWithIfaces} from "@helpers/connection/utils";

export const resolveAragonDaoNames = async (args: {
  addresses: string[];
  networkId: SupportedNetworks;
}): Promise<{dao: string; name: string}[]> => {
  const {addresses, networkId} = args;
  const {endpoints, provider: rpc} = getNetworkConfig(networkId);

  if (addresses.length <= 0) return [];

  const addressesChunks = addresses.reduce(
    (acc, cur) => {
      //api returns for up to 5 addresses
      if (acc[acc.length - 1].length < 5) acc[acc.length - 1].push(cur);
      else acc.push([cur]);
      return acc;
    },
    [[]] as string[][]
  );

  const responses = await Promise.all(
    addressesChunks.map((chunk) =>
      axios.request<{result: {contractAddress: string; txHash: string}[]}>({
        method: "get",
        url: `${endpoints.explorer
          }&module=contract&action=getcontractcreation&contractaddresses=${chunk.join(",")}`,
        headers: {
          "Content-Type": "application/json",
        },
      })
    )
  );

  const responseNames = await Promise.all(
    responses.map(async (res, i) => {
      if (res.status >= 200 && res.status < 300) {
        const result: {txHash: string; contractAddress: string}[] = res.data.result;
        const provider = getProvider(rpc);
        const aragonCompany = new ethers.utils.Interface([
          "function newTokenAndInstance(string _tokenName,string _tokenSymbol,string _id,address[] _holders,uint256[] _stakes,uint64[3] _votingSettings,uint64 _financePeriod,bool _useAgentAsVault)",
        ]);
        const membershipCompany = new ethers.utils.Interface([
          "function newTokenAndInstance(string _tokenName,string _tokenSymbol,string _id,address[] _members,uint64[3] _votingSettings,uint64 _financePeriod,bool _useAgentAsVault)",
        ]);

        const txs = await Promise.all(result.map((res) => provider.getTransaction(res.txHash)));
        return txs.map((tx, j) => {
          const decodedData = decodeWithIfaces(
            [
              {iface: aragonCompany, fn: "newTokenAndInstance"},
              {iface: membershipCompany, fn: "newTokenAndInstance"},
            ],
            tx.data
          );

          return {
            name: decodedData && `${decodedData[2]}.aragonid.eth`,
            dao: result[j].contractAddress,
          };
        });
      }
    })
  );

  return responseNames.reduce((acc, cur) => acc.concat(cur), [] as {name: string; dao: string}[]);
};

export function ensResolve(
  nameOrNode: string,
  opts: {provider: Web3["currentProvider"]; registryAddress: string}
) {
  const isName = nameOrNode.includes(".");

  // bug on ethjs-ens sendAsync
  if (!(opts.provider as any).sendAsync)
    (opts.provider as any).sendAsync = (opts.provider as any).send;

  const ens = new ENS(opts);
  if (isName) {
    return ens.lookup(nameOrNode);
  }

  return ens.resolveAddressForNode(nameOrNode);
}

export async function resolveEnsDomain(domain: string, opts: any) {
  try {
    return await ensResolve(domain, opts);
  } catch (err) {
    return "";
  }
}
