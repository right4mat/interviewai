"use client";
import { FormControl, FormLabel, OutlinedInput, type OutlinedInputProps, FormHelperText } from "@mui/material";

interface CustomInputProps extends Omit<OutlinedInputProps, "onChange"> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

export default function CustomInput({
  placeholder,
  name,
  label,
  value,
  onChange,
  multiline = false,
  rows,
  type = "text",
  required = false,
  error = false,
  helperText,
  ...props
}: CustomInputProps) {
  return (
    <FormControl fullWidth required={required} error={error}>
      {label && <FormLabel>{label}</FormLabel>}
      <OutlinedInput
        placeholder={placeholder}
        name={name}
        label={label}
        fullWidth
        value={value}
        onChange={onChange}
        multiline={multiline}
        rows={rows}
        type={type}
        error={error}
        {...props}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
