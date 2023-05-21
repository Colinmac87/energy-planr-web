import { DatePicker } from "@mui/x-date-pickers";

const FormDateTimeField = ({ field, value, onChange }) => {
  return <DatePicker label={field.name} onChange={onChange} />;
};

export default FormDateTimeField;
