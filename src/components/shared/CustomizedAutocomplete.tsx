import { Autocomplete as MuiAutocomplete, TextField, CircularProgress, FormControl, FormLabel, FormHelperText } from "@mui/material";

interface Option {
  label: string;
  value: string | number;
}

interface CustomizedAutocompleteProps {
  label: string;
  options: Option[];
  value: Option | null;
  onChange: (value: Option | null) => void;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

export default function CustomizedAutocomplete({
  label,
  options,
  value,
  onChange,
  loading = false,
  disabled = false,
  placeholder,
  error,
  helperText,
  required
}: CustomizedAutocompleteProps) {
  return (
    <FormControl fullWidth error={error}>
      <FormLabel>{label}</FormLabel>
      <MuiAutocomplete
        options={options}
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        loading={loading}
        disabled={disabled}
        renderInput={(params) => (
          <TextField
            {...params}
            error={error}
            placeholder={placeholder}
            required={required}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                border: "1px solid",
                borderColor: error ? "error.main" : "divider",
                borderRadius: 1
              }
            }}
          />
        )}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
} 