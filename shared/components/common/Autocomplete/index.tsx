import * as React from "react";
import clsx from "clsx";
import AutocompleteMUI from "@mui/material/Autocomplete";

import {TextInput} from "@shared/components/common/Forms";

interface AutocompleteProps<T> {
  options?: T[];
  classes?: Partial<Record<"root", string>>;
  placeholder?: string;
  error?: string;
  value?: T;
  onChange?(event: React.ChangeEvent<any>, value: T): void;
  RenderOption?: React.FunctionComponent<T>;
}

const LIST_COLOR = {
  bg: "gray-900",
  hover: "gray-800",
};

export const Autocomplete = <T extends unknown & {label: string}>(
  props: AutocompleteProps<T>
) => {
  const {options, classes, placeholder, value, error, onChange, RenderOption} = props;

  return (
    <div className={clsx(classes?.root)}>
      <AutocompleteMUI
        disablePortal
        id="combo-box-demo"
        classes={{listbox: `bg-${LIST_COLOR.bg} text-white`}}
        options={options}
        value={value as any}
        onChange={onChange as any}
        renderOption={
          RenderOption
            ? (props, option) => (
              <div
                {...(props as any)}
                className={`flex gap-3 justify-between hover:bg- text-white p-3 hover:bg-${LIST_COLOR.hover} bg-${LIST_COLOR.bg}`}
              >
                <RenderOption {...option} />
              </div>
            )
            : (props, option) => (
              <div
                {...(props as any)}
                className={`flex gap-3 justify-between hover:bg- text-white p-3 hover:bg-${LIST_COLOR.hover} bg-${LIST_COLOR.bg}`}
              >
                {option.label}
              </div>
            )
        }
        renderInput={(params) => (
          <div ref={params.InputProps.ref}>
            <TextInput
              white
              placeholder={placeholder}
              noFormik
              error={error}
              {...params.inputProps}
              value={(params.inputProps.value as string).split("@")[0]}
            />
          </div>
        )}
      />
    </div>
  );
};

export default Autocomplete;
