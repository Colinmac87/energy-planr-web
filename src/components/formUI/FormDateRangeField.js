import { Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";

const FormDateTimeField = ({ field, value, onChange }) => {
  let start = moment(),
    end = moment();
  try {
    [start, end] = value.split(",");
    start = moment(start, moment.defaultFormatUtc);
    end = moment(end, moment.defaultFormatUtc);
  } catch (error) {}

  return (
    <Stack flexDirection={"row"} gap={2}>
      <DatePicker
        sx={{ width: "100%" }}
        label={field.name + " - Start"}
        format="ddd DD-MM-YYYY"
        value={start}
        onChange={onChange}
      />
      <p>-</p>
      <DatePicker
        sx={{ width: "100%" }}
        label={field.name + " - End"}
        format="ddd DD-MM-YYYY"
        value={end}
        onChange={onChange}
      />
    </Stack>
  );
};

export default FormDateTimeField;
