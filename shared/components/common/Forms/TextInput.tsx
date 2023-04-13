import React from "react";
import clsx from "clsx";
import {useField} from "formik";

export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  classes?: Partial<Record<"input" | "root", string>>;
  label?: string;
  noFormik?: boolean;
  white?: boolean;
  error?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  endAdornment?: React.ReactNode;
  inputProps?: any;
  lines?: number | string;
}

export const TextInput = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {classes, noFormik, white, error, label, inputRef, endAdornment, inputProps, lines} =
    props;
  const [field, meta, helpers] = noFormik ? [] : useField(props as any);
  const finalProps = noFormik ? {...props, ...inputProps} : {...field, ...props};

  const InputElement = lines ? "textarea" : "input";

  return (
    <div className={clsx(classes?.root)} ref={ref}>
      {label && <span className="text-sm text-gray-600 font-semibold">{label}</span>}
      <div
        className={clsx(
          white
            ? `border-1 border-gray-400 rounded-${lines ? "md" : "xl"
            } bg-white border-orange p-1 appearance-none border overflow-hidden `
            : `border rounded-lg border-orange p-1.5 bg-black`
        )}
      >
        <InputElement
          {...finalProps}
          ref={inputRef}
          rows={lines}
          className={clsx(
            white
              ? [
                " px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
                " w-full py-2",
              ]
              : [
                `shadow appearance-none  w-full py-2 px-3 text-gray-300 p-10`,
                `leading-tight focus:outline-none focus:shadow-outline  bg-black `,
              ],
            classes?.input
          )}
        />
        {endAdornment}
      </div>
      {(error || meta?.error) && (
        <span className={`text-${white ? "red-300" : "red-300"} text-sm`}>
          {error || (typeof meta?.error === "string" && meta?.error)}
        </span>
      )}
    </div>
  );
});

export default TextInput;
