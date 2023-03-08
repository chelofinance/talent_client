import {
  SNAPSHOT_DAO_INFO,
  SnapshotDaoInfo,
  SNAPSHOT_USER_DAO_INFO,
  SnapshotFollowInfo,
} from "./queries";

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
