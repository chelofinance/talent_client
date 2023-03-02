import React from "react";
import {ethers} from "ethers";

import EthAddress from "@shared/components/common/EthAddress";
import clsx from "clsx";

const PAGINATION_LIMIT = 5;

type CustomComponents = "head" | "body";

interface DataTableProps {
  data: Record<string, unknown>[];
  headers: {title: string; value: string}[];
  setSelected?: Function;
  custom?: Partial<Record<CustomComponents, React.FunctionComponent<DataTableProps>>>;
  custom_row?: Record<string, React.FunctionComponent<Record<string, unknown>>>;
  maxHeight?: number;
  classes?: Partial<Record<"root" | "head", string>>;
}

const DataTable: React.FunctionComponent<DataTableProps> = (props) => {
  const {data, headers, setSelected, custom, custom_row, classes} = props;
  const [page, setPage] = React.useState(0);
  const selectRow = (row: any) => () => {
    setSelected && setSelected(row);
  };

  const renderCustom = (head: {value: string}, args: any) =>
    custom_row && typeof custom_row[head.value] === "function"
      ? custom_row[head.value](args)
      : args[head.value];

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, page: number) => {
    event.preventDefault();
    setPage(page);
  };

  return (
    <>
      {typeof custom?.head === "function" && custom?.head(props)}
      <div
        className={clsx(
          classes?.root || "container text-black border border-gray-200 rounded-md bg-neutral-50"
        )}
      >
        <table className="text-left w-full">
          <thead className="flex text-black w-full">
            <tr className="flex w-full text-md font-thin text-center">
              {headers.map((head: any, idx: number) => {
                return (
                  <th
                    key={idx}
                    style={{fontWeight: 500}}
                    className={`${idx == 0 && "pl-12"
                      } pb-1 pt-7 w-1/4 text-left text-sm flex-1 uppercase text-orange_custom`}
                  >
                    {head.title}
                  </th>
                );
              })}
            </tr>
          </thead>
          {typeof custom?.body === "function" ? (
            custom?.body(props)
          ) : (
            <tbody className="bg-grey-light flex flex-col items-center justify-between overflow-y-scroll max-h-80 w-full">
              {data
                .slice(page * PAGINATION_LIMIT, page * PAGINATION_LIMIT + PAGINATION_LIMIT)
                .map((row: any, idx: number) => (
                  <tr
                    key={idx}
                    className={`flex w-full text-black text-md text-left border-t border-gray-300 z-10 ${setSelected && "cursor-pointer hover:bg-orange-100"
                      }`}
                    onClick={selectRow(row)}
                  >
                    {headers.map((head: any, index: number) => (
                      <td
                        className={`${index == 0 && "pl-12"} w-1/4 h-14 flex-1 flex items-center`}
                        key={index}
                        onClick={() => head.onClick && head.onClick(row)}
                      >
                        {ethers.utils.isAddress(row[head.value]) ? (
                          <EthAddress blockies address={row[head.value]} />
                        ) : (
                          renderCustom(head, row)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          )}
        </table>
        {data.length >= PAGINATION_LIMIT && (
          <div className="flex justify-center p-5 border-t border-gray-300">
            <div className="flex">
              {new Array(Math.ceil(data.length / PAGINATION_LIMIT)).fill(0).map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => handleClick(e, i)}
                  className={`${page === i && "bg-orange_custom text-white"
                    } px-3 py-1 rounded-md text-sm font-medium`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DataTable;
