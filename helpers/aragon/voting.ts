import {BigNumber} from "ethers";

import {attach, getInterface} from "@helpers/contracts";
import {getNetworkConfig} from "@helpers/network";
import {TransactionReceipt, TransactionRequest} from "@ethersproject/providers";

export const CALLSCRIPT_ID = "0x00000001";

const decodeSegment = (script: string) => {
  const to = `0x${script.substring(0, 40)}`;
  script = script.substring(40);

  const dataLength = parseInt(`0x${script.substring(0, 8)}`, 16) * 2;
  script = script.substring(8);
  const data = `0x${script.substring(0, dataLength)}`;

  // Return rest of script for processing
  script = script.substring(dataLength);

  return {
    segment: {
      to,
      data,
    },
    scriptLeft: script,
  };
};

export const decodeCallScript = (script: string) => {
  const isCallScript = script.substring(0, 10) === CALLSCRIPT_ID;
  if (!isCallScript) {
    throw new Error(`Not a call script: ${script}`);
  }

  let scriptData = script.substring(10);
  const segments: {to: string; data: string}[] = [];

  while (scriptData.length > 0) {
    const {segment, scriptLeft} = decodeSegment(scriptData);
    segments.push(segment);
    scriptData = scriptLeft;
  }
  return segments;
};

export const getVotingData = async ({
  voting,
  networkId,
}: {
  voting: string;
  networkId: SupportedNetworks;
}): Promise<{
  voteTime: BigNumber;
  token: string;
  quorum: BigNumber;
  support: BigNumber;
  votesAmount: BigNumber;
}> => {
  const {provider} = getNetworkConfig(networkId);
  const votingContract = attach("Voting", voting, provider);
  const [voteTime, token, quorum, support, votesAmount] = await Promise.all([
    votingContract.voteTime(),
    votingContract.token(),
    votingContract.minAcceptQuorumPct(),
    votingContract.supportRequiredPct(),
    votingContract.votesLength(),
  ]);

  return {
    voteTime,
    token,
    quorum,
    support,
    votesAmount,
  };
};

const getCheloCalls = (txData: {to: string; value: string; data: string}) => {
  const ifaceArray = [
    getInterface("ERC20"),
    getInterface("LendingPool"),
    getInterface("LoanManager"),
    getInterface("Settings"),
    getInterface("AssetWrapper"),
    getInterface("CheloFactory"),
    getInterface("TemplateMembership"),
    getInterface("TemplateCompanyReputation"),
  ];

  const result = ifaceArray
    .map((iface) => {
      try {
        return iface.parseTransaction(txData);
      } catch (err) {
        return null;
      }
    })
    .find(Boolean);

  return {
    value: txData.value,
    to: txData.to,
    args: result.args as any,
    signature: result.signature,
    sighash: result.sighash,
  };
};

const prettyVotes = (vote: Omit<AragonVote, "parsedScript">): AragonVote => {
  try {
    const agentIface = getInterface("Agent");
    const {script} = vote;

    const agentTx = script.map((call) => agentIface.parseTransaction(call));

    if (agentTx.some((tx) => tx.name !== "execute")) throw new Error("invalid agent call");

    const parsedAgentTx: AragonVote["parsedScript"] = agentTx.map((tx) => ({
      ...getCheloCalls({
        to: tx.args[0] as string,
        value: tx.args[1].toString() as string,
        data: tx.args[2] as string,
      }),
      type: "unknown",
      meta: {},
    }));

    return {
      ...vote,
      parsedScript: parsedAgentTx,
    };
  } catch (err) {
    return null;
  }
};

export const getVote = async (args: {
  voteId: number;
  votingAddress: string;
  networkId: SupportedNetworks;
}): Promise<AragonVote> => {
  const {voteId, votingAddress, networkId} = args;
  const {provider} = getNetworkConfig(networkId);
  const voting = attach("Voting", votingAddress, provider);
  const rawVote = await voting.getVote(voteId);
  let executeTx: {timestamp: number; tx: TransactionReceipt};

  const startQuery = (
    await voting.queryFilter(voting.filters.StartVote(rawVote.id), rawVote.creationBlock)
  )[0];
  const createdTx = await voting.provider.getTransactionReceipt(startQuery.transactionHash);

  const executeQuery = await voting.queryFilter(
    voting.filters.ExecuteVote(rawVote.id),
    rawVote.creationBlock
  );

  if (executeQuery.length > 0) {
    const tx = await voting.provider.getTransactionReceipt(executeQuery[0].transactionHash);
    executeTx = {timestamp: (await voting.provider.getBlock(tx.blockNumber)).timestamp, tx};
  }

  const vote: AragonVote = prettyVotes({
    id: voteId,
    active: rawVote.open,
    executed: rawVote.executed,
    creation: {
      timestamp: Number(rawVote.startDate.toString()),
      block: Number(rawVote.snapshotBlock.toString()),
      txHash: createdTx.transactionHash,
    },
    execution: executeTx && {
      timestamp: executeTx.timestamp,
      block: executeTx.tx.blockNumber,
      txHash: executeTx.tx.transactionHash,
    },
    supportRequired: Number(rawVote.supportRequired.toString()),
    minAcceptQuorum: Number(rawVote.minAcceptQuorum.toString()),
    votesYes: rawVote.yea.toString(),
    votesNo: rawVote.nay.toString(),
    script: decodeCallScript(rawVote.script),
    issuer: createdTx.from,
    metadata: {},
  });

  return vote;
};

export const vote = (args: {
  votingAddress: string;
  voteId: string | number;
  yes: boolean;
}): CheloTransactionRequest => {
  const {votingAddress, yes, voteId} = args;

  return {
    to: votingAddress,
    signature: "vote(uint256,bool,bool)",
    args: [voteId, yes, true],
  };
};
