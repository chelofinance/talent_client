import * as React from "react";
import Image from "next/image";
import {HomeOutlined} from "@mui/icons-material";
import {DashboardOutlined} from "@mui/icons-material";
import {AddOutlined} from "@mui/icons-material";
import CreditScoreIcon from "@mui/icons-material/CreditScore";

import {useAppSelector} from "@redux/store";
import LayoutDropdown, {DropdownElement} from "../LayoutDropdown";

const Sidebar = () => {
  const {daos} = useAppSelector((state) => state);
  const loaded = daos.length <= 0;
  const daoId = daos.length > 0 ? daos[0].id : "";

  const LENDING_ITEMS: DropdownElement[] = [
    {label: "Home", url: "/lending", off: loaded, icon: <HomeOutlined width={30} />},
    {
      label: "Dashboard",
      url: "/lending/dashboard",
      off: loaded,
      icon: <DashboardOutlined width={30} />,
    },
    {
      label: "Add Mini DAO",
      url: "/lending/add-mini-dao",
      off: loaded,
      icon: <AddOutlined width={30} />,
    },
    {
      label: "Loans",
      off: loaded,
      icon: <CreditScoreIcon width={30} />,
      children: [
        //{
        //label: "Uncollateralized",
        //url: `/lending/loans/no_collateral?main_dao=${daoId}`,
        //off: loaded,
        //},
        //{
        //label: "Collateralized",
        //url: `/lending/loans/propose_collateral?main_dao=${daoId}`,
        //off: loaded,
        //},
        {
          label: "Approve Collateral",
          url: `/lending/loans/approve_collateral?main_dao=${daoId}`,
          off: loaded,
        },
      ],
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
