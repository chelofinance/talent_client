import React from "react";

import {TextInput, SelectInput} from "@shared/components/common/Forms";
import {Card} from "@shared/components/common/Card";
import Blockies from "../common/Blockies";

export const ReviewAndCreate: React.FunctionComponent<{values: any}> = (props) => {
  const {values} = props;
  console.log({values});
  return (
    <>
      <div className="flex items-center justify-center">
        <h2 className="text-black text-2xl mr-3 mb-10">Review and Create</h2>
      </div>
      <Card className="bg-white border border-gray-300" custom>
        <div className="border-b border-gray-300 py-1 px-6">
          <h3 className="text-black text-sm mr-3 ">MINI DAO INFO</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 flex flex-col justify-between w-full mt-2 h-full p-10">
          <div className="mb-10">
            <span className="text-orange_custom text-sm">NAME</span>
            <p className="text-lg capitalize">{values.name}</p>
          </div>
          <div className="mb-10">
            <span className="text-orange_custom text-sm">TYPE</span>
            <p className="text-lg capitalize">{values.type}</p>
          </div>
          <div>
            <span className="text-orange_custom text-sm">SUPPORT</span>
            <p className="text-lg capitalize">{values.support}%</p>
          </div>
          <div>
            <span className="text-orange_custom text-sm">QUORUM</span>
            <p className="text-lg capitalize">{values.quorum}%</p>
          </div>
          <div className="mb-10">
            <span className="text-orange_custom text-sm">VOTE DURATION</span>
            <p className="text-lg capitalize">
              {values.days} {values.days > 1 ? "DAYS" : "DAY"}
            </p>
          </div>
        </div>
        <div className="pl-10 pb-10">
          <span className="text-orange_custom text-sm mb-2">MEMBER LIST</span>
          {values.members.map((member: {address: string; stake: string}, index: number) => (
            <div className="flex items-center gap-1">
              <Blockies seed={member.address} size={6} scale={3} className="rounded-sm" />
              <p className="text-sm" key={index}>
                {member.address}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

export default ReviewAndCreate;
