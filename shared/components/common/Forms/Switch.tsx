import * as React from "react";
import clsx from "clsx";
import FormControlLabel from "@mui/material/FormControlLabel";
import {styled} from "@mui/material/styles";
import {useField} from "formik";
import MUISwitch, {SwitchProps} from "@mui/material/Switch";

const CheloSwitch = styled((props: SwitchProps) => (
  <MUISwitch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({theme}) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#E66922",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

interface CheloSwitchProps extends SwitchProps {
  label: string;
  noFormik?: boolean;
  classes?: Partial<Record<"root" | "form", string>>;
}

export const Switch: React.FunctionComponent<CheloSwitchProps> = (props) => {
  const {value, onChange, className, label, noFormik, classes, ...rest} = props;
  const [field, meta, helpers] = noFormik ? [] : useField(props as any);

  return (
    <div className={clsx(className, classes?.root)}>
      <FormControlLabel
        onChange={noFormik ? onChange : () => helpers.setValue(!field.value)}
        labelPlacement="start"
        className={clsx(classes?.form || "text-gray-400")}
        control={
          <CheloSwitch defaultChecked checked={noFormik ? value : field.value} color="warning" />
        }
        label={label}
      />
    </div>
  );
};

export default Switch;
