import { MenuItem, Select } from "@mui/material";

const FormDropdownField = ({ field, value, onChange }) => {
  return (
    <Select
      fullWidth
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      required={field.required}
      error={field.required && !value}
    >
      {!field.required && <MenuItem value={"-"}>-</MenuItem>}
      {field.meta?.options
        ?.filter((option) => !option.isDeleted)
        .map((option) => (
          <MenuItem value={option.key}>{option.text}</MenuItem>
        ))}
    </Select>
  );
};

export default FormDropdownField;
