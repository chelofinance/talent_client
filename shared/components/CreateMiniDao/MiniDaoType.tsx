import React from "react";
import Image from "next/image";

import {Card} from "@shared/components/common/Card";

interface DaoNameProps {
  values: any;
  setFieldValue(field: string, value: unknown): void;
}

const DAO_TYPES: {title: string; image: string; type: MiniDaoType; description: string}[] = [
  {
    title: "Membership",
    type: "membership",
    image: "/multimedia/daos/membership_dao.svg",
    description:
      "Use a non-transferable token to represent membership. Decisions are made based on one-member-one-vote governance.",
  },
  {
    title: "Company",
    type: "company",
    image: "/multimedia/daos/company_dao.svg",
    description:
      "Use transferable tokens to represent ownership stake in your organization. Decisions are made based on stake-weighted voting.",
  },
  {
    title: "Reputation",
    type: "reputation",
    image: "/multimedia/daos/reputation_dao.svg",
    description:
      "Use non-transferable tokens to represent reputation. Decisions are made using reputation-weighted voting.",
  },
];

export const MiniDaoType: React.FunctionComponent<DaoNameProps> = (props) => {
  const {setFieldValue, values} = props;

  return (
    <div className="bg-black flex flex-col items-center w-full">
      <div className="flex items-center">
        <h1 className="text-black text-2xl mr-3">Mini DAO type</h1>
      </div>
      <div className="flex gap-3 w-full mt-4 ">
        {DAO_TYPES.map((type) => (
          <Card
            className={`w-full h-84 cursor-pointer ${type.type === values.type ? "border border-orange rounded-md" : ""
              }`}
            onClick={() => setFieldValue("type", type.type)}
          >
            <div className="w-full h-32 flex items-center justify-center">
              <Image src={type.image} width={250} height={120} />
            </div>
            <span className="text-lg mb-3 mt-2">{type.title}</span>
            <div>
              <span className="text-sm text-gray-300">{type.description}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MiniDaoType;
