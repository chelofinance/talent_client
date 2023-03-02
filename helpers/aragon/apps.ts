import {JsonRpcProvider, Web3Provider} from "@ethersproject/providers";
import {attach} from "@helpers/contracts";

export const getAragonApps = async (args: {
  kernel: string;
  provider: Web3Provider | JsonRpcProvider;
}): Promise<AragonApp[]> => {
  const idToName = {
    "0x7e852e0fcfce6551c13800f1e7476f982525c2b5277ba14b24339c68416336d1": "valut",
    "0xbf8491150dafc5dcaee5b861414dca922de09ccffa344964ae167212e8c673ae": "finance",
    "0x6b20a3010614eeebf2138ccec99f028a61c811b3b1a3343b6ff635985c75c91f": "token-manager",
    "0x9fa3927f639745e587912d4b0fea7ef9013bf93fb907d29faeab57417ba6e1d4": "voting",
    "0xe3262375f45a6e2026b7e7b18c2b807434f2508fe1a2a3dfb493c7df8f4aad6a": "acl",
    "0xddbcfd564f642ab5627cf68b9b7d374fb4f8a36e941a75d89c87998cef03bd61": "evm-script-registry",
    "0x3b4bf6bf3ad5000ecf0f989d5befde585c6860fea3e574a4fab4c49d1c177d9c": "kernel",
    "0x9ac98dc5f995bf0211ed589ef022719d1487e5cb2bab505676f0d084c07cf89a": "agent",
  };
  const kernel = attach("Kernel", args.kernel, args.provider);
  const initBlock = (await kernel.getInitializationBlock()).toNumber();
  const events = await kernel.queryFilter(kernel.filters.NewAppProxy(), initBlock, initBlock + 100);
  const apps: AragonApp[] = events.map(({args}) => ({
    appId: args.appId,
    address: args.proxy,
    repoName: idToName[args.appId],
  }));

  return apps;
};
