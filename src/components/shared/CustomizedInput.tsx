import { OutlinedInput, OutlinedInputProps } from "@mui/material";

interface CustomInputProps extends Omit<OutlinedInputProps, 'onChange'> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  ...props
}: CustomInputProps) {
  return (
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
      {...props}
    />
  );
} 