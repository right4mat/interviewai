"use client";
import { FormControl, Select, MenuItem, SelectChangeEvent, OutlinedInput, FormLabel, SxProps, FormHelperText } from "@mui/material";

interface CustomSelectProps {
  name: string;
  value: string;
  onChange: (e: SelectChangeEvent<string>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  label?: string;
  sx?: SxProps;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

export default function CustomSelect({
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  label,
  sx,
  required = false,
  error = false,
  helperText
}: CustomSelectProps) {
  return (
    <FormControl fullWidth error={error}>
      {label && <FormLabel>{label}</FormLabel>}
      <Select
        displayEmpty
        name={name}
        value={value}
        onChange={onChange}
        input={<OutlinedInput />}
        sx={sx}
        required={required}
        error={error}
      >
        <MenuItem disabled value="">
          {placeholder}
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
} 