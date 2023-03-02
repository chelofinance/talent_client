import React from "react";
import clsx from "clsx";
import MuiTooltip from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";

export const Tooltip: React.FunctionComponent<React.PropsWithChildren<{message: string}>> = (
  props
) => {
  const {children, message} = props;
  const [open, setOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <div>
        <MuiTooltip
          onClose={handleTooltipClose as any}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={message}
        >
          <div onClick={handleTooltipOpen} className="cursor-pointer">
            {children}
          </div>
        </MuiTooltip>
      </div>
    </ClickAwayListener>
  );
};

export default Tooltip;
