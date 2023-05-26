import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";

const FormDateTimeField = ({ field, value, onChange }) => {
  let momentDate = moment();

  try {
    if (value) momentDate = moment(value, moment.defaultFormatUtc);
  } catch (error) {}

  return (
    <DatePicker
      format="ddd DD-MM-YYYY"
      label={field.name}
      value={momentDate}
      onChange={onChange}
    />
  );
};

export default FormDateTimeField;
