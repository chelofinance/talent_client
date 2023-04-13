import React from "react";
import {CheckIcon} from "@heroicons/react/solid";
import {ExclamationCircleIcon} from "@heroicons/react/solid";
import {ClockIcon} from "@heroicons/react/solid";
import {PaperAirplaneIcon} from "@heroicons/react/solid";

import {Button} from "@shared/components/common/Forms";
import Modal from "@shared/components/common/Modal";
import {TransactionMeta} from "types";
import {useAppDispatch, useAppSelector} from "@redux/store";
import {useWeb3React} from "@web3-react/core";
import {onShowTransaction, onUpdateError} from "@redux/actions";
import {calculateGasMargin, wait} from "@helpers/index";
import {TransactionRequest} from "@ethersproject/providers";
import {parseCheloTransaction} from "@helpers/chelo";
import {MiniDaoController} from "@shared/sdk/adapters/mini_dao";
import {getScriptType} from "@helpers/contracts";

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
  const {txs, dao: daoId, type, showModal, setShowModal, customExecute, metadata} = props;
  const {provider} = useWeb3React();
  const {daos} = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const hideSend = !txs.every((tx) => tx.status === "executed");
  const loading = txs.some((tx) => tx.status !== "waiting" && tx.status !== undefined) && hideSend;
  const disableClose = txs.length > 1 && loading;

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
        metadata,
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

  const handleTransaction = async () => {
    const signer = provider.getSigner();
    const txRequest: TransactionRequest[] = txs.map(parseCheloTransaction);
    let localTxsUpdates = txs.map((tx) => ({...tx}));

    for (let [index, cur_tx] of txRequest.entries()) {
      console.log({cur_tx});
      const gasLimit = calculateGasMargin(await signer.estimateGas(cur_tx));

      const tx = await signer.sendTransaction({...cur_tx, gasLimit});
      localTxsUpdates = updateTxStatus({index, status: "sent", txs: localTxsUpdates});
      await tx.wait();

      localTxsUpdates = updateTxStatus({index, status: "executed", txs: localTxsUpdates});
    }
  };

  const handleCheloProposal = async () => {
    const dao = daos.daos.find((dao) => dao.id === daoId) as MiniDAO;
    const controller = new MiniDaoController(dao, provider);

    changeTransactionStatus("sent");
    const tx = await controller.propose(txs, {description: (metadata as {cid: string}).cid});
    await tx.wait();
  };

  const onSubmitTx = async () => {
    try {
      if (customExecute) return await customExecute({txs, dao: daoId, type});

      changeTransactionStatus("confirmed");

      if (type === "wallet") await handleTransaction();
      if (type === "chelo") await handleCheloProposal();
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
          {hideSend && (
            <Button
              className={`bg-purple-400 text-white ${loading ? "px-6 py-2" : "p-2"
                } rounded w-32 w-1/2`}
              onClick={onSubmitTx}
              loading={loading}
            >
              Sign transaction
            </Button>
          )}
        </div>
      }
      showModal={showModal}
      setShowModal={setShowModal}
      showBtn={false}
      disableClose={disableClose}
    />
  );
};
export default TransactionModal;
