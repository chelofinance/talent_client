import React from "react";
import Image from "next/image";

import Modal from "@shared/components/common/Modal";
import {WALLETS} from "@helpers/connection/utils";
import {Connection} from "@helpers/connection";
import {networkConfigs} from "@helpers/network";
import {useAppDispatch} from "@redux/store";
import {onSwitchNetwork} from "@redux/actions";
import {useWeb3React} from "@web3-react/core";

interface WalletModalProps {
  showModal: boolean;
  setShowModal: (nxt: "show" | "hide" | "loading") => void;
  onSelect?: Function;
}

const NETWORKS = Object.entries(networkConfigs);

const ConnectionComponent: React.FunctionComponent<{
  connection: Connection;
  onSelect?: Function;
  src: string;
  title: string;
}> = (props) => {
  const {connection, onSelect, src, title} = props;

  const handleConnection = async () => {
    try {
      await connection.connector.activate();
      onSelect && onSelect();
    } catch (err) {
      console.log({err});
    }
  };

  return (
    <button className="hover:scale-125" onClick={handleConnection}>
      <Image src={src} alt="me" width="50" height="50" />
      <p className="text-sm font-medium">{title}</p>
    </button>
  );
};

export const WalletModal: React.FunctionComponent<WalletModalProps> = ({
  showModal,
  setShowModal,
}) => {
  const dispatch = useAppDispatch();
  const {connector, isActive} = useWeb3React();
  const [selectedNetwork, setSelectedNetwork] = React.useState<SupportedNetworks>(5);

  const handleConnect = async () => {
    try {
      await dispatch(onSwitchNetwork({networkId: selectedNetwork, connector}));
      setShowModal("loading");
    } catch (err) {
      console.log({err});
    }
  };

  React.useEffect(() => {
    if (isActive) handleConnect();
  }, [isActive]);

  return (
    <Modal
      boxProps={{
        style: {
          transform: "translate(-50%, -50%)",
          width: 800,
        },
      }}
      content={
        <div className="flex flex-col items-center justify-center w-full py-8 px-4">
          <div>
            <p className="font-normal text-2xl mb-8">Connect Wallet</p>
          </div>
          <div className="w-full flex justify-around mb-2">
            <div className="w-1/2 px-4">1. Choose network</div>
            <div className="w-1/2 px-4">2. Chosse wallet</div>
          </div>
          <div className="flex justify-center w-full mb-4">
            <div className="w-1/2 border-r-2 border-black p-4 flex flex-col">
              <div className="grid grid-cols-3 gap-2">
                {NETWORKS.map(([entry, config], i) => (
                  <button
                    className={`hover:scale-125 items-center flex flex-col`}
                    onClick={() => setSelectedNetwork(config.settings.chainId)}
                  >
                    <Image src={config.settings.logo} alt="me" width="35" height="35" />
                    <p className="text-sm font-medium">{config.settings.name}</p>
                    {selectedNetwork === config.settings.chainId && (
                      <div className="w-2/3 bg-orange_custom" style={{height: "2px"}}></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-1/2 px-4 flex flex-col">
              <div className="grid grid-cols-3 gap-2 p-1 flex flex-col">
                {WALLETS.map((k, i) => (
                  <ConnectionComponent
                    key={i}
                    src={k.src}
                    title={k.title}
                    connection={k.connection}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      }
      showModal={showModal}
      setShowModal={(arg: boolean) => setShowModal(arg ? "show" : "hide")}
      showBtn={false}
    />
  );
};
export default WalletModal;
