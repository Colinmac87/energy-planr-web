import { OpenInNew } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { isUrl } from "../../utils/string.utils";

const FormURLField = ({ field, value, onChange }) => {
  return (
    <TextField
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={field.required}
      error={field.required}
      InputProps={{
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton
              disabled={!isUrl(value)}
              onClick={() => {
                if (value.toLowerCase().startsWith("http"))
                  window.open(value, "_blank");
                else window.open("https://" + value, "_blank");
              }}
              edge="end"
            >
              <OpenInNew />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default FormURLField;
