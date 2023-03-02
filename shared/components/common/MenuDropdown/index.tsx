import {Menu, Transition} from "@headlessui/react";
import React from "react";
import clsx from "clsx";

export interface MenuDropdownProps {
  title?: string;
  button: JSX.Element;
  options: {
    content: JSX.Element;
    value: string;
  }[];
  classes?: Partial<Record<"root" | "menu" | "items", string>>;
}

export const MenuDropdown: React.FunctionComponent<MenuDropdownProps> = (props) => {
  const {button, options, classes, title} = props;

  return (
    <Menu as="div" className={clsx("relative inline-block text-left", classes?.root)}>
      <Menu.Button>{button}</Menu.Button>
      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={clsx(
            "absolute z-30 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-purple-400 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
            classes?.menu
          )}
        >
          <div className="py-2">
            {title && (
              <>
                <span className="text-md text-gray-400 ml-2 mb-2 block">{title}</span>
                <div className="border-b border-black opacity-30"></div>
              </>
            )}
            {options.map((opt, i) => (
              <Menu.Item key={i}>
                {({active}, i) => (
                  <button
                    key={i}
                    className={clsx(
                      "w-full py-2 px-4",
                      `${active ? "bg-purple-600 text-white" : "bg-purple-400 text-white"}`,
                      classes?.items
                    )}
                  >
                    {opt.content}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default MenuDropdown;
