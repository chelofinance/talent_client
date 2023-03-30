import * as React from "react";
import clsx from "clsx";

import Autocomplete from "@shared/components/common/Autocomplete";
import {useAppSelector} from "@redux/store";
import {isProduction} from "@helpers/index";
import {formatValueWithDecimals} from "@helpers/erc";

interface AutocompleteTokensProps {
  options?: ERC20[];
  classes?: Partial<Record<"root", string>>;
  placeholder?: string;
  value?: ERC20;
  error?: string;
  label?: string;
  onChange?(event: React.ChangeEvent<any>, tkn: ERC20 & {label: string}): void;
}

export const AutocompleteTokens: React.FunctionComponent<AutocompleteTokensProps> = (props) => {
  const {options, classes, value, onChange, error, label} = props;
  const {tokenList} = useAppSelector((state) => state.user as any);
  const labeledValue = {...value, label: `${value?.name || ""}@${value?.symbol || ""}`};

  const finalList = React.useMemo(() => {
    const repeatedElements = options
      .map((el, i) => ({
        label: `${el.name}@${el.symbol}`,
        balance: isProduction()
          ? el.balance
          : formatValueWithDecimals({
            value: ((300 * i * 10 ** (i % 5)) % 12345).toString(),
            decimals: 1,
          }),
        ...el,
      }))
      .filter((tkn) => !tkn.name.includes("http") && !tkn.symbol.includes("http"));

    return [...new Map(repeatedElements.map((tkn) => [tkn.label, tkn])).values()] as (ERC20 & {
      label: string;
    })[];
  }, []);

  return (
    <div className={clsx(classes?.root)}>
      {label && <span className="text-sm text-black">{label}</span>}
      <Autocomplete
        error={error}
        options={finalList}
        value={labeledValue}
        onChange={onChange}
        placeholder="Token"
        RenderOption={(option) => (
          <>
            <div className="flex gap-2">
              <div className="flex justify-center items-center">
                {option.logoURI ? (
                  <img loading="lazy" alt="" src={option.logoURI} width={30} height={10} />
                ) : (
                  <div className="w-10 h-10 rounded-full border-orange_custom border-4 bg-gray-600 text-2xl justify-center items-center flex">
                    {option.symbol[0]}
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-md font-bold">{option.symbol}</span>
                <span className="text-sm text-black">{option.name}</span>
              </div>
            </div>
            <div className="flex flex-col p-2 text-black">
              <span className="text-sm text-right">Balance:</span>
              <span className="text-sm font-bold">
                {option.balance} {option.symbol}
              </span>
            </div>
          </>
        )}
      />
    </div>
  );
};

export default AutocompleteTokens;
