import React from "react";

import {Card} from "@shared/components/common/Card";
import {Slider} from "@shared/components/common/Forms";

type VoteSettingsProps = {
  values: any;
  setFieldValue(field: string, value: unknown): void;
};

const sliderMarks = [
  {
    value: 0,
    label: "0%",
  },
  {
    value: 25,
    label: "25%",
  },
  {
    value: 50,
    label: "50%",
  },
  {
    value: 75,
    label: "75%",
  },
  {
    value: 100,
    label: "100%",
  },
];

export const VoteSettings: React.FunctionComponent<VoteSettingsProps> = (props) => {
  const {setFieldValue, values} = props;

  React.useEffect(() => {
    if (values.quorum > values.support) setFieldValue("support", values.quorum);
  }, [values.support, values.quorum]);

  return (
    <>
      <div className="flex items-center justify-center">
        <h1 className="text-black text-2xl mr-3">Vote settings</h1>
      </div>
      <div className="flex flex-col items-center justify-between w-full h-full">
        <div className="flex flex-col w-full">
          <Slider
            sliderProps={{
              marks: sliderMarks,
              max: 100,
              step: 25,
            }}
            name="support"
            label="Support Required"
            className="w-full mt-10"
          />
          <Slider
            sliderProps={{marks: sliderMarks, max: 100, step: 25}}
            name="quorum"
            label="Minimum Quorum"
            className="w-full mt-5"
          />
        </div>
        <Card className="w-full flex flex-col gap-3">
          <span className="text-black text-sm mr-3">
            Support required: Minimum support required in a vote to be accepted.
          </span>
          <span className="text-black text-sm mr-3">
            Minimum quorum: Minimum quorum required in a vote to be accepted.
          </span>
        </Card>
      </div>
    </>
  );
};

export default VoteSettings;
