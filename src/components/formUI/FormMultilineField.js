import { TextField } from "@mui/material";

const FormMultilineField = ({ field, value, onChange }) => {
  return (
    <TextField
      fullWidth
      multiline
      rows={4}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={field.required}
    />
  );
};

export default FormMultilineField;
