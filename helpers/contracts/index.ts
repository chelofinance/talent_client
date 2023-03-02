import {ethers, Contract, Signer} from "ethers";
import {ContractReceipt} from "@ethersproject/contracts";
import {LogDescription} from "@ethersproject/abi";

import {getProvider} from "@helpers/index";
import aragon from "./Aragon";
import chelo from "./Chelo";
import tanda from "./Tanda";
import superfluid from "./Superfluid";
import {JsonRpcProvider, TransactionResponse, Web3Provider} from "@ethersproject/providers";

export const abis = {
  ...aragon,
  ...chelo,
  ...tanda,
  ...superfluid,
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

const settingsSighashes = [
  getInterface("Settings").getSighash("updateAprThreshold"),
  getInterface("Settings").getSighash("updateDurationThreshold"),
  getInterface("Settings").getSighash("updateMaxDefaulted"),
  getInterface("Settings").getSighash("updateMaxPools"),
  getInterface("Settings").getSighash("updateManagerDuration"),
  getInterface("Settings").getSighash("updatePrincipalThreshold"),
];

export const getScriptType = (sighashOrSignature: string): ScriptType => {
  const sighash =
    sighashOrSignature[0] === "0" && sighashOrSignature[1] === "x"
      ? sighashOrSignature
      : new ethers.utils.Interface([`function ${sighashOrSignature}`]).getSighash(
        sighashOrSignature
      );

  if (
    [
      getInterface("LoanManager").getSighash("createLoan"),
      getInterface("LoanManager").getSighash("createLoanWithCollateral"),
    ].includes(sighash)
  )
    return "loan";

  if (getInterface("LoanManager").getSighash("repayLoan") === sighash) return "repay_loan";

  if (getInterface("LoanManager").getSighash("markLoanAsResolved") === sighash)
    return "mark_resolved";

  if (getInterface("LoanManager").getSighash("markLoanAsDefaulted") === sighash)
    return "mark_defaulted";

  if (getInterface("CheloFactory").getSighash("createLendingPool") === sighash)
    return "create_pool";

  if (getInterface("LendingPool").getSighash("deposit") === sighash) return "pool_deposit";

  if (getInterface("ERC20").getSighash("approve") === sighash) return "approve_tokens";

  if (getInterface("Voting").getSighash("vote") === sighash) return "vote";

  if (settingsSighashes.includes(sighash)) return "setting";

  if (
    [
      getInterface("TemplateMembership").getSighash("newTokenAndInstance"),
      getInterface("TemplateCompanyReputation").getSighash("newTokenAndInstance"),
    ].includes(sighash)
  )
    return "create_mini_dao";

  return "unknown";
};
