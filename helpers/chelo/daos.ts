import {ethers} from "ethers";
import {TransactionReceipt} from "@ethersproject/providers";
import {LogDescription} from "@ethersproject/abi";

import {getLogs, getProvider} from "@helpers/index";
import {getNetworkConfig} from "@helpers/network";
import {attach} from "@helpers/contracts";

export const getMiniDao = (state: DAO[], searcher: (mini: MiniDAO) => boolean): [MiniDAO, DAO] => {
  const mini_daos = state.reduce(
    (acc, cur) => acc.concat(Array.isArray(cur.mini_daos) ? cur.mini_daos : []),
    [] as MiniDAO[]
  );
  const dao = state.find((dao) => dao.mini_daos?.some(searcher));

  return [mini_daos.find(searcher), dao];
};

export const getMiniDaoCreation = async ({
  tx,
  networkId,
}: {
  tx: string;
  networkId: SupportedNetworks;
}): Promise<{
  type: MiniDaoType;
  tx: TransactionReceipt;
  logs: LogDescription[];
}> => {
  const {provider: rpc, addresses} = getNetworkConfig(networkId);
  const creationTx = await getProvider(rpc).getTransactionReceipt(tx);

  const logTypes = {
    membership: getLogs(attach("TemplateMembership", addresses.membership), creationTx),
    reputation: getLogs(attach("TemplateCompanyReputation", addresses.reputation), creationTx),
    company: getLogs(attach("TemplateCompanyReputation", addresses.company), creationTx),
  };

  if (logTypes.membership.length > 0)
    return {type: "membership", tx: creationTx, logs: logTypes.membership};
  if (logTypes.company.length > 0)
    return {type: "company", tx: creationTx, logs: logTypes.company};
  if (logTypes.reputation.length > 0)
    return {type: "reputation", tx: creationTx, logs: logTypes.reputation};

  return {type: "membership", tx: creationTx, logs: logTypes.membership};
};

export const parseCheloTransaction = (
  tx: CheloTransactionRequest
): {to: string; value: string; data: string} => {
  const iface = new ethers.utils.Interface([`function ${tx.signature}`]);

  return {
    to: tx.to,
    data: iface.encodeFunctionData(tx.signature.split("(")[0], tx.args),
    value: "0",
  };
};
