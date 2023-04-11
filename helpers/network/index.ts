type NetworkConfig = {
  isActive: boolean;
  provider: string;
  providerWs: string;
  addresses: {
    factory: string;
    erc20: string;
    erc721: string;
    erc1155: string;
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
    isActive: true,
    provider: "",
    providerWs: "",
    addresses: {
      factory: "",
      erc20: "",
      erc721: "",
      erc1155: "",
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
    isActive: true,
    provider: `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_GOERLI_PROVIDER}`,
    providerWs: `wss://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_GOERLI_PROVIDER}`,
    addresses: {
      factory: "0x302d6BB807B4753D8bBa4632AA8b1E2f61C664d0",
      erc20: "0xBD2aad5E71272C12bA94a2651d6423eaA00dCE20",
      erc721: "0x04878D874cEAC30167D746Fe17cf588A441cf115",
      erc1155: "0x09B42f364851157353Cd21491BfC66B76163729e",
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
      factory: "0xC480A0779c93DBFAB4a348ca7900ff25305c65ca",
      erc20: "0x174e2029C489b2c53d303200a6DFAAAA8EFa444A",
      erc721: "0xF9167a7E203fEE806991A206b5871c703a1F0e78",
      erc1155: "0x8aCa04Aa2e97f5C26604ce18b3772963fBbdF184",
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
    provider: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_MUMBAI_PROVIDER}`,
    providerWs: `wss://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_MUMBAI_PROVIDER}`,
    addresses: {
      factory: "0x871Ae4D4da641c7b50800255E191082315D35a78",
      erc20: "0xB193CF2d4B2DE06fd553aa7681B02E4Cc0A9a852",
      erc721: "0xE93Fd38Ed63c798f7C34c4F8A28C0ECECEA527CE",
      erc1155: "0x05dBD799B5A2479F9116012789Fe611805Ab93Fb",
    },
    endpoints: {
      chelo: "https://api.thegraph.com/subgraphs/name/rcontre360/chelo_treasury_mumbai",
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
      factory: "0x871Ae4D4da641c7b50800255E191082315D35a78",
      erc20: "0xB193CF2d4B2DE06fd553aa7681B02E4Cc0A9a852",
      erc721: "0xE93Fd38Ed63c798f7C34c4F8A28C0ECECEA527CE",
      erc1155: "0x05dBD799B5A2479F9116012789Fe611805Ab93Fb",
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
