export interface TransactionMeta {
  txs: (CheloTransactionRequest & {status?: TransactionStatus})[];
  type: DaoType | "wallet";
  showModal?: boolean;
  dao?: string;
  metadata?: unknown;
  fromModal?: boolean;
}
