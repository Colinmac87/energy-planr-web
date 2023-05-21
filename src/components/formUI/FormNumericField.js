import { TextField } from "@mui/material";

const FormNumericField = ({ field, value, onChange }) => {
  return (
    <TextField
      label={field.name}
      fullWidth
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={field.required}
    />
  );
};

export default FormNumericField;
