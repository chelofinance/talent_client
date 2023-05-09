import {useRouter} from "next/router";
import Image from "next/image"; // import Image component

import EthAccount from "@shared/components/common/EthAccount";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="flex justify-end items-center p-1 bg-neutral-50 absolute w-full py-6 text-black">
      <div className="absolute left-16 top-1 flex items-center gap-2 h-full">
        <Image
          src="/multimedia/assets/TAKEOFF_LOGO_purple.png" // replace this with your image path
          alt="Talent Protocol"
          width={120} // replace with your image's width
          height={60} // replace with your image's height
        />
      </div>
      <div className="w-full flex justify-end items-center w-auto">
        {router.route !== "/" && <EthAccount className="mr-10" />}
      </div>
    </nav>
  );
};

export default Navbar;
