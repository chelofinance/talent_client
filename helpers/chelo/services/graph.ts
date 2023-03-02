import {getNetworkConfig} from "@helpers/network";
import {
  WrapperInfo,
  DAOInfo,
  WRAPPER_INFO,
  ARAGON_DAO_INFO,
  SNAPSHOT_DAO_INFO,
  SnapshotDaoInfo,
  SNAPSHOT_USER_DAO_INFO,
  SnapshotFollowInfo,
  SYNDICATE_DAO,
  SyndicateDaoInfo,
} from "./queries";

const emptyDao = (agent: string): DAOInfo => ({
  address: {
    id: agent,
  },
  miniDaos: [],
});

export const daoCheloInfo = async (
  wallet: string,
  networkId: SupportedNetworks
): Promise<DAOInfo> => {
  const {endpoints, addresses} = getNetworkConfig(networkId);
  const data = await fetch(endpoints.chelo, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: ARAGON_DAO_INFO,
      variables: {id: wallet.toLowerCase()},
    }),
  });

  if (data.ok) {
    const json = await data.json();
    if (!json.data.daoWallet) {
      return emptyDao(wallet);
    }
    return json.data.daoWallet;
  }
};

const emptyWrapper = (): WrapperInfo => ({
  tokens: [],
});

export const getWrapperData = async (networkId: SupportedNetworks): Promise<WrapperInfo> => {
  const {endpoints, addresses} = getNetworkConfig(networkId);
  const data = await fetch(endpoints.chelo, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: WRAPPER_INFO,
      variables: {id: addresses.assetWrapper.toLowerCase()},
    }),
  });

  if (data.ok) {
    const json = await data.json();
    if (!json.data.erc721Contract) {
      return emptyWrapper();
    }
    return json.data.erc721Contract;
  }
};

const emptySnapshot = (ensName: string): SnapshotDaoInfo => ({
  id: ensName,
  name: ensName,
  network: "4",
  members: [],
  admins: [],
});

export const getSnapshotDao = async (ensName: string): Promise<SnapshotDaoInfo> => {
  const url = `https://hub.snapshot.org/graphql`;
  const data = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: SNAPSHOT_DAO_INFO,
      variables: {id_in: ensName},
    }),
  });

  if (data.ok) {
    const json = await data.json();
    if (!json.data.spaces) {
      return emptySnapshot(ensName);
    }
    return json.data.spaces[0];
  }
};

export const getSyndicateDao = async ({
  address,
  networkId,
}: {
  address: string;
  networkId: SupportedNetworks;
}): Promise<SyndicateDaoInfo> => {
  const {endpoints} = getNetworkConfig(networkId);
  const data = await fetch(endpoints.syndicate, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: SYNDICATE_DAO,
      variables: {ownerAddress: address.toLowerCase()},
    }),
  });

  if (data.ok) {
    const json = await data.json();
    return json.data.syndicateDAOs[0];
  }
  return null;
};

export const getUserSnapshotDaos = async (info: {
  account: string;
  networkId: SupportedNetworks;
}): Promise<{name: string; dao: string}[]> => {
  const {account, networkId} = info;
  const url = `https://hub.snapshot.org/graphql`;
  const data = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: SNAPSHOT_USER_DAO_INFO,
      variables: {follower_in: account.toLowerCase()},
    }),
  });

  if (data.ok) {
    const json = await data.json();
    return json.data.follows
      .filter(({space}) => Number(space.network) === networkId)
      .map(({space}: SnapshotFollowInfo) => ({
        name: space.name,
        dao: space.id,
      }));
  }
};
