import React from "react";

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
        <div className="flex flex-col items-center  h-1/3 justify-center gap-4 w-1/2 pt-40">
          <h1 className="text-black text-4xl font-semibold">TALENT PROTOCOL</h1>
          <span className="text-orange_custom text-md font-semibold">Powered by Chelo labs</span>
          <div className="w-full bg-violet-500" style={{height: "3px"}}></div>
        </div>
        <div className="flex flex-col h-1/4 mt-10">
          <Button
            className="bg-violet-500 text-white text-sm font-semibold p-5 px-12 rounded-full w-56"
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
