import { useRouter } from "next/router";

import Image from "next/image";
import EthAccount from "@shared/components/common/EthAccount";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="flex justify-end items-center p-1 bg-neutral-50 absolute w-full py-6 text-black drop-shadow-md">
      <div className="absolute left-5 top-1 flex items-center gap-2">
        <Image src="/multimedia/chelo/logo_black.png" alt="logo" width={80} height={80} />
        <span className="text-2xl font-semibold">CHELO LABS</span>
      </div>
      <div className="w-full flex justify-end items-center w-auto">
        {router.route !== "/" && <EthAccount className="mr-10" />}
      </div>
    </nav>
  );
};

export default Navbar;
