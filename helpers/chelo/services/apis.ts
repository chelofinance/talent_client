import axios from "axios";
import {BigNumber, ethers} from "ethers";

import {getNetworkConfig} from "@helpers/network";
import {isIpfsUrl, ipfsToHttp, isProduction, getProvider} from "@helpers/index";
import {loadERC20} from "@helpers/erc";
import {Log} from "@ethersproject/providers";

const TEST_ADDRESS = "0xda9ce944a37d218c3302f6b82a094844c6eceb17";

export const getERC20Balances = async (
  account: string,
  networkId: SupportedNetworks
): Promise<ERC20[]> => {
  const {settings} = getNetworkConfig(networkId);
  const {provider} = getNetworkConfig(settings.testnet ? 137 : networkId);
  const finalAccount = settings.testnet || !isProduction() ? TEST_ADDRESS : account;
  const {data} = await axios.request<{
    result: {tokenBalances: {contractAddress: string; tokenBalance: string}[]};
  }>({
    method: "post",
    url: provider,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      jsonrpc: "2.0",
      method: "alchemy_getTokenBalances",
      params: [`${finalAccount}`],
      id: 42,
    }),
  });

  return await Promise.all(
    data.result.tokenBalances.map(({contractAddress}) =>
      loadERC20(contractAddress, settings.testnet ? 137 : networkId)
    )
  );
};

export type ERC721BalanceData = {
  status: string;
  total: number;
  page: number;
  page_size: number;
  cursor: string;
  result: {
    token_address: string;
    token_id: string;
    contract_type: string;
    owner_of: string;
    block_number: string;
    block_number_minted: string;
    token_uri: string;
    metadata: string;
    amount: string;
    name: string;
    symbol: string;
    token_hash: string;
    last_token_uri_sync: string;
    last_metadata_sync: string;
    image: string;
  }[];
};

const getFloorPrice = async (nftContract: string) => {
  try {
    const {data: assetContract} = await axios.request<{collection: {slug: string}}>({
      method: "get",
      url: `https://api.opensea.io/api/v1/asset_contract/${nftContract}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const slug = assetContract.collection.slug;

    const {data: collectionData} = await axios.request<{
      collection: {stats: {floor_price: number}};
    }>({
      method: "get",
      url: `https://api.opensea.io/api/v1/collection/${slug}`,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return collectionData.collection.stats.floor_price;
  } catch (err: any) {
    return undefined;
  }
};

type AlchemyNft = {
  contract: {address: string};
  contractMetadata?: {
    name: string;
    symbol: string;
    tokenType: "ERC1155" | "ERC721";
    description: string;
  };
  metadata: {image: string};
  id: {tokenId: string};
  tokenUri: {gateway: string};
};

export const getERC721Balances = async (
  account: string,
  networkId: SupportedNetworks
): Promise<ERC721[]> => {
  const {settings} = getNetworkConfig(networkId);
  const {provider} = getNetworkConfig(settings.testnet ? 137 : networkId);
  const finalAccount = settings.testnet ? account : TEST_ADDRESS;
  const url = provider.split("/").concat(["getNFTs", `?owner=${finalAccount}`]); //Alchemy
  url.splice(3, 0, "nft");

  const {data} = await axios.request<{ownedNfts: AlchemyNft[]}>({
    method: "get",
    url: url.join("/"),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const priceParser = (price?: number | null) => {
    if (isNaN(price) || price == null) return price;
    if (price > 1) return Number(price.toFixed(2)); //prices over 0 are just fixed
    if (String(price).includes("e")) return 0; //usually very small price
    const zeroes = Math.floor(Math.log10(1 / price));
    const [left, right] = String(price).split(".");
    return Number(`${left}.${right ? right.slice(0, zeroes + 2) : ""}`); //to convert price to a shorter number
  };

  const floorPrices = (
    await Promise.all(data.ownedNfts.map(({contract}) => getFloorPrice(contract.address)))
  ).map(priceParser);

  const floorPricesUsd = (
    await Promise.all(
      floorPrices.map((priceEth) =>
        isNaN(priceEth) || priceEth == null
          ? undefined
          : ethToUsd(ethers.utils.parseUnits(priceEth.toString(), "ether"))
      )
    )
  ).map(priceParser);

  return data.ownedNfts.map((res, i) => ({
    floor_price: floorPrices[i],
    floor_price_usd: floorPricesUsd[i] ? floorPricesUsd[i] : undefined,
    image: isIpfsUrl(res.metadata.image || "")
      ? ipfsToHttp(res.metadata.image.split("ipfs://")[1])
      : res.metadata.image,
    address: res.contract?.address,
    id: res.id.tokenId,
    uri: res.tokenUri.gateway,
    name: res.contractMetadata?.name,
    symbol: res.contractMetadata?.symbol,
    hash: res.tokenUri?.gateway.split("/").reverse()[0],
    owner: finalAccount,
  }));
};

export const ethToUsd = async (amountInWei: BigNumber): Promise<number> => {
  const res = await axios.get(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const ethData = res.data[0];
  const ethAmount = ethers.utils.formatEther(amountInWei);

  if (ethData) {
    const ethPrice: number = ethData.current_price;
    return Number(ethAmount) * ethPrice;
  }

  return null;
};

type CoingeckoNetwork = {
  id: string;
  chain_identifier: number | null;
  name: string;
  shortname: string;
};
const coingeckoNetwork = async (networkId: SupportedNetworks) => {
  const res = await axios.get<CoingeckoNetwork[]>(
    `https://api.coingecko.com/api/v3/asset_platforms`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return res.data.find((network) => network.chain_identifier === networkId);
};

const coingeckoContract = async (networkId: SupportedNetworks, contract: string) => {
  const network = await coingeckoNetwork(networkId);
  const res = await axios.get<{id: string; market_data: {current_price: {usd: number}}}>(
    `https://api.coingecko.com/api/v3/coins/${network.id}/contract/${contract}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
};

export const tokenToUsd = async (args: {
  networkId: SupportedNetworks;
  contract: string;
  mock?: boolean;
}): Promise<number> => {
  if (args.mock) return Math.random();

  const {networkId, contract} = args;
  const {market_data} = await coingeckoContract(networkId, contract);

  return market_data.current_price.usd;
};

export const listenToEvent = async (args: {
  filter: ethers.EventFilter;
  networkId: SupportedNetworks;
  callback(args: Log): void;
}) => {
  const {filter, networkId, callback} = args;
  const {providerWs} = getNetworkConfig(networkId);
  const provider = getProvider(providerWs);

  provider.on(filter, callback);
};
