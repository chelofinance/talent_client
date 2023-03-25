import {ethers, Contract, Signer} from "ethers";
import {ContractReceipt} from "@ethersproject/contracts";
import {LogDescription} from "@ethersproject/abi";

import {getProvider} from "@helpers/index";
import aragon from "./Aragon";
import chelo from "./Chelo";
import {JsonRpcProvider, TransactionResponse, Web3Provider} from "@ethersproject/providers";
import {getNetworkConfig} from "@helpers/network";

export const abis = {
  ...aragon,
  ...chelo,
};

export function attach(
  contractName: keyof typeof abis,
  address: string,
  customProvider?: string | Web3Provider | JsonRpcProvider | Signer
) {
  const isString = typeof customProvider === "string";
  const provider = isString ? getProvider(customProvider) : customProvider;
  return new ethers.Contract(address, abis[contractName], provider);
}

export const getLogs = (contract: Contract, transaction: ContractReceipt) => {
  const response: LogDescription[] = [];
  transaction.logs.forEach((log) => {
    try {
      if (log.address === contract.address) response.push(contract.interface.parseLog(log));
    } catch (err: any) {
      console.log("logs err", err);
    }
  });
  return response;
};

export const getReceipt = async (tx: Promise<TransactionResponse> | TransactionResponse) => {
  try {
    return await (await tx).wait();
  } catch (err: any) {
    console.log("getReceipt", err);
    throw err;
  }
};

export const getInterface = (contractName: keyof typeof abis) => {
  return new ethers.utils.Interface(abis[contractName]);
};

export const getScriptType = (sighashOrSignature: string): ScriptType => {
  const sighash =
    sighashOrSignature[0] === "0" && sighashOrSignature[1] === "x"
      ? sighashOrSignature
      : new ethers.utils.Interface([`function ${sighashOrSignature}`]).getSighash(
        sighashOrSignature
      );

  //if (getInterface("ERC20").getSighash("approve") === sighash) return "approve_tokens";

  return "unknown";
};

const BLOCK_TIME_SECONDS = 2; // Polygon network average block time is approximately 2 seconds

export function calculateTimeInBlocks(args: {dateStart: Date; dateEnd: Date}) {
  const {dateStart, dateEnd} = args;

  const startTime = new Date(dateStart).getTime();
  const endTime = new Date(dateEnd).getTime();
  const timeDifferenceSeconds = (endTime - startTime) / 1000;

  return Math.ceil(timeDifferenceSeconds / BLOCK_TIME_SECONDS);
}
