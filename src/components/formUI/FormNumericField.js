import { TextField } from "@mui/material";

const FormNumericField = ({ field, value, onChange }) => {
  return (
    <TextField
      fullWidth
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={field.required}
      error={field.required}
    />
  );
};

export default FormNumericField;
