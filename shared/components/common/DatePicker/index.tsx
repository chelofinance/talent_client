import React from "react";
import {useFormikContext} from "formik";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {TextInput} from "@shared/components/common/Forms";
import clsx from "clsx";

type DateTimePickerProps = {
  noFormik?: boolean;
  label: string;
  placeholder?: string;
  name?: string;
  value?: Date;
  onChange?: (date: Date) => void;
};

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  value,
  placeholder,
  onChange,
  name,
  noFormik,
}) => {
  const {errors, values, setFieldValue} = useFormikContext();
  const changeFn = noFormik ? onChange : (e) => setFieldValue(name, e);
  const finalValue = noFormik ? value : values[name];

  return (
    <DatePicker
      value={finalValue}
      onChange={changeFn}
      renderInput={({inputRef, inputProps, InputProps}) => (
        <div className="flex flex-col">
          {label && <span className="text-sm text-gray-600 font-semibold">{label}</span>}
          <div
            className={clsx(
              `border-1 border-gray-400 rounded-xl bg-white border-orange p-1 appearance-none border overflow-hidden `,
              "flex justify-between items-center pr-3"
            )}
          >
            <input
              {...inputProps}
              ref={inputRef}
              placeholder={placeholder || inputProps.placeholder}
              className={clsx([
                " px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
                " w-full py-2",
              ])}
            />
            {InputProps.endAdornment}
          </div>
          {errors[name] && <span className={`text-red-300 text-sm pb-2`}>{errors[name]}</span>}
        </div>
      )}
    />
  );
};

export default DateTimePicker;
