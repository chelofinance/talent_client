import * as React from "react";
import clsx from "clsx";
import { useField } from "formik";

export interface SelectInputProps
  extends Omit<React.InputHTMLAttributes<HTMLDivElement>, "value" | "onChange"> {
  label?: string;
  items: { value: string | number; label: string | number }[];
  white?: boolean;
  value?: string | number;
  error?: string;
  noFormik?: boolean;
  onChange?(e: React.ChangeEvent): void;
}

export const SelectInput: React.FunctionComponent<SelectInputProps> = (props) => {
  const { value, label, items, error, noFormik, white, onChange, disabled, placeholder, ...rest } =
    props;
  const [field, meta, helpers] = noFormik ? [] : useField(props as any);

  return (
    <div className="w-full" {...rest}>
      {label && <span className="text-sm text-black">{label}</span>}
      <select
        id="countries"
        disabled={disabled}
        className={clsx(
          `py-3 px-2 block bg-${white ? "white" : "black"} `,
          "text-lg rounded-lg focus:ring-blue-500  block w-full text-gray-400 ",
          "p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500",
          disabled ? "border border-gray-500" : "border border-orange focus:border-orange"
        )}
        onChange={disabled ? () => 1 : onChange}
        {...(rest.name ? field : {})}
      >
        {placeholder && <option selected={true}>{placeholder}</option>}
        {items.map(({ value, label }) => (
          <option value={value}>{label}</option>
        ))}
      </select>
      {(error || meta?.error) && (
        <span className={`text-${white ? "red-500" : "red-300"} text-sm`}>
          {error || (typeof meta?.error === "string" && meta?.error)}
        </span>
      )}
    </div>
  );
};

export default SelectInput;
