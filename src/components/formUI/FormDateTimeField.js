import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";

const FormDateTimeField = ({ field, value, onChange }) => {
  return (
    <DatePicker
      format="ddd DD-MM-YYYY"
      label={field.name}
      value={moment(value, moment.defaultFormatUtc)}
      onChange={onChange}
    />
  );
};

export default FormDateTimeField;
