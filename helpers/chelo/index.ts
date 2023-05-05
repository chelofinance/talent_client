import axios from "axios";
import {ethers} from "ethers";
import {Web3Storage} from "web3.storage";

import {makeQuery} from "@helpers/connection";
import {getNetworkConfig} from "@helpers/network";
import {GovernorsQuery} from "__generated__/gql/graphql";
import {getProvider, hash, toBN} from "..";
import {GET_ALL_GIVEN_OWNER} from "./queries";

export const VoteType = {
  Against: 0,
  For: 1,
  Abstain: 2,
};

export const parseCheloTransaction = (
  tx: CheloTransactionRequest
): {to: string; value: string; data: string} => {
  const iface = new ethers.utils.Interface([`function ${tx.signature}`]);

  return {
    to: tx.to,
    data: iface.encodeFunctionData(tx.signature.split("(")[0], tx.args),
    value: tx.value || "0",
  };
};

const checkImage = (url: string, timeoutDuration: number = 2000): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Timeout: Image took too long to load"));
    }, timeoutDuration); //2 seconds

    const img = new Image();
    img.src = url;
    img.onload = () => resolve(url);
    img.onerror = () => reject();
  });
};

export const getUserCheloDAOs = async (args: {
  account: string;
  networkId: SupportedNetworks;
}): Promise<MiniDAO[]> => {
  const {networkId} = args;
  const {endpoints, provider: rpc} = getNetworkConfig(networkId);
  const provider = getProvider(rpc);
  const res = await makeQuery<GovernorsQuery>(endpoints.chelo, GET_ALL_GIVEN_OWNER);
  const curBlock = await provider.getBlock("latest");

  const getProposalsInfo = async (governor: GovernorsQuery["governors"][0]) => {
    const proposalsInfo = await Promise.all(
      governor.proposals.map((proposal) => getIpfsProposal(proposal.description))
    );
    return proposalsInfo.map((info, i) => ({
      ...info,
      proposalId: governor.proposals[i].proposalId,
    }));
  };

  const fullRounds = await Promise.all(res.proposalRounds.map(getRoundInfo));
  const proposalsInfo = (
    await Promise.all(res.governors.map((governor) => getProposalsInfo(governor)))
  ).reduce((acc, cur) => cur.concat(acc), []);

  return res.governors.map((governor) => {
    const proposals = governor.proposals.map((proposal) => {
      const {yes, no} = proposal.votecast.reduce(
        (acc, cur) => ({
          yes:
            cur.receipt.support.support == VoteType.For
              ? acc.yes.add(toBN(cur.receipt.weight))
              : yes,
          no:
            cur.receipt.support.support == VoteType.Against
              ? acc.no.add(toBN(cur.receipt.weight))
              : no,
        }),
        {yes: toBN(0), no: toBN(0)}
      );

      return {
        description: proposal.description,
        roundId: proposal.round.id,
        endBlock: proposal.endBlock,
        id: proposal.proposalId,
        canceled: proposal.canceled,
        executed: proposal.executed,
        proposalId: proposal.proposalId,
        metadata: proposalsInfo.find((info) => info.proposalId === proposal.proposalId),
        votesYes: yes.toString(),
        votesNo: yes.toString(),
        votes: proposal.votecast.map((vote) => ({
          voter: vote.voter.id,
          timestamp: vote.timestamp,
        })),
        calls: proposal.calls.map((call) => ({
          proposalId: proposal.proposalId,
          target: call.target.id,
          value: call.value,
          calldata: call.calldata,
        })),
      };
    });

    const res: MiniDAO = {
      id: governor.id,
      name: governor.name,
      wallet: governor.id,
      type: "chelo",
      mini_daos: [], //TODO
      members: governor.token.asERC1155.balances
        .map((bal) => ({
          account: bal.account?.id as string,
          stake: bal.valueExact as string,
          role: bal.token.identifier,
        }))
        .filter((bal) => bal.account && toBN(bal.stake).gt(0)),
      isRoot: false, //TODO
      erc20: [],
      erc721: [],
      token: {
        address: governor.token.asERC1155.asAccount.id,
        decimals: 0,
      },
      votesLength: governor.proposals.length.toString(),
      votingDelay: governor.votingDelay as string,
      votingPeriod: governor.votingPeriod as string,
      quorum: governor.quorum as string,
      rounds: fullRounds.map((round) => {
        const roundProposals = proposals.filter((prop) => prop.roundId === round.id);
        const finished = curBlock.number > Number(round.endBlock.toString());
        return {
          ...round,
          id: parseInt(round.id.split("/")[1], 16).toString(),
          proposals: roundProposals,
          finished,
        };
      }),
    };

    return res;
  });
};

export function getProposalId(
  targets: string[],
  values: string[],
  fulldata: string[],
  description: string
) {
  const descriptionHash = hash(description);
  return toBN(
    ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["address[]", "uint256[]", "bytes[]", "bytes32"],
        [targets, values, fulldata, descriptionHash]
      )
    )
  );
}

export const getRoundInfo = async (
  round: GovernorsQuery["proposalRounds"][0]
): Promise<ProposalRound> => {
  const metadata = await getIpfsRound(round.description);
  const imageUrl = ipfsToHttp(metadata.image);
  let finalImage = "";
  try {
    finalImage = await checkImage(imageUrl, 4000);
  } catch {
    finalImage = "/multimedia/chelo/logo_black.png";
  }

  return {
    id: round.id,
    startBlock: round.startBlock.toString(),
    endBlock: round.endBlock.toString(),
    description: round.description,
    finished: false,
    executeThreshold: round.executeThreshold,
    proposals: [],
    roles: round.roleVotes.map(({maxVotes, roleId}) => ({
      maxVotes: Number(maxVotes),
      id: roleId.toString(),
    })),
    metadata: {...metadata, image: finalImage},
  };
};

export function ipfsToHttp(cid: string, gateway = "https://"): string {
  const splitCid = cid.split("/");
  const web3StorageCid = [gateway, splitCid[0], ".ipfs.w3s.link", `/${splitCid[1]}`].join("");
  return web3StorageCid;
}

export async function getIpfsRound(cid: string): Promise<ProposalRound["metadata"]> {
  const url = ipfsToHttp(cid);
  const response = await axios.get<ProposalRound["metadata"]>(url);
  return response.data;
}

export async function getIpfsProposal(cid: string): Promise<MiniDaoProposal["metadata"]> {
  const url = ipfsToHttp(cid);
  const response = await axios.get<MiniDaoProposal["metadata"]>(url);
  return response.data;
}

export const upload = async (files: File[]) => {
  const client = new Web3Storage({token: process.env.NEXT_PUBLIC_WEB3_STORAGE as string});

  return await client.put(files, {
    maxRetries: 3,
  });
};

export const uploadJson = async (data: Record<string, unknown>) => {
  const blob = new Blob([JSON.stringify(data)], {type: "application/json"});
  const file = new File([blob], "upload.json", {type: "application/json"});

  return `${await upload([file])}/upload.json`;
};
