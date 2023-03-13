import React from "react";
import clsx from "clsx";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  custom?: boolean;
  title?: string;
}

export const Card: React.FunctionComponent<CardProps> = (props) => {
  const { className, children, custom, title, ...rest } = props;
  return (
    <div
      className={clsx(
        { "bg-neutral-50 text-black rounded-md border border-gray-200 shadow-md": !custom },
        className
      )}
      {...rest}
    >
      {title && (
        <div className="border-b px-10 py-1 border-grey-300 font-bold text-gray-400 text-sm">
          {title}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
