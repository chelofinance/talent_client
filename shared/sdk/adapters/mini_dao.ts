import {JsonRpcProvider, Web3Provider} from "@ethersproject/providers";
import {attach} from "@helpers/contracts";
import {ethers} from "ethers";

import {DaoController, DaoType} from "./index";

function isMiniDao(dao: any): dao is MiniDAO {
  return dao.type === "chelo";
}

export class MiniDaoController implements DaoController {
  public type: DaoType = "chelo";
  public dao: MiniDAO;
  public connection: {chainId?: SupportedNetworks; provider: Web3Provider | JsonRpcProvider};

  constructor(dao: MiniDAO | Omit<DAO, "type">, provider: Web3Provider | JsonRpcProvider) {
    this.connection = {provider};

    if (isMiniDao(dao)) {
      this.dao = dao;
      return;
    }

    this.dao = {
      id: dao.id,
      name: dao.name,
      wallet: dao.wallet,
      type: "chelo",
      isRoot: true,
      token: {address: "", decimals: 6},
      votesLength: "",
      votingDelay: "",
      votingPeriod: "",
      quorum: "",
    };
  }

  public async load() {
    const chainId = (await this.connection.provider.getNetwork()).chainId as SupportedNetworks;
    this.connection.chainId = chainId;

    return this;
  }

  public async members() {
    return [];
  }

  public async getProposal(proposalId: string) {
    return "getProposal";
  }

  public vote(proposalId: string, support: boolean, options?: {description?: string}) {
    const core = attach("RoundVoting", this.dao.id, this.connection.provider);

    return options?.description
      ? core.castVoteWithReason(proposalId, support, options.description)
      : core.castVote(proposalId, support);
  }

  public async propose(txs: CheloTransactionRequest[], options?: {description?: string}) {
    const core = attach("RoundVoting", this.dao.id, this.connection.provider.getSigner());
    const {targets, values, calldatas} = txs.reduce(
      (acc, cur) => {
        const iface = new ethers.utils.Interface([`function ${cur.signature}`]);
        return {
          targets: acc.targets.concat([cur.to]),
          values: acc.values.concat([cur.value || "0"]),
          calldatas: acc.calldatas.concat([iface.encodeFunctionData(cur.signature, cur.args)]),
        };
      },
      {targets: [] as string[], values: [] as string[], calldatas: [] as string[]}
    );

    return core.propose(targets, values, calldatas, options?.description || "");
  }

  public encodeCall = {
    vote(proposalId: string, support: boolean, options?: {description?: string}) {
      const core = attach("RoundVoting", this.dao.id, this.connection.provider);

      return options?.description
        ? core.encodeFunctionData("castVoteWithReason", [proposalId, support, options.description])
        : core.encodeFunctionData("castVote", [proposalId, support]);
    },

    propose(txs: CheloTransactionRequest[], options?: {description?: string}) {
      const core = attach("RoundVoting", this.dao.id, this.connection.provider);
      const {targets, values, calldatas} = txs.reduce(
        (acc, cur) => {
          const iface = new ethers.utils.Interface([cur.signature]);
          return {
            targets: acc.targets.concat([cur.to]),
            values: acc.values.concat([cur.value]),
            calldatas: acc.calldatas.concat([iface.encodeFunctionData(cur.signature, cur.args)]),
          };
        },
        {targets: [], values: [], calldatas: []}
      );

      return core.encodeFunctionData("propose", [
        targets,
        values,
        calldatas,
        options?.description || "",
      ]);
    },
  };
}
