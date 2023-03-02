type NetworkConfig = {
  isActive: boolean;
  provider: string;
  providerWs: string;
  addresses: {
    aragonEns: string;
    aragonMiniMeFactory: string;
    assetWrapper: string;
    cheloConfig: string;
    factory: string;
    settings: string;
    company: string;
    membership: string;
    reputation: string;
    cheloMiniMeFactory: string;
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

export type NetworkName = "ethereum" | "goerli" | "polygon" | "mumbai";

export const networkConfigs: Record<NetworkName, NetworkConfig> = {
  ethereum: {
    isActive: true,
    provider: "",
    providerWs: "",
    addresses: {
      aragonEns: "",
      aragonMiniMeFactory: "",
      assetWrapper: "",
      cheloConfig: "",
      factory: "",
      settings: "",
      company: "",
      membership: "",
      reputation: "",
      cheloMiniMeFactory: "",
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
      aragonEns: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
      aragonMiniMeFactory: "0xc081540adf65f1da5e1bc61f360ee4a9feb0e1ef",
      assetWrapper: "0x416E06578563017fCd4C82437b4cDb1404C7e221",
      cheloConfig: "0xaCf54840f0Fe3D9e06aF92c07370267Fd4f3f76a",
      factory: "0x302d6BB807B4753D8bBa4632AA8b1E2f61C664d0",
      settings: "0xd82eBBBBa54830f20c7C451b0DEeB31a2c878357",
      company: "0xD285010aac4bc8dA034e3Da3fC9024CFe8CCafa8",
      membership: "0xe52f4990C6C6451Baf14ad513FF204c46130f418",
      reputation: "0x2E1Bc624C1FccbC2BA786ABB5AbB2FcBDa026dcf",
      cheloMiniMeFactory: "0x365984430525E0A2E80Dc9a695910ee2C02b362a",
      erc20: "0xBD2aad5E71272C12bA94a2651d6423eaA00dCE20",
      erc721: "0x04878D874cEAC30167D746Fe17cf588A441cf115",
      erc1155: "0x09B42f364851157353Cd21491BfC66B76163729e",
    },
    endpoints: {
      chelo: "https://api.thegraph.com/subgraphs/name/rcontre360/chelo_treasury_goerli",
      chelo_aragon: "https://api.thegraph.com/subgraphs/name/rcontre360/chelo_aragon_goerli",
      explorer: `https://api-goerli.etherscan.io/api?apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_KEY}`,
      aragon: null,
    },
    settings: {
      logo: "/multimedia/networks/eth.png",
      name: "Goerli",
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
      aragonEns: "0x3c70a0190d09f34519e6e218364451add21b7d4b",
      aragonMiniMeFactory: "0xf46d61ad92977fabcaa7653e79b820bd5d4c023c",
      assetWrapper: "0x1ea4B08ca658FA1A08FEbd128D96F69cfFF92e2d",
      cheloConfig: "0xBF42100f2c44827251747D1f592522C045058195",
      factory: "0xC480A0779c93DBFAB4a348ca7900ff25305c65ca",
      settings: "0x0A08425FcE6862698d257BaB8DbD2830B2A34ad9",
      company: "0xE2BC458f7B926dC91Ca1655f76286364a4F74784",
      membership: "0xc7e8dE28b8B914c1B4bfdB8b9119c3f665927aBb",
      reputation: "0x84E8efcaE055AB1c04963d3d8830fDCAA762Da23",
      cheloMiniMeFactory: "0x9f3F6e1f1371B8D80e823D73950639828E4a4AD3",
      erc20: "0x174e2029C489b2c53d303200a6DFAAAA8EFa444A",
      erc721: "0xF9167a7E203fEE806991A206b5871c703a1F0e78",
      erc1155: "0x8aCa04Aa2e97f5C26604ce18b3772963fBbdF184",
    },
    endpoints: {
      chelo: "https://api.thegraph.com/subgraphs/name/rcontre360/chelo_treasury_polygon",
      explorer: `https://api.polygonscan.com/api?apikey=${process.env.NEXT_PUBLIC_POLYGOSCAN_KEY}`,
      chelo_aragon: "https://api.thegraph.com/subgraphs/name/rcontre360/chelo_aragon_polygon",
      syndicate: "https://subgraph.satsuma-prod.com/syndicate/polygon/api",
      aragon: null,
    },
    settings: {
      chainId: 137,
      logo: "/multimedia/networks/matic.svg",
      name: "Polygon",
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
      aragonEns: "0x431f0eed904590b176f9ff8c36a1c4ff0ee9b982",
      aragonMiniMeFactory: "",
      assetWrapper: "0x96fd1716dC05d512cf69Bab3985C47E70D9F9416",
      cheloConfig: "0x7Edb2bED37B219dEe333C7F925a35D57f9E2A2dc",
      factory: "0x871Ae4D4da641c7b50800255E191082315D35a78",
      settings: "0xc567B2a93920ff6C216Ee0418F6CB87e99A980E3",
      company: "0x171Ac8D1ecb26762D8999AE071a53810F594Ee2a",
      membership: "0x298191020a31411c7D99D6f1C9C72c3eec59Df9f",
      reputation: "0xbAE964191Fb9E2474ed7790303960A91B93eCd24",
      cheloMiniMeFactory: "",
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
      moralis_name: "mumbai",
      explorer: "https://mumbai.polygonscan.com/",
      testnet: true,
      live: true,
    },
    ipfs: {
      gateway: "https://ipfs.eth.aragon.network/ipfs",
    },
  },
};

const idToNetwork: Record<SupportedNetworks, string> = {
  137: "polygon",
  80001: "mumbai",
  1: "ethereum",
  5: "goerli",
};

export const SUPPORTED_CHAINS = Object.values(networkConfigs).map((conf) => conf.settings.chainId);

export function getNetworkConfig(networkId: SupportedNetworks): NetworkConfig {
  return networkConfigs[idToNetwork[networkId]];
}
