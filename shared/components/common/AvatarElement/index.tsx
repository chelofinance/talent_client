import React from "react";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";

const DEFAULT_SIZE = 50;

export const AvatarElement: React.FunctionComponent<{
  badge?: boolean;
  badgeContent?: JSX.Element;
  count?: number;
  size?: number;
  infoComponent?: JSX.Element;
}> = (props) => {
  const {badge, badgeContent, count, size, infoComponent} = props;

  return (
    <div className="flex items-center gap-4">
      {badge ? (
        <Badge
          overlap="circular"
          anchorOrigin={{vertical: "top", horizontal: "left"}}
          badgeContent={badgeContent}
        >
          <Avatar
            alt="Travis Howard"
            src="/multimedia/assets/ronald_duck.jpeg"
            sx={{width: size || DEFAULT_SIZE, height: size || DEFAULT_SIZE}}
          />
        </Badge>
      ) : (
        <Avatar
          alt="Travis Howard"
          src="/multimedia/assets/ronald_duck.jpeg"
          sx={{width: size || DEFAULT_SIZE, height: size || DEFAULT_SIZE}}
        />
      )}
      {infoComponent || (
        <div className="flex flex-col">
          <p className="text-md font-semibold whitespace-nowrap">Ronald Duck</p>
          <p className="text-xs text-gray-600">Ronald Duck</p>
        </div>
      )}
      {count && (
        <div className="flex gap-2 font-semibold ml-5">
          <span>{count}</span>
          <ThumbUpOffAltIcon fontSize="medium" color="primary" />
        </div>
      )}
    </div>
  );
};

export default AvatarElement;
