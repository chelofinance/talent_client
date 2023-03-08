import {JsonRpcProvider, Web3Provider} from "@ethersproject/providers";

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
      token: {address: ""},
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

  public async propose(txs: CheloTransactionRequest[]) {
    return "tx" as any;
  }

  public async vote(proposalId: string, support: boolean) {
    return "tx" as any;
  }

  public async members() {
    return [];
  }

  public async getProposal(proposalId: string) {
    return "getProposal";
  }
}
