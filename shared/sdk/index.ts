import {JsonRpcProvider, Web3Provider} from "@ethersproject/providers";
import {getUserAragonDAOs} from "@helpers/aragon";
import {getUserCheloDAOs} from "@helpers/chelo";
import {SUPPORTED_CHAINS} from "@helpers/network";
import {DaoController, AragonController} from "./adapters";
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

    const daos: (AragonDAO | MiniDAO)[] =
      type === "aragon"
        ? await getUserAragonDAOs({account, networkId: chainUsed})
        : type === "chelo"
          ? await getUserCheloDAOs({account, networkId: chainUsed})
          : [];

    return Promise.all(
      daos.map(async (dao) => {
        const controller =
          dao.type === "aragon"
            ? new AragonController(dao, provider)
            : new MiniDaoController(dao, provider);
        return await controller.load();
      })
    );
  }

  public static async getUserDaos(
    provider: Web3Provider | JsonRpcProvider,
    account: string
  ): Promise<DaoController[]> {
    const chainId = (await provider.getNetwork()).chainId;
    const chainUsed = SUPPORTED_CHAINS.includes(chainId as any)
      ? (chainId as SupportedNetworks)
      : 137;

    const rawDaos = await Promise.all([
      getUserAragonDAOs({account, networkId: chainUsed}),
      getUserCheloDAOs({account, networkId: chainUsed}),
      //getUserSyndicateDaos({account, networkId: chainUsed}),
      //getUserSnapshotDaos({account, networkId: chainUsed}),
    ]);
    const daos: DAO[] = rawDaos.reduce((acc, cur) => acc.concat(cur), [] as DAO[]);

    return Promise.all(
      daos.map(async (dao) => {
        const controller = new AragonController(dao, provider);
        return await controller.load();
      })
    );
  }
}

export * from "./adapters/aragon";
