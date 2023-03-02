import React from "react";
import {evmcl} from "@1hive/evmcrispr";
import {CheckIcon} from "@heroicons/react/solid";
import {ExclamationCircleIcon} from "@heroicons/react/solid";
import {ClockIcon} from "@heroicons/react/solid";
import {PaperAirplaneIcon} from "@heroicons/react/solid";

import {Button} from "@shared/components/common/Forms";
import Modal from "@shared/components/common/Modal";
import {TransactionMeta} from "types";
import {getScriptType} from "@helpers/contracts";
import {useAppDispatch, useAppSelector} from "@redux/store";
import {useGetMiniDaos} from "@shared/hooks/utils";
import {useWeb3React} from "@web3-react/core";
import {getAragonApps, simpleAragonExec} from "@helpers/aragon";
import {onShowTransaction, onUpdateError} from "@redux/actions";
import {getConnection} from "@helpers/connection/utils";
import {ConnectionType} from "@helpers/connection";
import {GnosisSafe} from "@web3-react/gnosis-safe";
import {calculateGasMargin} from "@helpers/index";
import {TransactionRequest} from "@ethersproject/providers";
import {parseCheloTransaction} from "@helpers/chelo/daos";

interface TransactionModalProps extends TransactionMeta {
  showModal: boolean;
  setShowModal(arg: boolean): void;
  customExecute?(args: TransactionMeta): Promise<void>;
}

const StatusComponents: Record<
  TransactionStatus,
  React.FunctionComponent<React.ComponentProps<"svg">>
> = {
  waiting: ClockIcon,
  confirmed: ExclamationCircleIcon,
  sent: PaperAirplaneIcon,
  executed: CheckIcon,
};

const StatusMessages: Record<TransactionStatus, string> = {
  waiting: "Waiting",
  confirmed: "Confirmed",
  sent: "Sent",
  executed: "Executed",
};

const scriptTypeMessages: Record<ScriptType, string> = {
  loan: "Create loan",
  repay_loan: "Repay Loan",
  mark_defaulted: "Mark loan as defaulted",
  mark_resolved: "Mark loan as resolved",
  pool_deposit: "Deposit",
  create_pool: "Create pool",
  setting: "Change settings",
  add_members: "Add members",
  approve_tokens: "Approve tokens",
  create_mini_dao: "Create mini Dao",
  vote: "Vote",
  unknown: "Unknown transaction",
};

