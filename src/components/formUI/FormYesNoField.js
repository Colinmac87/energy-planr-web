import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const FormYesNoField = ({ field, value, onChange }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{field.name}</InputLabel>
      <Select
        fullWidth
        label={field.name}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      >
        {!field.required && <MenuItem value={"-"}>-</MenuItem>}
        <MenuItem value={"yes"}>Yes</MenuItem>
        <MenuItem value={"no"}>No</MenuItem>
      </Select>
    </FormControl>
  );
};

export default FormYesNoField;
