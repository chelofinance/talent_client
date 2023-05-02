import React from "react";
import Image from "next/image";
import clsx from "clsx";
import {ClipboardCopyIcon, ExternalLinkIcon} from "@heroicons/react/solid";
import {ChevronDownIcon} from "@heroicons/react/solid";

import WalletModal from "@shared/components/common/WalletModal";
import Tooltip from "@shared/components/common/Tooltip";
import {onSwitchNetwork, onDisconnectWallet} from "@redux/actions";
import {useAppSelector, useAppDispatch} from "@redux/store";
import EthAddress from "@shared/components/common/EthAddress";
import Popover from "@shared/components/common/Popover";
import MenuDropdown from "@shared/components/common/MenuDropdown";
import {Button} from "@shared/components/common/Forms";
import {WALLETS} from "@helpers/connection/utils";
import {getNetworkConfig} from "@helpers/network";
import {useWeb3React} from "@web3-react/core";
import {networkConfigs} from "@helpers/network";
import {formatAddress} from "@helpers/index";
import {useRole} from "@shared/hooks/daos";

export interface EthIdenticonProps {
  className?: string;
}

const mappedNetworkConfigs = Object.entries(networkConfigs);

const nonConnectedSettings = {
  chainId: 0,
  logo: "/multimedia/networks/rinkeby.png",
  name: "not connected",
  explorer: "",
  testnet: false,
};

export const EthAccount: React.FunctionComponent<EthIdenticonProps> = (props) => {
  const {className} = props;
  const [changeWallet, setChangeWallet] = React.useState(false);
  const {networkId, wallet, address} = useAppSelector((state) => state.user.account);
  const {talent, alumni, sponsor} = useRole();
  const {connector} = useWeb3React();
  const dispatch = useAppDispatch();

  const {settings} = networkId ? getNetworkConfig(networkId) : {settings: nonConnectedSettings};
  const curWallet = WALLETS.find((w) => w.value === wallet);

  const handleNetworkChange = (networkId: SupportedNetworks) => async () => {
    try {
      await dispatch(onSwitchNetwork({networkId, connector})); //rinkeby
    } catch (err) {
      console.log({networkChangeError: err});
    }
  };

  const handleDisconnect = () => {
    dispatch(onDisconnectWallet());
  };

  const handleChangeWallet = () => {
    setChangeWallet(true);
  };

  const getRoleInfo = () => {
    if (talent) return {name: "Talent core", color: "blue-100"};
    if (alumni) return {name: "Alumni", color: "lime-100"};
    if (sponsor) return {name: "Sponsor", color: "red-100"};
  };
  const roleInfo = getRoleInfo();

  return (
    <div className={clsx("flex gap-3 text-black", className)}>
      <MenuDropdown
        title="Available networks"
        options={mappedNetworkConfigs.map(([entry, config]) => ({
          content: (
            <div
              className="w-full flex justify-between"
              onClick={handleNetworkChange(config.settings.chainId)}
            >
              <Image src={config.settings.logo} alt="me" width="20" height="20" />
              <span className="font-semibold">{config.settings.name}</span>
            </div>
          ),
          value: entry,
        }))}
        button={
          <div className="py-2 px-3 bg-stone-100 rounded-lg flex itmes-center gap-3 cursor-pointer">
            {settings.logo && <Image src={settings.logo} alt="me" width="20" height="20" />}
            <span className="font-semibold">{settings.name}</span>
            <ChevronDownIcon width={20} />
          </div>
        }
      />
      <div>
        <Popover
          classes={{
            panel: clsx("absolute w-80  mt-3 -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl"),
          }}
          button={
            <div className="py-2 px-3 bg-stone-100 rounded-lg flex itmes-center gap-3 cursor-pointer">
              <Image
                src={curWallet?.src || "/multimedia/wallets/metamask.png"}
                alt="me"
                width="20"
                height="20"
              />
              {address ? (
                <EthAddress
                  address={address}
                  render={
                    <span className={clsx("font-semibold")}>{formatAddress(address, 10)}</span>
                  }
                />
              ) : (
                "unregistered"
              )}
            </div>
          }
        >
          <div className="p-3 bg-stone-100 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-lg font-semibold">Account</span>
              <div className="flex gap-3">
                <Button
                  className="bg-stone-100 p-1 text-sm rounded-lg"
                  onClick={handleChangeWallet}
                >
                  Change
                </Button>
                <Button className="bg-stone-100 p-1 text-sm rounded-lg" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </div>
            </div>
            <div className="flex gap-2 justify-between">
              <div className="flex gap-4">
                <Image
                  src={curWallet?.src || "/multimedia/wallets/metamask.png"}
                  alt="me"
                  width="40"
                  height="40"
                />
                <div className="flex flex-col">
                  {address && (
                    <EthAddress
                      address={address}
                      render={
                        <span className={clsx("font-semibold")}>{formatAddress(address, 10)}</span>
                      }
                    />
                  )}
                  <span>{curWallet?.title || "metamask"}</span>
                </div>
              </div>
              <div className="flex gap-2 items-start h-full">
                <Tooltip message="Copied!">
                  <ClipboardCopyIcon
                    className="cursor-pointer"
                    width={20}
                    height={20}
                    onClick={() => {
                      navigator.clipboard.writeText(address);
                    }}
                  />
                </Tooltip>
                <a target="_blank" href={`${settings.explorer}/address/${address}`}>
                  <ExternalLinkIcon className="cursor-pointer" width={20} height={20} />
                </a>
              </div>
            </div>
            <div className="border-b border-white opacity-30 rounded-lg m-3"></div>
            <div className="flex justify-between">
              <span className="text-md">Network:</span>
              <div className="flex gap-3 items-center">
                <span>{address ? settings?.name : "None"}</span>{" "}
                <div
                  className={`w-3 h-3 rounded-full bg-${address ? "green" : "red"}-${address ? "300" : "500"
                    }`}
                ></div>
              </div>
            </div>
          </div>
        </Popover>
      </div>
      <WalletModal
        setShowModal={(value) => setChangeWallet(value === "show")}
        showModal={changeWallet}
      />
      {roleInfo && (
        <div
          className={`py-1 px-3 rounded-lg flex items-center justify-center bg-${roleInfo.color}`}
        >
          <span className="font-semibold">{roleInfo.name}</span>
          <span className="bg-blue-100 bg-lime-100 bg-red-100"></span>
        </div>
      )}
    </div>
  );
};

export default EthAccount;
