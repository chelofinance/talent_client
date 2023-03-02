import React from "react";
import clsx from "clsx";
import Popover from "@shared/components/common/Popover";
import {InformationCircleIcon} from "@heroicons/react/solid";

export interface InfoPopoverProps {
  classes?: Partial<Record<"root" | "panel", string>>;
  size?: number;
  info: JSX.Element;
}

export const InfoPopover: React.FunctionComponent<InfoPopoverProps> = (props) => {
  const {classes, info, size} = props;

  return (
    <div className={clsx("flex gap-3 text-white", classes?.root)} style={{zIndex: "100"}}>
      <div>
        <Popover
          classes={{
            panel: classes.panel,
            button: "border-none",
          }}
          button={
            <div className="items-center gap-3 text-white">
              <InformationCircleIcon className="cursor-pointer" width={size || 20} />
            </div>
          }
        >
          <div className="text-white p-3">{info} </div>
        </Popover>
      </div>
    </div>
  );
};

export default InfoPopover;
