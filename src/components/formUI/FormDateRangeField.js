import { Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

const FormDateTimeField = ({ field, value, onChange }) => {
  return (
    <Stack flexDirection={"row"} gap={2}>
      <DatePicker
        format="DD-MM-YYYY"
        sx={{ width: "100%" }}
        label={field.name + " - Start"}
        onChange={onChange}
      />
      <p>-</p>
      <DatePicker
        format="DD-MM-YYYY"
        sx={{ width: "100%" }}
        label={field.name + " - End"}
        onChange={onChange}
      />
    </Stack>
  );
};

export default FormDateTimeField;
