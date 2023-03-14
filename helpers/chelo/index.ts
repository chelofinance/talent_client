import {makeQuery} from "@helpers/connection";
import {getNetworkConfig} from "@helpers/network";
import {ethers} from "ethers";
import {GovernorsForOwnerQuery} from "__generated__/gql/graphql";
import {hash, toBN} from "..";
import {GET_ALL_GIVEN_OWNER} from "./queries";

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
    id: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  });

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
