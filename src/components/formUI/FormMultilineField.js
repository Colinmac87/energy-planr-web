import { TextField } from "@mui/material";

const FormMultilineField = ({ field, value, onChange }) => {
  return (
    <TextField
      label={field.name}
      fullWidth
      multiline
      rows={4}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default FormMultilineField;
