import React from "react";
import DP from "react-datepicker";
import {useField} from "formik";
import clsx from "clsx";

export interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  noFormik?: boolean;
  white?: boolean;
  error?: string;
  classes?: Partial<Record<"root" | "picker", string>>;
  label?: string;
}

export const DatePicker: React.FunctionComponent<any> = (props) => {
  const {noFormik, error, white, classes, label, ...rest} = props;
  const [field, meta, helpers] = noFormik ? [] : useField(props as any);

  return (
    <div className={clsx("w-full", classes?.root)}>
      {label && <span className="text-sm text-black">{label}</span>}
      <DP
        className={clsx(
          "w-full p-3 rounded-md border border-gray-200 text-black",
          classes?.datepicker
        )}
        selected={rest.value}
        {...rest}
      />
      {(error || meta?.error) && (
        <span className={`text-${white ? "red-500" : "red-300"} text-sm`}>
          {error || (typeof meta?.error === "string" && meta?.error)}
        </span>
      )}
    </div>
  );
};

export default DatePicker;
