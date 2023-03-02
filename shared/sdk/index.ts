import {JsonRpcProvider, Web3Provider} from "@ethersproject/providers";
import {getUserAragonDAOs} from "@helpers/chelo/services/daos";
import {SUPPORTED_CHAINS} from "@helpers/network";
import {DaoController, AragonController} from "./adapters";

export class DaoManager {
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
      //getUserSyndicateDaos({account, networkId: chainUsed}),
      //getUserSnapshotDaos({account, networkId: chainUsed}),
    ]);
    const daos: {dao: string; name: string}[] = rawDaos.reduce((acc, cur) => acc.concat(cur), []);

    return Promise.all(
      daos.map(async ({dao, name}) => {
        const controller = new AragonController(
          {
            id: dao,
            wallet: "",
            isRoot: true,
            name,
          },
          provider
        );
        return await controller.load();
      })
    );
  }
}

export * from "./adapters/aragon";
