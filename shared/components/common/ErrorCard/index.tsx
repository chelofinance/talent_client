import React from "react";
import clsx from "clsx";
import {useAppSelector, useAppDispatch} from "@redux/store";
import {XIcon, ExclamationCircleIcon} from "@heroicons/react/solid";
import {onUpdateError} from "@redux/actions";

const ErrorCodeMessages = {
  ACTION_REJECTED: "User rejected wallet action",
  UNPREDICTABLE_GAS_LIMIT: "Transaction may fail or may require manual gas limit",
  WALLET_REQUIRED_CSV: "Invalid user. All users must have a wallet",
};

interface ErrorCardProps {
  classes?: Partial<Record<"root", string>>;
}

export const ErrorCard: React.FunctionComponent<ErrorCardProps> = (props) => {
  const {
    user: {error},
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const {classes} = props;
  const {message, code, open} = error;
  const errorMessage = ErrorCodeMessages[code] || "There was an unexpected error";

  const onErrorClose = () => {
    dispatch(onUpdateError({open: false}));
  };

  if (!open) return <></>;

  return (
    <div
      className={clsx("p-3 m-3 bg-red-200 text-white rounded-md flex flex-col", classes?.root)}
      style={{zIndex: "1000"}}
    >
      <div className="w-full flex justify-between mb-2">
        <div className="flex items-center">
          <ExclamationCircleIcon width={20} className="m-0 text-red-700 mr-2" />
          <span className="text-red-600 font-bold ">Error</span>
        </div>
        <button onClick={onErrorClose}>
          <XIcon width={15} className="m-0" />
        </button>
      </div>
      <span className="text-red-600 font-md">{`${errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1)
        }`}</span>
    </div>
  );
};

export default ErrorCard;
