import { MenuItem, Select } from "@mui/material";

const FormYesNoField = ({ field, value, onChange }) => {
  return (
    <Select
      fullWidth
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      required={field.required}
      error={field.required}
    >
      {!field.required && <MenuItem value={"-"}>-</MenuItem>}
      <MenuItem value={"yes"}>Yes</MenuItem>
      <MenuItem value={"no"}>No</MenuItem>
    </Select>
  );
};

export default FormYesNoField;
