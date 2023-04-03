import React from "react";
import {useRouter} from "next/router";
import Card from "@shared/components/common/Card";
import AvatarElement from "@shared/components/common/AvatarElement";
import {useProposals} from "@shared/hooks/daos";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";

const Leaderboard: React.FunctionComponent = () => {
  const router = useRouter();
  const {proposals: prop} = useProposals(router.query.id as string);
  const proposals = [...prop];

  const sortedProposals = proposals.sort((a, b) => Number(b.votesYes) - Number(a.votesYes));

  const handleClick = (userIndex: string) => () => {
    router.push({
      pathname: `/events/${router.query.id as string}/participants`,
      query: {
        userId: userIndex,
      },
    });
  };

  return (
    <div className="w-full min-h-screen flex justify-center pt-10 pb-10">
      <Card
        className="py-10 pt-0 w-full max-w-4xl bg-neutral-50 text-black rounded-3xl border border-gray-200 shadow-md h-fit"
        custom
      >
        <div className="py-5 border-b border-gray-300 flex justify-center">
          <h2 className="text-violet-500 text-2xl font-bold">Leaderboard</h2>
        </div>
        {sortedProposals.length === 0 ? (
          <p className="text-gray-500">There are no participants</p>
        ) : (
          sortedProposals.map(({metadata, votesYes}, i) => (
            <div
              key={i}
              className="mt-8 hover:bg-gray-100 cursor-pointer flex items-center px-16 w-full justify-between"
              onClick={handleClick(String(i))}
            >
              <div className="flex items-center gap-5">
                <div className="mr-10">
                  <span className="text-lg font-semibold mr-4 text-gray-500">{i + 1}.</span>
                </div>
                <AvatarElement
                  address={metadata.metadata.wallet}
                  classes={{root: "w-full flex justify-between"}}
                />
                <div className="flex flex-col">
                  <p className="text-md font-semibold whitespace-nowrap">
                    {metadata?.metadata.name}
                  </p>
                  <p className="text-xs text-gray-600">{metadata?.metadata.name}</p>
                </div>
              </div>
              <div className={"flex gap-2 font-semibold ml-5"}>
                <span>{votesYes}</span>
                <ThumbUpOffAltIcon fontSize="medium" color="action" />
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
};

export default Leaderboard;
