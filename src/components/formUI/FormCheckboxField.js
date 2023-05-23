import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";

const FormCheckboxField = ({ field, value, onChange }) => {
  // value will be array of keys

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
                  //  checked={gilad}
                  onChange={onChange}
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
