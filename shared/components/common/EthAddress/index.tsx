import React, {useState, useEffect} from "react";
import clsx from "clsx";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Blockies, {BlockiesProps} from "@shared/components/common/Blockies";

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
  const {address, render, length, clipboard, clipboardSize, classes, blockies, blockiesProps} =
    props;

  const [showTooltip, setShowTooltip] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setShowTooltip(true);
  };

  useEffect(() => {
    let timer;
    if (showTooltip) {
      timer = setTimeout(() => {
        setShowTooltip(false);
      }, 800);
    }
    return () => clearTimeout(timer);
  }, [showTooltip]);

  return (
    <div className={clsx("flex items-center gap-2 relative", classes?.root)}>
      {blockies && (
        <Blockies seed={address} size={8} scale={3} className="rounded-md" {...blockiesProps} />
      )}
      {render ? (
        render
      ) : (
        <span className={clsx(classes?.text) + `cursor-pointer`} onClick={copyToClipboard}>
          {formatAddress(address, length || 5)}
        </span>
      )}
      {clipboard && (
        <>
          <ContentCopyIcon
            className={clsx("cursor-pointer", classes?.copy)}
            fontSize={String(clipboardSize || 30) as any}
            onClick={copyToClipboard}
          />
        </>
      )}
      {showTooltip && (
        <div className="absolute top-0 left-0 mt-8 p-1 text-xs text-white bg-gray-400 rounded">
          Copied!
        </div>
      )}
    </div>
  );
};

export default EthAddress;
