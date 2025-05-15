"use client";
import { FormControl, FormLabel, ToggleButtonGroup, ToggleButton, FormHelperText } from "@mui/material";
import { ReactNode } from "react";

interface ToggleOption {
  value: boolean;
  label: string;
}

interface CustomizedToggleButtonProps {
  name: string;
  value: boolean;
  onChange: (value: boolean) => void;
  options: ToggleOption[];
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

export default function CustomizedToggleButton({
  name,
  value,
  onChange,
  options,
  label,
  required = false,
  error = false,
  helperText,
}: CustomizedToggleButtonProps) {
  const handleChange = (_: React.MouseEvent<HTMLElement>, newValue: boolean | null) => {
    // Only allow changing to the other value, not unselecting
    if (newValue !== null && newValue !== value) {
      onChange(newValue);
    }
  };

  return (
    <FormControl required={required} error={error}>
      {label && <FormLabel>{label}</FormLabel>}
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        aria-label={label}
        size="small"
      >
        {options.map((option) => (
          <ToggleButton key={option.label} value={option.value}>
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
} 