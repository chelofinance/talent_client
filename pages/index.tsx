import React from "react";
import Image from "next/image";

import WalletModal from "@shared/components/common/WalletModal";
import {Button} from "@shared/components/common/Forms";

const Home = () => {
  const [showModal, setShowModal] = React.useState<"hide" | "show" | "loading">("hide");

  const connectWallet = () => {
    setShowModal("show");
  };

  return (
    <>
      <div className="h-screen flex flex-col items-center justify-center gap-4 w-full">
        <div className="flex flex-col items-center  h-1/3 justify-center gap-4 w-1/2">
          <Image
            src="/multimedia/chelo/logo_black.png"
            className="translate-y-10"
            alt="me"
            width={"200"}
            height={"200"}
          />
          <h1 className="text-black text-4xl font-semibold">CHELO LABS</h1>
          <span className="text-orange_custom text-md font-semibold">
            Unleashing the power of DAOs
          </span>
          <div className="w-full bg-orange_custom" style={{height: "3px"}}></div>
        </div>
        <div className="flex flex-col h-1/4 mt-10">
          <Button
            className="bg-orange_custom text-white text-sm font-semibold p-6 px-10 rounded w-56"
            onClick={connectWallet}
            loading={showModal === "loading"}
          >
            Connect Wallet
          </Button>
        </div>
        <WalletModal setShowModal={setShowModal} showModal={showModal === "show"} />
      </div>
    </>
  );
};

export default Home;
