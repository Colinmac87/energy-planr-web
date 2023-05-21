import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";

const FormCheckboxField = ({ field, value, onChange }) => {
  return (
    <FormControl fullWidth>
      <FormLabel component="legend">{field.name}</FormLabel>
      <FormGroup>
        {field.meta?.options?.map((option) => (
          <FormControlLabel
            control={
              <Checkbox
                name={option.value}
                //  checked={gilad}
                onChange={onChange}
              />
            }
            label={option.name}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};

export default FormCheckboxField;
