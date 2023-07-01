import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  useTheme,
} from "@mui/material";
import { useState } from "react";

const FormCheckboxField = ({ field, value, onChange }) => {
  const theme = useTheme();

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
    <Box
      sx={{
        position: "relative",
        border: `1px solid ${
          field.required ? theme.palette.error.main : theme.palette.divider
        }`,
        p: 1.4,
        pt: 0.6,
        pb: 0.6,
      }}
    >
      <FormControl fullWidth>
        <FormGroup
          sx={{
            gap: 0,
            flexDirection:
              field.meta.orientation == "horizontal" ? "row" : "column",
          }}
        >
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
    </Box>
  );
};

export default FormCheckboxField;
