import {TransactionReceipt, Web3Provider} from "@ethersproject/providers";

export type DaoType = "chelo" | "snapshot" | "aragon" | "syndicate" | "daohaus";

export interface DaoController {
  dao: DAO;

  load(dao: string, provider: Web3Provider): Promise<ThisType<DaoController>>;
  propose(txs: CheloTransactionRequest[]): Promise<TransactionReceipt>;
  vote(proposalId: string, support: boolean): Promise<TransactionReceipt>;
  members(): Promise<DAO["members"]>;
  getProposal(proposalId: string): Promise<string>;
}

export * from "./aragon";
