import {TransactionRequest, TransactionResponse} from "@ethersproject/providers";
import {ethers} from "ethers";

import {useWeb3React} from "@web3-react/core";
import {evmcl} from "@1hive/evmcrispr";

import {getConnection} from "@helpers/connection/utils";
import {ConnectionType} from "@helpers/connection";
import {GnosisSafe} from "@web3-react/gnosis-safe";
import {onUpdateError} from "@redux/actions";
import {calculateGasMargin} from "@helpers/index";
import {useAppDispatch, useAppSelector} from "@redux/store";
import {getAragonApps, simpleAragonExec} from "@helpers/aragon";
import {useGetMiniDaos} from "@shared/hooks/utils";

export const useSendTransaction = () => {
  const {provider} = useWeb3React();
  const dispatch = useAppDispatch();

  return async (tx: TransactionRequest): Promise<TransactionResponse> => {
    const signer = provider.getSigner();

    try {
      const gasLimit = calculateGasMargin(await signer.estimateGas(tx));
      return await signer.sendTransaction({...tx, gasLimit});
    } catch (err) {
      dispatch(onUpdateError({message: err.message, code: err.code, open: true}));
      return null;
    }
  };
};

export const useSendAragonTransaction = (daoId?: string) => {
  const {provider, chainId} = useWeb3React();
  const daos = useAppSelector((state) => state.daos);
  const dispatch = useAppDispatch();
  const mini_daos = useGetMiniDaos();

  return async (
    txs: CheloTransactionRequest[],
    dynamicDao?: string
  ): Promise<TransactionResponse> => {
    const finalDao = dynamicDao ? dynamicDao : daoId;
    const dao =
      daos.find(({id}) => [daoId, dynamicDao].includes(id)) ||
      mini_daos.find(({id}) => [daoId, dynamicDao].includes(id));

    if (!dao || dao?.type === "snapshot")
      throw new Error(dao ? "not aragon dao" : "not existing dao");

    console.log({txs, dao: finalDao});
    const txString = txs
      .map(
        (tx) =>
          `act agent ${tx.to} ${tx.signature} ${tx.args
            .map((arg) => (Array.isArray(arg) ? `[${arg.join(",")}]` : `${arg}`))
            .join(" ")}`
      )
      .join("\n");

    try {
      if (chainId === 1) {
        //evm crisp only works on chainId 1, 4 and 100
        const evm = evmcl`
         connect ${finalDao} token-manager voting
         ${txString}
        `;

        await evm.forward(provider.getSigner());
        return;
      }

      const usedApps = await getAragonApps({kernel: finalDao, provider});
      const res = await simpleAragonExec({transactions: txs, apps: usedApps, provider});
      await res.wait();
    } catch (err) {
      dispatch(onUpdateError({message: err.message, code: err.code, open: true}));

      return null;
    }
  };
};

const parseAragonTransaction = (
  tx: CheloTransactionRequest
): {to: string; value: string; data: string} => {
  const iface = new ethers.utils.Interface([`function ${tx.signature}`]);

  return {
    to: tx.to,
    data: iface.encodeFunctionData(tx.signature.split("(")[0], tx.args),
    value: "0",
  };
};

export const useSendGnosisTransaction = () => {
  const connector = useWeb3React().connector as GnosisSafe;
  const dispatch = useAppDispatch();

  return async (txs: CheloTransactionRequest[]): Promise<unknown> => {
    if (!(getConnection(connector).type === ConnectionType.GNOSIS_SAFE))
      throw new Error("useSendGnosisTransaction only when using gnosis provider");

    try {
      const parsedTxs = txs.map(parseAragonTransaction);
      await connector.sdk.txs.send({txs: parsedTxs});
    } catch (err) {
      dispatch(onUpdateError({message: err.message, code: err.code, open: true}));
      console.log(err);
      return null;
    }
  };
};

export const useSendDaoTransaction = (dao: DAO) => {
  if (dao.type === "aragon") {
    return useSendAragonTransaction(dao.id);
  }

  if (dao.type === "snapshot") {
    return useSendGnosisTransaction();
  }

  if (dao.type === "syndicate") {
    const sendTx = useSendTransaction();
    return async (txs: CheloTransactionRequest[]) => {
      const normalTxs: TransactionRequest[] = txs.map(parseAragonTransaction);
      for await (let request of normalTxs) {
        await (await sendTx(request)).wait();
      }
    };
  }
};
