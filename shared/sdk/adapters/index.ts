import {TransactionReceipt, Web3Provider} from "@ethersproject/providers";

export type DaoType = "chelo" | "snapshot" | "aragon" | "syndicate" | "daohaus";

export interface DaoController {
  dao: DAO;

  load(dao: string, provider: Web3Provider): Promise<ThisType<DaoController>>;
  members(): Promise<DAO["members"]>;
  getProposal(proposalId: string): Promise<string>;

  propose(txs: CheloTransactionRequest[], options?: unknown): Promise<TransactionReceipt>;
  vote(proposalId: string, support: boolean, options?: unknown): Promise<TransactionReceipt>;

  encodeCall: {
    propose(txs: CheloTransactionRequest[], options?: unknown): string;
    vote(proposalId: string, support: boolean, options?: unknown): string;
  };
}
