import React from "react";
import clsx from "clsx";
import {useRouter} from "next/router";

export type DropdownElement = {
  label: string;
  icon?: JSX.Element;
  onClick?: React.MouseEventHandler;
  children?: DropdownElement[];
  url?: string;
  off?: boolean;
};

interface LayoutDropdownProps {
  items: DropdownElement[];
}

const TEXT_COLORS = {
  selected: "100",
  light: "400",
  dark: "600",
};

const ROUTE_STYLES = `bg-violet-100 text-violet-500`;

const RenderChildren = ({element, key}: {element: DropdownElement; key: number}) => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const handleRoute = () => {
    if (element.off) return;
    router.push(element.url);
  };

  const toggleOpen = () => {
    if (element.off) return;
    element.url && handleRoute();
    setOpen((prev) => !prev);
  };

  return element.children?.length > 0 ? (
    <>
      <button
        type="button"
        className={clsx(
          `transition duration-75 group font-semibold  hover:bg-violet-100 text-black rounded-lg`,
          `flex items-center p-2 w-full`
        )}
        aria-controls="dropdown-example"
        data-collapse-toggle="dropdown-example"
        onClick={toggleOpen}
      >
        {element.icon}
        <span
          className={clsx(`flex-1 ml-3 text-left whitespace-nowrap`)}
          data-collapse-toggle="id"
          sidebar-toggle-item=""
        >
          {element.label}
        </span>
        <svg
          sidebar-toggle-item=""
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
      <ul id="dropdown-example" className={`${open ? "" : "hidden"} py-2 space-y-2`}>
        {element.children.map((el, i) => (
          <li key={`child-${key}-${i}`}>{RenderChildren({element: el, key: i})}</li>
        ))}
      </ul>
    </>
  ) : (
    <div
      onClick={handleRoute}
      className={clsx(
        `flex items-center p-2 text-base font-semibold  hover:bg-violet-100 text-black rounded-lg`,
        router.route === element.url && ROUTE_STYLES
      )}
    >
      {element.icon}
      <span className={`ml-3`}>{element.label}</span>
    </div>
  );
};

const LayoutDropdown: React.FunctionComponent<LayoutDropdownProps> = (props) => {
  const {items} = props;

  return (
    <aside className="w-64" aria-label="Sidebar">
      <div className="overflow-y-auto py-4 px-8 rounded ">
        <ul className="space-y-2 ">
          {items.map((item, i) => (
            <li key={i} onClick={item.off ? item.onClick : () => 1}>
              {RenderChildren({element: item, key: i})}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default LayoutDropdown;
