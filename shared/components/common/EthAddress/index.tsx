import React from "react";
import clsx from "clsx";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Popover, Transition } from "@headlessui/react";

import Tooltip from "@shared/components/common/Tooltip";
import Blockies, { BlockiesProps } from "@shared/components/common/Blockies";

export interface EthAddressProps {
  address: string;
  render?: JSX.Element;
  clipboard?: boolean;
  clipboardSize?: number;
  classes?: Partial<Record<"root" | "text" | "copy", string>>;
  length?: number;
  blockies?: boolean;
  blockiesProps?: Partial<BlockiesProps>;
}

const formatAddress = (add: string, start: number) =>
  `${add.slice(0, start)}...${add.slice(-start)}`;

export const EthAddress: React.FunctionComponent<EthAddressProps> = (props) => {
  const { address, render, length, clipboard, clipboardSize, classes, blockies, blockiesProps } =
    props;

  return (
    <div className={clsx("flex items-center gap-2", classes?.root)}>
      {blockies && (
        <Blockies seed={address} size={8} scale={3} className="rounded-md" {...blockiesProps} />
      )}
      {render ? (
        render
      ) : (
        <span className={clsx(classes?.text)}>{formatAddress(address, length || 5)}</span>
      )}
      {clipboard && (
        <Tooltip message="Copied!">
          <ContentCopyIcon
            className={clsx("cursor-pointer", classes?.copy)}
            fontSize={String(clipboardSize || 30) as any}
            onClick={() => {
              navigator.clipboard.writeText(address);
            }}
          />
        </Tooltip>
      )}
    </div>
  );
};

export default EthAddress;
