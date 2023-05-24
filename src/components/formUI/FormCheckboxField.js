import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";
import { useState } from "react";

const FormCheckboxField = ({ field, value, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState(
    JSON.parse(value || "[]")
  );

  const onToggleCheckbox = (key, checked) => {
    const selectedOptionsCopy = JSON.parse(JSON.stringify(selectedOptions));

    if (checked) {
      selectedOptionsCopy.push(key);
    } else {
      const index = selectedOptionsCopy.findIndex((o) => o == key);
      selectedOptionsCopy.splice(index, 1);
    }

    setSelectedOptions(selectedOptionsCopy);
    onChange(JSON.stringify(selectedOptionsCopy));
  };

  return (
    <FormControl fullWidth>
      <FormLabel component="legend">{field.name}</FormLabel>
      <FormGroup>
        {field.meta?.options
          ?.filter((option) => !option.isDeleted)
          .map((option) => (
            <FormControlLabel
              control={
                <Checkbox
                  name={option.key}
                  checked={selectedOptions.includes(option.key)}
                  onChange={(e) =>
                    onToggleCheckbox(option.key, e.target.checked)
                  }
                />
              }
              label={option.text}
            />
          ))}
      </FormGroup>
    </FormControl>
  );
};

export default FormCheckboxField;
