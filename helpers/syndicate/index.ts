import {getNetworkConfig} from "@helpers/network";
import {
  SYNDICATE_DAOS_GIVEN_MEMBER,
  SYNDICATE_DAOS_GIVEN_OWNER,
  SYNDICATE_DAO,
  SyndicateDaoInfo,
} from "./queries";

export const getUserSyndicateDaos = async (args: {
  account: string;
  networkId: SupportedNetworks;
}): Promise<{dao: string; name: string}[]> => {
  const {networkId, account} = args;
  const {endpoints} = getNetworkConfig(networkId);
  let res: {dao: string; name: string}[] = [];

  const byOwnerData = await fetch(endpoints.syndicate, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: SYNDICATE_DAOS_GIVEN_OWNER,
      variables: {ownerAddress: account.toLowerCase()},
    }),
  });

  const byMemberData = await fetch(endpoints.syndicate, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: SYNDICATE_DAOS_GIVEN_MEMBER,
      variables: {member: account.toLowerCase()},
    }),
  });

  if (byOwnerData.ok) {
    const json = await byOwnerData.json();
    res = json.data.syndicateDAOs.map((dao) => ({
      dao: dao.ownerAddress,
      name: dao.name,
    }));
  }

  if (byMemberData.ok) {
    const json = await byMemberData.json();
    res = res.concat(
      json.data.syndicateDAOs.map((dao) => ({
        dao: dao.ownerAddress,
        name: dao.name,
      }))
    );
  }

  return res;
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
