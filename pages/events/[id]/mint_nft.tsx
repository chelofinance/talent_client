import React from "react";
import {useRouter} from "next/router";
import {useDaos, useProposals} from "@shared/hooks/daos";
import {useAppDispatch} from "@redux/store";
import {onShowTransaction} from "@redux/actions";
import {hash} from "@helpers/index";

const StackIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    className="w-2/3 h-2/3"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
    />
  </svg>
);

const CreateEvent = () => {
  const router = useRouter();
  const {daos, loaded} = useDaos();
  const {proposals} = useProposals(router.query.id as string);
  const dispatch = useAppDispatch();

  const proposal = proposals.find((prop) => prop.metadata.metadata.wallet === router.query.userId);

  const handleNormalSubmit = async () => {
    const dao = daos[daos.length - 1] as MiniDAO;
    const {targets, values, calldatas} = proposal.calls.reduce(
      (acc, cur) => {
        return {
          targets: [...acc.targets, cur.target],
          values: [...acc.values, cur.value],
          calldatas: [...acc.calldatas, cur.calldata],
        };
      },
      {targets: [], values: [], calldatas: []}
    );
    // Add your logic here
    dispatch(
      onShowTransaction({
        txs: [
          {
            to: dao.id,
            signature: "execute(address[],uint256[],bytes[],bytes32)",
            args: [targets, values, calldatas, hash(proposal.description)],
          },
        ],
        type: "wallet",
        dao: dao.id,
      })
    );
  };

  return (
    <>
      <div className="flex flex-col items-center w-full overflow-scroll pt-20 pb-4 ">
        <div className="w-full mb-20 flex flex-col justify-center items-center gap-5">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-semibold m-0">Mint the governance Tokens!</h2>
            <h3 className="text-md font-medium mb-6">
              This tokens have the power to cast votes on Talent DAO{" "}
            </h3>
          </div>
          <div className="w-64 h-52 border border-gray-400 rounded-3xl">
            <div className="w-full h-full text-violet-500 flex justify-center items-center">
              <StackIcon />
            </div>
          </div>
          <button
            className="mt-5 mb-2 bg-violet-500 text-white rounded-full px-6 py-2 w-56 font-bold"
            onClick={handleNormalSubmit}
          >
            Mint
          </button>
          <p className="text-xs text-gray-500">You can only mint tokens once.</p>
        </div>
      </div>
    </>
  );
};

export default CreateEvent;
