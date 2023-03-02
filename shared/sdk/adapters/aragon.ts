import {evmcl} from "@1hive/evmcrispr";
import {ethers} from "ethers";

import {getAragonApps, getAragonDAO, getDaoMembers, simpleAragonExec} from "@helpers/aragon";
import {calculateGasMargin} from "@helpers/index";
import {DaoController, DaoType} from "./index";
import {JsonRpcProvider, Web3Provider} from "@ethersproject/providers";

function isAragonDAO(dao: any): dao is AragonDAO {
  return dao.type === "aragon";
}

export class AragonController implements DaoController {
  public type: DaoType = "aragon";
  public dao: AragonDAO;
  public connection: {chainId?: SupportedNetworks; provider: Web3Provider | JsonRpcProvider};

  constructor(dao: AragonDAO | Omit<DAO, "type">, provider: Web3Provider | JsonRpcProvider) {
    if (isAragonDAO(dao)) {
      this.dao = dao;
      return;
    }

    this.dao = {
      id: dao.id,
      name: dao.name,
      wallet: dao.wallet,
      type: "aragon",
      apps: [],
      address: dao.id,
      createdAt: 0,
      isRoot: true,
    };
    this.connection = {provider};
  }

  public async load() {
    const chainId = (await this.connection.provider.getNetwork()).chainId as SupportedNetworks;
    const fullDao = await getAragonDAO(this.dao.id, chainId);

    this.connection.chainId = chainId;
    this.dao = {
      ...this.dao,
      apps: fullDao.apps,
      type: "aragon",
      createdAt: fullDao.createdAt,
    };

    return this;
  }

  public async propose(txs: CheloTransactionRequest[]) {
    const txString = txs
      .map(
        (tx) =>
          `act agent ${tx.to} ${tx.signature} ${tx.args
            .map((arg) => (Array.isArray(arg) ? `[${arg.join(",")}]` : `${arg}`))
            .join(" ")}`
      )
      .join("\n");

    if (this.connection.chainId === 1) {
      //evm crisp only works on chainId 1, 4 and 100
      const evm = evmcl`
         connect ${this.dao.id} token-manager voting
         ${txString}
        `;
      const res = await evm.forward(this.connection.provider.getSigner());

      return res[0];
    }

    const usedApps = await this._getApps();
    const res = await simpleAragonExec({
      transactions: txs,
      apps: usedApps,
      provider: this.connection.provider,
    });

    return await res.wait();
  }

  public async vote(proposalId: string, support: boolean) {
    const apps = await this._getApps();
    const signer = this.connection.provider.getSigner();
    const votingAddress = apps.find(({repoName}) => repoName === "voting")?.address;
    const voteIface = new ethers.utils.Interface("function vote(uint256,bool,bool)");

    const tx = {
      to: votingAddress,
      data: voteIface.encodeFunctionData("vote", [proposalId, support, false]),
      value: 0,
    };
    const gasLimit = calculateGasMargin(await signer.estimateGas(tx));
    const res = await signer.sendTransaction({...tx, gasLimit});

    return await res.wait();
  }

  public async members() {
    if (this.dao.members.length > 0) return this.dao.members;

    const apps = await this._getApps();
    const voting = apps.find(({repoName}) => repoName === "voting")?.address;
    this.dao.members = await getDaoMembers(this.connection.chainId, voting);

    return this.dao.members;
  }

  public async getProposal(proposalId: string) {
    return "getProposal";
  }

  private async _getApps() {
    if (this.dao.apps.length > 0) return this.dao.apps;

    this.dao.apps = await getAragonApps({
      kernel: this.dao.id,
      provider: this.connection.provider,
    });

    return this.dao.apps;
  }
}
