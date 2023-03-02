import React from "react";
import {Popover, Transition} from "@headlessui/react";
import clsx from "clsx";

export interface PopoverProps {
  button: JSX.Element;
  classes?: Partial<Record<"root" | "button" | "panel", string>>;
}

export const CheloPopover: React.FunctionComponent<React.PropsWithChildren<PopoverProps>> = (
  props
) => {
  const {button, children, classes} = props;
  return (
    <Popover className={clsx(classes?.root || "relative w-full")} style={{zIndex: "2000"}}>
      {({open}) => (
        <>
          <Popover.Button className={clsx(classes?.button || "relative w-full")}>
            {button}
          </Popover.Button>
          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              className={clsx(
                classes?.panel ||
                "absolute w-full left-1/2 z-40 mt-3 -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl"
              )}
            >
              {children}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default CheloPopover;
