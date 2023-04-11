import React from "react";
import Badge from "@mui/material/Badge";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import clsx from "clsx";
import Blockies from "react-blockies";

const DEFAULT_SIZE = 50;

export const AvatarElement: React.FunctionComponent<{
  badge?: boolean;
  address?: string;
  badgeContent?: JSX.Element;
  count?: string;
  size?: number;
  infoComponent?: JSX.Element;
  classes?: Partial<Record<"root" | "avatar" | "badge" | "count", string>>;
}> = (props) => {
  const {badge, badgeContent, count, size, infoComponent, classes, address} = props;

  return (
    <div className={clsx("flex items-center gap-4 justify-between", classes?.root)}>
      <div className="flex gap-4">
        {badge ? (
          <Badge
            overlap="circular"
            anchorOrigin={{vertical: "top", horizontal: "left"}}
            badgeContent={badgeContent}
            className={clsx(classes?.badge)}
          >
            <Blockies
              seed={address || "0x"}
              size={10}
              scale={size ? size / 10 : DEFAULT_SIZE / 10}
              className="rounded-full"
            />
          </Badge>
        ) : (
          <Blockies
            seed={address || "0x"}
            size={10}
            scale={size ? size / 10 : DEFAULT_SIZE / 10}
            className="rounded-full"
          />
        )}
        {infoComponent}
      </div>
      {count && (
        <div className={clsx("flex gap-2 font-semibold ml-5", classes?.count)}>
          <span>{count}</span>
          <ThumbUpOffAltIcon fontSize="medium" color="action" />
        </div>
      )}
    </div>
  );
};

export default AvatarElement;
