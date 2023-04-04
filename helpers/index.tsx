import { ethers, BigNumber, Contract } from "ethers";
import {
  JsonRpcProvider,
  Networkish,
  TransactionReceipt,
  Web3Provider,
} from "@ethersproject/providers";
import Web3 from "web3";
import { getNetworkConfig } from "./network";
import { LogDescription } from "@ethersproject/abi";

export const isProduction = () => process.env.NEXT_PUBLIC_PRODUCTION === "true";

export const toBN = ethers.BigNumber.from;

export const addressEqual = (a: string, b: string) =>
  ethers.utils.isAddress(a) && ethers.utils.isAddress(b) && a.toLowerCase() === b.toLowerCase();

export const getWeb3Provider = (provider?: string) => {
  return new Web3(provider ? provider : (window.ethereum as any));
};

export const getLogs = (contract: Contract, transaction: TransactionReceipt) => {
  const response: LogDescription[] = [];
  transaction.logs.forEach((log) => {
    try {
      if (addressEqual(log.address, contract.address))
        response.push(contract.interface.parseLog(log));
    } catch (err: any) {}
  });
  return response;
};

export const getLatestBlock = async (networkId: SupportedNetworks) => {
  const { provider } = getNetworkConfig(networkId);
  const ethersProvider = getProvider(provider);
  return await ethersProvider.getBlock("latest");
};

export const getBlock = async (args: { networkId: SupportedNetworks; blocknumber: number }) => {
  const { networkId, blocknumber } = args;
  const { provider } = getNetworkConfig(networkId);
  const ethersProvider = getProvider(provider);
  return await ethersProvider.getBlock(blocknumber);
};

export const getProvider = (
  provider: string,
  options?: Networkish
): JsonRpcProvider | Web3Provider => {
  if (provider?.includes("wss")) return new ethers.providers.WebSocketProvider(provider);

  return new ethers.providers.JsonRpcProvider(provider, options);
};

export const getNetworkProvider = (
  networkId: SupportedNetworks
): JsonRpcProvider | Web3Provider => {
  const { provider } = getNetworkConfig(networkId);
  return getProvider(provider);
};

export const calculateGasMargin = (value: BigNumber): BigNumber => {
  return value.mul(120).div(100);
};

export const formatAddress = (address: string, size = 7) =>
  `${address.substring(0, size)} ... ${address.slice(-size)}`;

export const switchNetwork = async (chainId: number) => {
  if ((window.ethereum as any).networkVersion !== chainId)
    await (window.ethereum as any).request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
};

export const addNetwork = async ({
  chainId,
  name,
  currency,
  rpcUrl,
}: {
  chainId: number;
  name: string;
  currency: { name: string; decimals: number; symbol: string };
  rpcUrl: string;
}) => {
  await (window.ethereum as any).request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainName: name,
        chainId: `0x${chainId.toString(16)}`,
        nativeCurrency: currency,
        rpcUrls: [rpcUrl],
      },
    ],
  });
};

export const ipfsToHttp = (ipfsHash: string) => `https://ipfs.io/ipfs/${ipfsHash}`;

export const isIpfsUrl = (url: string) => url.indexOf("ipfs") === 0;

export const wait = (seconds: number) =>
  new Promise((resolve, reject) => setTimeout(resolve, seconds));

export const getDateDay = (date: number) => {
  return new Date(date).toLocaleString().split(",")[0];
};

export const hash = (label: string) => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(label));
