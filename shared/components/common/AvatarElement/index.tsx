import React from "react";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import clsx from "clsx";

const DEFAULT_SIZE = 50;

export const AvatarElement: React.FunctionComponent<{
  badge?: boolean;
  badgeContent?: JSX.Element;
  count?: number;
  size?: number;
  infoComponent?: JSX.Element;
  classes?: Partial<Record<"root" | "avatar" | "badge" | "count", string>>;
}> = (props) => {
  const {badge, badgeContent, count, size, infoComponent, classes} = props;

  return (
    <div className={clsx("flex items-center gap-4", classes?.root)}>
      {badge ? (
        <Badge
          overlap="circular"
          anchorOrigin={{vertical: "top", horizontal: "left"}}
          badgeContent={badgeContent}
          className={clsx(classes?.badge)}
        >
          <Avatar
            alt="Travis Howard"
            src="/multimedia/assets/ronald_duck.jpeg"
            sx={{width: size || DEFAULT_SIZE, height: size || DEFAULT_SIZE}}
          />
        </Badge>
      ) : (
        <Avatar
          className={clsx(classes?.avatar)}
          alt="Travis Howard"
          src="/multimedia/assets/ronald_duck.jpeg"
          sx={{width: size || DEFAULT_SIZE, height: size || DEFAULT_SIZE}}
        />
      )}
      {infoComponent}
      {count >= 0 && (
        <div className={clsx("flex gap-2 font-semibold ml-5", classes?.count)}>
          <span>{count}</span>
          <ThumbUpOffAltIcon fontSize="medium" color="action" />
        </div>
      )}
    </div>
  );
};

export default AvatarElement;
