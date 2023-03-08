type SupportedNetworks = 1 | 5 | 137 | 80001 | 31337;

type StateErrorType = {message: string; code: string; open: boolean};

type VoteSettings = Partial<Setting & {maxPrincipal: string; minPrincipal: string; pool: string}>;

type DaoType = "snapshot" | "aragon" | "syndicate" | "chelo";
type MiniDaoType = "membership" | "reputation" | "company";
type TransactionStatus = "waiting" | "confirmed" | "sent" | "executed";

type ScriptType =
  | "loan"
  | "repay_loan"
  | "mark_defaulted"
  | "mark_resolved"
  | "pool_deposit"
  | "create_pool"
  | "setting"
  | "add_members"
  | "approve_tokens"
  | "create_mini_dao"
  | "vote"
  | "unknown";

type CheloTransactionRequest = {
  to: string;
  signature: string;
  args: unknown[];
  value?: string;
  description?: string;
};

type AragonVote = {
  id: number;
  active: boolean;
  executed: boolean;
  creation: {
    block: number;
    timestamp: number;
    txHash: string;
  };
  execution?: {
    block: number;
    timestamp: number;
    txHash: string;
  };
  supportRequired: number;
  minAcceptQuorum: number;
  votesYes: string;
  votesNo: string;
  script: {to: string; data: string}[];
  parsedScript: {
    type: ScriptType;
    meta: any;
    value: string;
    to: string;
    args: any;
    signature: string;
    sighash: string;
  }[];
  issuer: string;
  metadata: any;
};

interface ERC721 {
  address: string;
  id: string;
  uri: string;
  name: string;
  symbol: string;
  hash: string;
  image: string;
  owner: string;
  floor_price?: number;
  floor_price_usd?: number;
}

interface ERC20 {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  totalSupply?: string;
  balance?: string;
  value_usd?: number;
}

interface DAO {
  id: string;
  name: string;
  wallet: string;
  type: DaoType;
  mini_daos?: MiniDAO[];
  members?: {account: string; stake: string}[];
  isRoot: boolean;
  erc20?: {
    address: string;
    balance: string;
  }[];
  erc721?: {
    address: string;
    id: string;
  }[];
}

interface SyndicateDao extends DAO {
  name: string;
  type: "syndicate";
}

interface SnapshotDAO extends DAO {
  ens: string;
  type: "snapshot";
}

interface AragonDAO extends DAO {
  apps: AragonApp[];
  address: string;
  createdAt: number;
  type: "aragon";
  votes?: AragonVote[];
}

interface MiniDAO extends DAO {
  token: {address: string};
  votesLength: string;
  votingDelay: string;
  votingPeriod: string;
  quorum: string;
}

type AragonApp = {
  appId: string;
  repoName: string;
  address: string;
};
