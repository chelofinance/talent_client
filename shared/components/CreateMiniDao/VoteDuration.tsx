import React from "react";

import { Card } from "@shared/components/common/Card";
import { TextInput, Slider } from "@shared/components/common/Forms";

type VoteConfigurationProps = {
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

export const VoteConfiguration: React.FunctionComponent<VoteConfigurationProps> = (props) => {
  const { setFieldValue, values } = props;

  React.useEffect(() => {
    if (values.quorum > values.support) setFieldValue("support", values.quorum);
  }, [values.support, values.quorum]);

  return (
    <>
      <div className="flex items-center justify-center">
        <h1 className="text-black text-2xl mr-3">Vote Configuration</h1>
      </div>
      <div className="flex flex-col items-center justify-between w-full h-full">
        <div className="flex flex-col w-full">
          <Slider
            sliderProps={{
              max: 100,
              step: 25,
            }}
            name="support"
            label="Support Required"
            className="w-full mt-10"
          />
          <Slider
            sliderProps={{ max: 100, step: 25 }}
            name="quorum"
            label="Minimum Quorum"
            className="w-full mt-5"
          />
          <div className="flex w-full gap-4 mt-5">
            <TextInput
              white
              name="days"
              label="Vote duration"
              placeholder="Days"
              type="number"
              min={0}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default VoteConfiguration;
