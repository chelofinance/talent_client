import {initializeConnector, Web3ReactHooks} from "@web3-react/core";
import {WalletConnect} from "@web3-react/walletconnect";
import {MetaMask} from "@web3-react/metamask";
import {Connector} from "@web3-react/types";
import {GnosisSafe} from "@web3-react/gnosis-safe";
import {CoinbaseWallet} from "@web3-react/coinbase-wallet";
import {Network} from "@web3-react/network";
import {networkConfigs} from "@helpers/network";

export enum ConnectionType {
  INJECTED = "INJECTED",
  COINBASE_WALLET = "COINBASE_WALLET",
  WALLET_CONNECT = "WALLET_CONNECT",
  NETWORK = "NETWORK",
  GNOSIS_SAFE = "GNOSIS_SAFE",
}

export interface Connection {
  connector: Connector;
  hooks: Web3ReactHooks;
  type: ConnectionType;
}

const networkMap = Object.values(networkConfigs).reduce(
  (acc, cur) => ({...acc, [cur.settings.chainId]: cur.provider}),
  {}
);

const [walletConnect, walletConnectHooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect({
      actions,
      options: {
        rpc: networkMap,
      },
    })
);

export const walletConnectConnection: Connection = {
  connector: walletConnect,
  hooks: walletConnectHooks,
  type: ConnectionType.WALLET_CONNECT,
};

const [metaMask, metamaskHooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({actions})
);

export const metamaskConnection: Connection = {
  connector: metaMask,
  hooks: metamaskHooks,
  type: ConnectionType.INJECTED,
};

const [gnosisSafe, gnosisSafeHooks] = initializeConnector<GnosisSafe>(
  (actions) => new GnosisSafe({actions})
);

export const gnosisSafeConnection: Connection = {
  connector: gnosisSafe,
  hooks: gnosisSafeHooks,
  type: ConnectionType.GNOSIS_SAFE,
};

const [coinbaseWallet, coinbaseHooks] = initializeConnector<Connector>(
  (actions: any) =>
    new CoinbaseWallet(actions, {
      url: "", //TODO
    } as any) as any
);

export const coinbaseWalletConnection: Connection = {
  connector: coinbaseWallet,
  hooks: coinbaseHooks,
  type: ConnectionType.COINBASE_WALLET,
};

export const [network, networkHooks] = initializeConnector<Network>(
  (actions) =>
    new Network({
      actions,
      urlMap: networkMap,
    })
);

export const networkConnection: Connection = {
  connector: network,
  hooks: networkHooks,
  type: ConnectionType.NETWORK,
};
