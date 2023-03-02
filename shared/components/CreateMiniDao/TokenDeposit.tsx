import {addressEqual} from "@helpers/index";
import {useAppSelector} from "@redux/store";
import {useMainDao} from "@shared/hooks/utils";
import React from "react";

import {Card} from "@shared/components/common/Card";
import {AutocompleteTokens} from "../common/AutocompleteTokens";
import {TextInput} from "../common/Forms";

interface TokenDepositProps {
  values: {token: ERC20};
  setFieldValue(field: string, value: unknown): void;
}

export const TokenDeposit: React.FunctionComponent<TokenDepositProps> = (props) => {
  const {setFieldValue, values} = props;
  const {tokenList} = useAppSelector((state) => state.user);
  const dao = useMainDao();
  const tokens: ERC20[] = React.useMemo(() => {
    if (!dao || !dao.erc20) return [];
    return dao?.erc20.map((tkn) => {
      return tokenList.find((onList) => addressEqual(onList.address, tkn.address)) || tkn;
    });
  }, []);

  return (
    <>
      <div className="flex items-center justify-center">
        <h3 className="text-2xl mb-10 text-center">Deposit</h3>
      </div>
      <div className="flex flex-col items-center justify-between w-full mt-2 h-full">
        <div className="flex gap-4 w-full">
          <div className="flex flex-col w-full">
            <span className="">Token</span>
            <AutocompleteTokens
              placeholder="Token"
              value={values.token}
              onChange={(_, value) => setFieldValue("token", value)}
              options={tokens}
              classes={{root: "w-full"}}
            />
          </div>
          <div className="flex flex-col w-52">
            <span className="">Amount</span>
            <TextInput
              white
              placeholder="Stakes"
              classes={{root: "w-52"}}
              type="number"
              min={1}
              name="deposit"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenDeposit;
