import { FormControl, Select, MenuItem, SelectChangeEvent, OutlinedInput } from "@mui/material";

interface CustomSelectProps {
  name: string;
  value: string;
  onChange: (e: SelectChangeEvent<string>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export default function CustomSelect({
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option"
}: CustomSelectProps) {
  return (
    <FormControl fullWidth>
      <Select
        displayEmpty
        name={name}
        value={value}
        onChange={onChange}
        input={<OutlinedInput />}
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
    </FormControl>
  );
} 