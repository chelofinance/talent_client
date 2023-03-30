import {JsonRpcProvider, Web3Provider} from "@ethersproject/providers";
import {getUserCheloDAOs} from "@helpers/chelo";
import {SUPPORTED_CHAINS} from "@helpers/network";
import {DaoController} from "./adapters";
import {MiniDaoController} from "./adapters/mini_dao";

export class DaoManager {
  public static async getAllDaosOfType(
    provider: Web3Provider | JsonRpcProvider,
    account: string,
    type: DaoType
  ): Promise<DaoController[]> {
    const chainId = (await provider.getNetwork()).chainId;
    const chainUsed = SUPPORTED_CHAINS.includes(chainId as any)
      ? (chainId as SupportedNetworks)
      : 137;

    const daos: (AragonDAO | MiniDAO)[] = await getUserCheloDAOs({account, networkId: chainUsed});
    console.log({daos});

    return Promise.all(
      daos.map((dao) => {
        const controller = new MiniDaoController(dao, provider);
        return controller.load() as any;
      })
    );
  }
}
