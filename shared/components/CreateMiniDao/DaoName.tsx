import React from "react";

import {TextInput, SelectInput} from "@shared/components/common/Forms";

export const DaoNameType: React.FunctionComponent<{}> = (props) => {
  return (
    <>
      <div className="flex items-center justify-center">
        <h1 className="text-black text-2xl mr-3">Add New Mini-DAO</h1>
      </div>
      <div className="flex flex-col items-center w-full mt-2 h-full">
        <div className="flex flex-col w-full mb-10">
          <TextInput white label="Name" name="name" placeholder="Name" />
        </div>
        <div className="flex flex-col items-right w-full">
          <SelectInput
            label="Mini-DAO type"
            white
            name="type"
            className="w-1/2"
            placeholder="Type"
            items={[
              {label: "Membership", value: "membership"},
              {label: "Company", value: "company"},
              {label: "Reputation", value: "reputation"},
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default DaoNameType;
