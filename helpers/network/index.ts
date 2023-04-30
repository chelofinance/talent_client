type NetworkConfig = {
  isActive: boolean;
  provider: string;
  providerWs: string;
  addresses: {
    feeController: string;
  };
  endpoints: {
    chelo: string;
    explorer: string;
    chelo_aragon?: string;
    syndicate?: string;
    aragon?: string;
  };
  settings: {
    chainId: SupportedNetworks;
    logo: string;
    currency: string;
    name: string;
    moralis_name: string;
    explorer: string;
    testnet: boolean;
    live: boolean;
  };
  ipfs: {
    gateway: string;
  };
};

export type NetworkName = "ethereum" | "goerli" | "polygon" | "mumbai" | "hardhat";

export const networkConfigs: Record<NetworkName, NetworkConfig> = {
  ethereum: {
    isActive: false,
    provider: "",
    providerWs: "",
    addresses: {
      feeController: "",
    },
    endpoints: {
      chelo: null,
      explorer: `https://api.etherscan.com/api?apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_KEY}`,
      aragon: null,
    },
    settings: {
      logo: "/multimedia/networks/eth.png",
      name: "Ethereum",
      currency: "ETH",
      moralis_name: "eth",
      explorer: "https://etherscan.io/",
      chainId: 1,
      testnet: false,
      live: true,
    },
    ipfs: {
      gateway: "https://ipfs.eth.aragon.network/ipfs",
    },
  },
  goerli: {
    isActive: false,
    provider: `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_GOERLI_PROVIDER}`,
    providerWs: `wss://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_GOERLI_PROVIDER}`,
    addresses: {
      feeController: "",
    },
    endpoints: {
      chelo: "https://api.thegraph.com/subgraphs/name/rcontre360/talent_subgraph",
      chelo_aragon: "https://api.thegraph.com/subgraphs/name/rcontre360/dao_subgraph",
      explorer: `https://api-goerli.etherscan.io/api?apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_KEY}`,
      aragon: null,
    },
    settings: {
      logo: "/multimedia/networks/eth.png",
      name: "Goerli",
      currency: "ETH",
      moralis_name: "eth",
      explorer: "https://etherscan.io/",
      chainId: 5,
      testnet: true,
      live: true,
    },
    ipfs: {
      gateway: "https://ipfs.eth.aragon.network/ipfs",
    },
  },
  polygon: {
    isActive: true,
    provider: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_POLYGON_PROVIDER}`,
    providerWs: `wss://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_POLYGON_PROVIDER}`,
    addresses: {
      feeController: "",
    },
    endpoints: {
      chelo: "https://api.thegraph.com/subgraphs/name/rcontre360/talent_subgraph_production",
      explorer: `https://api.polygonscan.com/api?apikey=${process.env.NEXT_PUBLIC_POLYGOSCAN_KEY}`,
    },
    settings: {
      chainId: 137,
      logo: "/multimedia/networks/matic.svg",
      name: "Polygon",
      currency: "MATIC",
      moralis_name: "polygon",
      explorer: "https://polygonscan.com/",
      testnet: false,
      live: true,
    },
    ipfs: {
      gateway: "https://ipfs.eth.aragon.network/ipfs",
    },
  },
  mumbai: {
    isActive: true,
    provider: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_MUMBAI_PROVIDER}`,
    providerWs: `wss://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_MUMBAI_PROVIDER}`,
    addresses: {
      feeController: "0x6aB3F93E81bA0548303465F19b59A5135b1bD0F3",
    },
    endpoints: {
      chelo: "https://api.thegraph.com/subgraphs/name/rcontre360/talent_subgraph",
      explorer: `https://api-testnet.polygonscan.com/api?apikey=${process.env.NEXT_PUBLIC_MUMBAI_KEY}`,
      aragon: null,
    },
    settings: {
      chainId: 80001,
      logo: "/multimedia/networks/matic.svg",
      name: "Mumbai",
      currency: "TMATIC",
      moralis_name: "mumbai",
      explorer: "https://mumbai.polygonscan.com/",
      testnet: true,
      live: true,
    },
    ipfs: {
      gateway: "https://ipfs.eth.aragon.network/ipfs",
    },
  },
  hardhat: {
    isActive: true,
    provider: "http://127.0.0.1:8545/",
    providerWs: "wss://127.0.0.1:8545/",
    addresses: {
      feeController: "0x4072BF63d76C0c7f699c6D9B04f313A0289D0fA3",
    },
    endpoints: {
      chelo: "http://localhost:8000/subgraphs/name/rcontre360/talent_subgraph",
      explorer: "",
      aragon: null,
    },
    settings: {
      chainId: 31337,
      logo: "/multimedia/networks/eth.png",
      name: "Hardhat",
      currency: "HETH",
      moralis_name: "mumbai",
      explorer: "http://127.0.0.1:8545/",
      testnet: true,
      live: true,
    },
    ipfs: {
      gateway: "",
    },
  },
};

const idToNetwork: Record<SupportedNetworks, string> = {
  137: "polygon",
  80001: "mumbai",
  1: "ethereum",
  5: "goerli",
  31337: "hardhat",
};

export const SUPPORTED_CHAINS = Object.values(networkConfigs).map((conf) => conf.settings.chainId);

export function getNetworkConfig(networkId: SupportedNetworks): NetworkConfig {
  return networkConfigs[idToNetwork[networkId]];
}
