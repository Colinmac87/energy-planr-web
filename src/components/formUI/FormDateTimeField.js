import { DatePicker } from "@mui/x-date-pickers";

const FormDateTimeField = ({ field, value, onChange }) => {
  return (
    <DatePicker format="DD-MM-YYYY" label={field.name} onChange={onChange} />
  );
};

export default FormDateTimeField;
