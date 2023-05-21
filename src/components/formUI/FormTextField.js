import { TextField } from "@mui/material";

const FormTextField = ({ field, value, onChange }) => {
  return (
    <TextField
      label={field.name}
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default FormTextField;
