import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Typography,
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
    <Box
      sx={{
        position: "relative",
        border: "1px solid #fff4",
        borderRadius: 1,
        p: 1.4,
        pt: 0.6,
        pb: 0,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -14,
          left: 8,
          pl: 0.4,
          pr: 0.4,
          backgroundColor: "#1e1e1e",
        }}
      >
        <Typography variant="caption">{field.name}</Typography>
      </Box>
      <FormControl fullWidth>
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
    </Box>
  );
};

export default FormCheckboxField;
