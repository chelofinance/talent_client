import React from "react";
import {LocalizationProvider, DatePicker} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import TextField from "@mui/material/TextField";

type DateTimePickerProps = {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
};

export const DateTimePicker: React.FC<DateTimePickerProps> = ({label, value, onChange}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        inputFormat="MM/dd/yyyy hh:mm a"
        value={value}
        onChange={onChange}
        renderInput={(params) => (
          <TextField
            {...params}
            InputLabelProps={{
              style: {color: "#7C3AED"},
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default DateTimePicker;
