import * as React from "react";
import clsx from "clsx";
import {Spiner} from "@shared/components/common/Spiner";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  loading?: boolean;
  classes?: Partial<Record<"root" | "disabled", string>>;
}

const SPINER_SIZE = 20;

export const Button: React.FunctionComponent<ButtonProps> = (props) => {
  const {classes, ...rest} = props;
  if (props.disabled)
    return (
      <button
        className={clsx(
          `bg-purple-600 text-gray-400 font-semibold px-3 py-3 rounded-md  cursor-auto`,
          classes?.disabled
        )}
        {...rest}
        disabled={true}
      >
        {props.loading ? <Spiner color="white" size={SPINER_SIZE} /> : props.children}
      </button>
    );

  return (
    <button
      className={clsx(
        props.className ||
        `bg-violet-500 text-white font-semibold ${props.loading ? "px-6 py-3" : "p-2 px-6"
        } rounded-md `,
        classes?.root
      )}
      disabled={props.loading}
      {...rest}
    >
      {props.loading ? <Spiner color="white" size={SPINER_SIZE} /> : props.children}
    </button>
  );
};

export default Button;
