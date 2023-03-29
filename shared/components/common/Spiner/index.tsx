import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export const Spiner: React.FunctionComponent<{color?: string; size?: number}> = ({
  color,
  size,
}) => {
  return <CircularProgress size={size} color="inherit" />;
};

export default Spiner;
