import { InputAdornment, TextField } from "@mui/material";

const FormTextField = ({ field, value, onChange }) => {
  return (
    <TextField
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={field.required}
      error={field.required}
      InputProps={{
        startAdornment: field.meta?.startAdornment && (
          <InputAdornment position="start">
            {field.meta?.startAdornment}
          </InputAdornment>
        ),
        endAdornment: field.meta?.endAdornment && (
          <InputAdornment position="end">
            {field.meta?.endAdornment}
          </InputAdornment>
        ),
      }}
    />
  );
};

export default FormTextField;
