import { Grid } from "@mui/material";
import {
  FIELD_MULTILINE,
  FIELD_NUMERIC,
  FIELD_TEXT,
  FIELD_URL,
} from "../../constants/form.constants";
import FormTextField from "./FormTextField";
import FormMultilineField from "./FormMultilineField";
import FormNumericField from "./FormNumericField";

const WithFormField = ({ field, value, onChange }) => {
  const renderFormField = () => {
    switch (field.type) {
      case FIELD_TEXT:
      case FIELD_URL:
        return (
          <FormTextField field={field} value={value} onChange={onChange} />
        );
      case FIELD_MULTILINE:
        return (
          <FormMultilineField field={field} value={value} onChange={onChange} />
        );
      case FIELD_NUMERIC:
        return (
          <FormNumericField field={field} value={value} onChange={onChange} />
        );
      default:
        return null;
    }
  };

  return (
    <Grid item sm={field.span}>
      {renderFormField()}
    </Grid>
  );
};

export default WithFormField;
