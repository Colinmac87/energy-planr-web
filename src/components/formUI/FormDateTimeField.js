import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";

const FormDateTimeField = ({ field, value, onChange }) => {
  return (
    <DatePicker
      format="DD-MM-YYYY"
      value={value ? moment(value) : moment()}
      onChange={(v) => {
        onChange(v.valueOf());
      }}
      sx={{
        flex: 1,
        width: "100%",
        border: field.required && "1px solid #f00 !important",
      }}
    />
  );
};

export default FormDateTimeField;
