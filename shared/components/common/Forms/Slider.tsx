import * as React from "react";

import Box, {BoxProps} from "@mui/material/Box";
import MUISlider, {SliderProps as MUISliderProps} from "@mui/material/Slider";
import {styled} from "@mui/material/styles";
import {useField} from "formik";

const CheloSlider = styled(MUISlider)({
  color: "#FA7B1F",
  height: 4,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#FA7B1F",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&:before": {display: "none"},
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});

export interface SliderProps extends BoxProps {
  name?: string;
  label: string;
  sliderProps?: MUISliderProps;
}

export const Slider: React.FunctionComponent<SliderProps> = (props) => {
  const {name, label, sliderProps, ...rest} = props;
  const [field, meta, helpers] = useField(props as any);

  return (
    <Box {...rest}>
      <span className="text-black">{label}</span>
      <CheloSlider
        {...(name ? field : {})}
        size="medium"
        className="text-orange_custom"
        defaultValue={70}
        aria-label="Small"
        valueLabelDisplay="auto"
        {...sliderProps}
      />
    </Box>
  );
};

export default Slider;
