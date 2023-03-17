export interface TransactionMeta {
  txs: (CheloTransactionRequest & {status?: TransactionStatus})[];
  type: DaoType | "wallet";
  dao?: string;
  metadata?: unknown;
}
