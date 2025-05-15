"use client";
import { FormControl, FormLabel, OutlinedInput, FormHelperText } from "@mui/material";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';

interface CustomDatePickerProps {
  label?: string;
  value?: string | null;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  fullWidth?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

export default function CustomizedDatePicker({
  label,
  value,
  onChange,
  placeholder,
  fullWidth = false,
  required = false,
  error = false,
  helperText,
  ...props
}: CustomDatePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <FormControl fullWidth={fullWidth} required={required} error={error}>
        {label && <FormLabel>{label}</FormLabel>}
        <DatePicker
          value={value ? moment(value) : null}
          onChange={(newValue) => {
            onChange?.(newValue ? newValue.format('YYYY-MM-DD') : null);
          }}
          slotProps={{
            textField: {
              error: error,
              fullWidth: true
            }
          }}
          {...props}
        />
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </LocalizationProvider>
  );
}
