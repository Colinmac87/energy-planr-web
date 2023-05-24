import { DatePicker } from "@mui/x-date-pickers";

const FormDateTimeField = ({ field, value, onChange }) => {
  return (
    <DatePicker
      format="ddd DD-MM-YYYY"
      label={field.name}
      value={value}
      onChange={onChange}
    />
  );
};

export default FormDateTimeField;
