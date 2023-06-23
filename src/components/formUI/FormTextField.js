import { TextField } from "@mui/material";

const FormTextField = ({ field, value, onChange }) => {
  return (
    <TextField
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={field.required}
    />
  );
};

export default FormTextField;
