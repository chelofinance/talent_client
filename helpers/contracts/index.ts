import {ethers, Contract, Signer} from "ethers";
import {ContractReceipt} from "@ethersproject/contracts";
import {LogDescription} from "@ethersproject/abi";

import {getProvider} from "@helpers/index";
import aragon from "./Aragon";
import chelo from "./Chelo";
import {JsonRpcProvider, TransactionResponse, Web3Provider} from "@ethersproject/providers";

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
