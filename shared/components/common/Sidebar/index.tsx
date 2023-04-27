import * as React from "react";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import TollIcon from "@mui/icons-material/Toll";

import {useAppSelector} from "@redux/store";
import LayoutDropdown, {DropdownElement} from "../LayoutDropdown";

const Sidebar = () => {
  const {daos} = useAppSelector((state) => state);
  const loaded = daos.daos.length <= 0;

  const LENDING_ITEMS: DropdownElement[] = [
    {label: "Home", url: "/lending", off: loaded, icon: <HomeOutlined width={30} />},
    {
      label: "Dashboard",
      url: "/dashboard",
      off: loaded,
      icon: <DashboardOutlined width={30} />,
    },
    {
      label: "Create Event",
      url: "/create_event",
      off: loaded,
      icon: <CalendarMonthOutlined width={30} />,
    },
    {
      label: "Manage tokens",
      url: "/manage_tokens",
      off: loaded,
      icon: <TollIcon width={30} />,
    },
  ];

  return (
    <aside className="w-64 sm:block hidden bg-neutral-50 pt-36" aria-label="Sidebar">
      <div>
        <LayoutDropdown items={LENDING_ITEMS} />
      </div>
    </aside>
  );
};
export default Sidebar;
