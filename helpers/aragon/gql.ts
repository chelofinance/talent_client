import Web3 from "web3";
import {getProvider} from "@helpers/index";
import {getNetworkConfig} from "@helpers/network";
import {getAragonApps} from "./apps";
import {resolveEnsDomain} from "./ens";

export type UserDaos = {
  ERC20balances: {
    contract: {
      organization: {
        id: string;
        txInput: string;
      };
    };
  }[];
};

export const USER_DAOS_QUERY = `
  query UserDaos($id: ID!) {
    accounts(where:{id: $id}){
      ERC20balances{
        contract{
          organization{
            id
            txInput
          }
        }
      }
    }
  }
`;

export type Organization = {
  id: string;
  address: string;
  createdAt: number;
  apps: {appId: string; address: string; repoName: string}[];
};

const GET_ORG_QUERY = `query Organizations($id: ID!) {
    organizations(where: {id: $id},  orderBy: createdAt, orderDirection: desc){ 
      id
      address
      createdAt
      apps{
        appId 
        address
        repoName
      }
    }
  }`;

export const getAragonDAO = async (
  orgAddress: string,
  networkId: SupportedNetworks,
  method?: "graph" | "chain"
): Promise<Organization | null> => {
  const {endpoints, provider: rpc} = getNetworkConfig(networkId as any);

  if ((!endpoints.aragon && !method) || method === "chain") {
    const apps = await getAragonApps({kernel: orgAddress, provider: getProvider(rpc)});

    return {
      id: orgAddress,
      address: orgAddress,
      createdAt: 0,
      apps,
    };
  }

  const data = await fetch(endpoints.aragon, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: GET_ORG_QUERY,
      variables: {id: orgAddress.toLowerCase()},
    }),
  });

  if (data.ok) {
    const json = await data.json();
    return json.data.organizations[0];
  }
  return null;
};

export const getDaoAddress = async (
  daoName: string,
  networkId: SupportedNetworks
): Promise<string> => {
  const {addresses, provider} = getNetworkConfig(networkId);
  return await resolveEnsDomain(daoName, {
    provider: new Web3(provider).currentProvider,
    registryAddress: addresses.aragonEns,
  });
};