export const TransactionModal: React.FunctionComponent<TransactionModalProps> = (props) => {
  const {txs, dao: daoId, type, showModal, setShowModal, customExecute} = props;
  const {chainId, provider, connector} = useWeb3React();
  const {daos} = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const mini_daos = useGetMiniDaos();
  const loading =
    txs.some((tx) => tx.status !== "waiting" && tx.status !== undefined) &&
    !txs.every((tx) => tx.status === "executed");

  const txsInfo = txs.map((tx) => {
    const scriptType = getScriptType(tx.signature);
    return {
      scriptType,
      status: tx.status,
      message: scriptTypeMessages[scriptType],
      component: StatusComponents[tx.status] || StatusComponents.waiting,
    };
  });
  const isSettingChange = txsInfo.every((tx) => tx.scriptType === "setting");

  const changeTransactionStatus = (newStatus: TransactionStatus) => {
    dispatch(
      onShowTransaction({
        txs: txs.map((txs) => ({...txs, status: newStatus})),
        dao: daoId,
        type,
      })
    );
  };

  const updateTxStatus = (args: {
    index: number;
    status: TransactionStatus;
    txs: (CheloTransactionRequest & {status?: TransactionStatus})[];
  }) => {
    const {index, status, txs} = args;
    const newTxs = [...txs];
    newTxs[index] = {...newTxs[index], status};
    dispatch(
      onShowTransaction({
        txs: newTxs,
        dao: daoId,
        type,
      })
    );

    return newTxs;
  };

  const handleAragonTransaction = async () => {
    const dao = daos.find(({id}) => daoId === id) || mini_daos.find(({id}) => daoId === id);

    if (!dao || dao?.type === "snapshot")
      throw new Error(dao ? "not aragon dao" : "not existing dao");

    const txString = txs
      .map(
        (tx) =>
          `act agent ${tx.to} ${tx.signature} ${tx.args
            .map((arg) => (Array.isArray(arg) ? `[${arg.join(",")}]` : `${arg}`))
            .join(" ")}`
      )
      .join("\n");

    if (chainId === 1) {
      //evm crisp only works on chainId 1, 4 and 100
      const evm = evmcl`
         connect ${daoId} token-manager voting
         ${txString}
        `;

      changeTransactionStatus("sent");
      await evm.forward(provider.getSigner());
      return;
    }

    const usedApps = await getAragonApps({kernel: dao.id, provider});
    const res = await simpleAragonExec({transactions: txs, apps: usedApps, provider});
    changeTransactionStatus("sent");
    await res.wait();
  };

  const handleGnosisTransaction = async () => {
    if (!(getConnection(connector).type === ConnectionType.GNOSIS_SAFE))
      throw new Error("useSendGnosisTransaction only when using gnosis provider");
    const gnosisConnector = connector as GnosisSafe;

    const parsedTxs = txs.map(parseCheloTransaction);
    changeTransactionStatus("sent");
    await gnosisConnector.sdk.txs.send({txs: parsedTxs});
  };

  const handleTransaction = async () => {
    const signer = provider.getSigner();
    const txRequest: TransactionRequest[] = txs.map(parseCheloTransaction);
    let localTxsUpdates = txs.map((tx) => ({...tx}));

    for (let [index, cur_tx] of txRequest.entries()) {
      const gasLimit = calculateGasMargin(await signer.estimateGas(cur_tx));

      const tx = await signer.sendTransaction({...cur_tx, gasLimit});
      localTxsUpdates = updateTxStatus({index, status: "sent", txs: localTxsUpdates});
      await tx.wait();
      localTxsUpdates = updateTxStatus({index, status: "executed", txs: localTxsUpdates});
    }
  };

  const onSubmitTx = async () => {
    try {
      if (customExecute) return await customExecute({txs, dao: daoId, type});

      changeTransactionStatus("confirmed");

      if (type === "aragon") await handleAragonTransaction();
      if (type === "snapshot") await handleGnosisTransaction(); //TODO handle syndicate and wallet (with gnosis)
      if (type === "wallet") await handleTransaction();
    } catch (err) {
      console.log("tx error", err);
      changeTransactionStatus("waiting");
      dispatch(onUpdateError({message: err.message, code: err.code, open: true}));
      return null;
    }

    changeTransactionStatus("executed");
  };

  if (txsInfo.length <= 0) return null;

  return (
    <Modal
      content={
        <div className="flex flex-col items-center justify-center gap-4 w-full p-3">
          <div>
            <p className="font-bold">Wallet Action</p>
          </div>
          <div className="w-full">
            {(isSettingChange ? [txsInfo[0]] : txsInfo).map((tx, i) => (
              <div className={`flex w-full p-2  ${i !== 0 && "border-t border-gray-500"}`}>
                <tx.component width={20} className="mr-3" />
                <div className="flex w-full justify-between">
                  <p>{tx.message}</p>
                  <p>{StatusMessages[tx.status] || "Waiting"}</p>
                </div>
              </div>
            ))}
          </div>
          <Button
            className={`bg-purple-400 text-white ${loading ? "px-6 py-2" : "p-2"
              } rounded w-32 w-1/2`}
            onClick={onSubmitTx}
            loading={loading}
          >
            Sign transaction
          </Button>
        </div>
      }
      showModal={showModal}
      setShowModal={setShowModal}
      showBtn={false}
    />
  );
};
export default TransactionModal;
