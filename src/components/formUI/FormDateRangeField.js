import { Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

const FormDateTimeField = ({ field, value, onChange }) => {
  return (
    <Stack flexDirection={"row"} gap={2}>
      <DatePicker
        sx={{ width: "100%" }}
        label={field.name + " - Start"}
        format="ddd DD-MM-YYYY"
        onChange={onChange}
      />
      <p>-</p>
      <DatePicker
        sx={{ width: "100%" }}
        label={field.name + " - End"}
        format="ddd DD-MM-YYYY"
        onChange={onChange}
      />
    </Stack>
  );
};

export default FormDateTimeField;
