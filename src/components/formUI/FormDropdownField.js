import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const FormDropdownField = ({ field, value, onChange }) => {
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
        required={field.required}
      >
        {!field.required && <MenuItem value={"-"}>-</MenuItem>}
        {field.meta?.options?.map((option) => (
          <MenuItem value={option.value}>{option.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FormDropdownField;
