import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Typography,
} from "@mui/material";

const FormCheckboxField = ({ field, value, onChange }) => {
  // value will be array of keys

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
                    //  checked={gilad}
                    onChange={onChange}
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
