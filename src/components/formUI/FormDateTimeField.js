import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";

const FormDateTimeField = ({ field, value, onChange }) => {
  return (
    <DatePicker
      format="ddd DD-MM-YYYY"
      value={value ? moment(value) : moment()}
      onChange={(v) => {
        onChange(v.valueOf());
      }}
    />
  );
};

export default FormDateTimeField;
