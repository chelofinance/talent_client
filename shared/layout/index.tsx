import React from "react";
import {useRouter} from "next/router";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import Sidebar from "@shared/components/common/Sidebar";
import Navbar from "@shared/components/common/Navbar";
import {useAppDispatch, useAppSelector} from "@redux/store";
import {onShowTransaction} from "@redux/actions";
import ErrorCard from "@shared/components/common/ErrorCard";
import TransactionModal from "@shared/components/common/TransactionModal";

interface Props {}

const Layout: React.FunctionComponent<Props> = ({children}) => {
  const router = useRouter();
  const isReturnRoute = router.route !== "/";
  const {user} = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  const goBack = () => {
    router.back();
  };

  return (
    <div className={`${isReturnRoute ? "bg-stone-100" : "bg-neutral-50"} w-full`}>
      <div className="flex font-montserrat flex">
        {isReturnRoute && (
          <>
            <Navbar />
            <Sidebar />
          </>
        )}
        <div className="w-full bg-no-repeat relative min-h-screen">
          <ErrorCard classes={{root: "absolute top-24 right-3"}} />
          <div className={`z-50 relative h-full ${isReturnRoute && "md:px-20 sm:px-40 pt-32"}`}>
            {isReturnRoute && (
              <button onClick={goBack} className="flex items-center gap-1 text-violet-500">
                <ArrowBackIosIcon />
                <span>Back</span>
              </button>
            )}
            {children}
          </div>
        </div>
      </div>
      <TransactionModal
        setShowModal={(arg: boolean) => dispatch(onShowTransaction(false))}
        showModal={user.transaction?.open}
        {...user.transaction.tx}
      />
    </div>
  );
};

export default Layout;
