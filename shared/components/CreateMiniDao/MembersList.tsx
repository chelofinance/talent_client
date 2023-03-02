import React from "react";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

import {Card} from "@shared/components/common/Card";
import {TrashIcon} from "@heroicons/react/solid";
import {TextInput, SelectInput} from "@shared/components/common/Forms";
import {useMainDao} from "@shared/hooks/utils";

interface DaoNameProps {
  values: {type: MiniDaoType; members: {address: string; stakes: string}[]};
  errors: {members: string};
  setFieldValue(field: string, value: unknown): void;
}

export const MembersList: React.FunctionComponent<DaoNameProps> = (props) => {
  const {values, errors, setFieldValue} = props;
  const members = values.members;
  const dao = useMainDao();

  const handleNextChange =
    (field: "address" | "stakes", index: number) => (e: React.ChangeEvent<any>) => {
      const current = members[index];
      const newArr = [...members];
      newArr[index] = {...current, [field]: e.target.value};

      setFieldValue("members", newArr);
    };

  const addMember = () => {
    setFieldValue("members", members.concat([{address: "", stakes: ""}]));
  };

  const removeMember = (index: number) => () => {
    setFieldValue(
      "members",
      members.filter((_, i) => i !== index)
    );
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <h1 className="text-black text-2xl mr-3">Member List</h1>
      </div>
      <div className="flex flex-col justify-between w-full mt-2 h-full">
        <div>
          {errors.members && <span className="text-red-500 text-sm">{errors.members}</span>}
          <div className="mb-10 overflow-y-scroll">
            {members.map(({address, stakes}, i) => (
              <>
                <span className="text-black">{`Member ${i + 1}`}</span>
                <div className="flex gap-4 w-full">
                  <SelectInput
                    white
                    items={
                      dao?.members?.map((member) => ({
                        value: member.account,
                        label: member.account,
                      })) || []
                    }
                    onChange={handleNextChange("address", i)}
                    value={address}
                    className="my-3 w-full"
                  />
                  {values.type !== "membership" && (
                    <TextInput
                      white
                      value={stakes}
                      onChange={handleNextChange("stakes", i)}
                      placeholder="Stakes"
                      classes={{root: "my-3 w-52 flex items-end"}}
                      type="number"
                      min={1}
                    />
                  )}
                  <TrashIcon
                    className="cursor-pointer ml-2 text-orange_custom"
                    width={30}
                    onClick={removeMember(i)}
                  />
                </div>
              </>
            ))}
            <span
              className="cursor-pointer pl-4 text-orange_custom flex items-center"
              onClick={addMember}
            >
              <PersonAddAltIcon className="rounded-full mr-2" />
              Add member
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MembersList;
