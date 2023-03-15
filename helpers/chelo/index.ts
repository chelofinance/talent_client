import axios from "axios";
import {ethers} from "ethers";

import {makeQuery} from "@helpers/connection";
import {getNetworkConfig} from "@helpers/network";
import {GovernorsForOwnerQuery} from "__generated__/gql/graphql";
import {hash, toBN} from "..";
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
    value: "0",
  };
};

export const getUserCheloDAOs = async (args: {
  account: string;
  networkId: SupportedNetworks;
}): Promise<MiniDAO[]> => {
  const {networkId} = args;
  const {endpoints} = getNetworkConfig(networkId);
  const res = await makeQuery<GovernorsForOwnerQuery>(endpoints.chelo, GET_ALL_GIVEN_OWNER, {
    //id: account,
    id: "0x17edD5734a7fE8B7c4C262283EA8F2de24449F6c",
  });

  const getProposalsInfo = async (governor: GovernorsForOwnerQuery["account"]["ownerOf"][0]) => {
    const proposalsInfo = await Promise.all(
      governor.proposals.map((proposal) => getIpfsProposal(`${proposal.description}/upload.json`))
    );
    return proposalsInfo.map((info, i) => ({
      ...info,
      proposalId: governor.proposals[i].proposalId,
    }));
  };

  const proposalsInfo = (
    await Promise.all(res.account.ownerOf.map((governor) => getProposalsInfo(governor)))
  ).reduce((acc, cur) => cur.concat(acc), []);

  return res.account.ownerOf.map((governor) => {
    const isERC20 = Boolean(governor.token.asERC20);
    const res: MiniDAO = {
      id: governor.id,
      name: governor.name,
      wallet: governor.id,
      type: "chelo",
      mini_daos: [], //TODO
      members: isERC20
        ? governor.token.asERC20.balances.map((bal) => ({
          account: bal.account?.id,
          stake: bal.valueExact,
        }))
        : governor.token.asERC721.tokens.map((tkn) => ({account: tkn.owner, stake: 1})),
      isRoot: false, //TODO
      erc20: [],
      erc721: [],
      token: {
        address: isERC20
          ? governor.token.asERC20.asAccount.id
          : governor.token.asERC721.asAccount.id,
      },
      votesLength: governor.proposals.length.toString(),
      votingDelay: governor.votingDelay as string,
      votingPeriod: governor.votingPeriod as string,
      quorum: governor.quorum as string,
      proposals: governor.proposals.map((proposal) => {
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
          endBlock: proposal.endBlock,
          id: proposal.proposalId,
          canceled: proposal.canceled,
          executed: proposal.executed,
          proposalId: proposal.proposalId,
          metadata: proposalsInfo.find((info) => info.proposalId === proposal.proposalId),
          votesYes: yes.toString(),
          votesNo: yes.toString(),
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

export function ipfsToHttp(cid: string, gateway = "https://ipfs.io/ipfs/"): string {
  return `${gateway}${cid}`;
}

export async function getIpfsProposal(cid: string): Promise<MiniDaoProposal["metadata"]> {
  const url = ipfsToHttp(cid);
  const response = await axios.get<MiniDaoProposal["metadata"]>(url);
  return response.data;
}
