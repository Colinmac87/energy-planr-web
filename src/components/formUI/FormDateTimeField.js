import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";

const FormDateTimeField = ({ field, value, onChange }) => {
  let momentDate = moment();

  try {
    if (value) momentDate = moment(value);
  } catch (error) {
    console.log(error);
  }

  return (
    <DatePicker
      format="ddd DD-MM-YYYY"
      value={momentDate}
      onChange={(v) => {
        onChange(v.valueOf());
      }}
    />
  );
};

export default FormDateTimeField;
