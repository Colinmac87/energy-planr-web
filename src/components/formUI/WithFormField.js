import { Grid, Typography } from "@mui/material";
import {
  FIELD_CHECKBOXES,
  FIELD_DATERANGE,
  FIELD_DATETIME,
  FIELD_DROPDOWN,
  FIELD_FILES,
  FIELD_IMAGE,
  FIELD_MULTILINE,
  FIELD_NUMERIC,
  FIELD_RICHTEXT,
  FIELD_TEXT,
  FIELD_URL,
  FIELD_YESNO,
} from "../../constants/form.constants";
import FormTextField from "./FormTextField";
import FormMultilineField from "./FormMultilineField";
import FormNumericField from "./FormNumericField";
import FormRichTextField from "./FormRichTextField";
import FormYesNoField from "./FormYesNoField";
import FormDateTimeField from "./FormDateTimeField";
import FormDateRangeField from "./FormDateRangeField";
import FormFileUploadField from "./FormFileUploadField";
import FormImageUploadField from "./FormImageUploadField";
import FormDropdownField from "./FormDropdownField";
import FormCheckboxField from "./FormCheckboxField";

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
      case FIELD_RICHTEXT:
        return (
          <FormRichTextField field={field} value={value} onChange={onChange} />
        );
      case FIELD_YESNO:
        return (
          <FormYesNoField field={field} value={value} onChange={onChange} />
        );
      case FIELD_DATETIME:
        return (
          <FormDateTimeField field={field} value={value} onChange={onChange} />
        );
      case FIELD_DATERANGE:
        return (
          <FormDateRangeField field={field} value={value} onChange={onChange} />
        );
      case FIELD_FILES:
        return null;
      case FIELD_IMAGE:
        return null;
      case FIELD_DROPDOWN:
        return (
          <FormDropdownField field={field} value={value} onChange={onChange} />
        );
      case FIELD_CHECKBOXES:
        return (
          <FormCheckboxField field={field} value={value} onChange={onChange} />
        );
      default:
        return null;
    }
  };

  return (
    <Grid item sm={field.span}>
      <Typography variant="overline" sx={{ display: "block", lineHeight: 2 }}>
        {field.name}
      </Typography>
      {renderFormField()}
    </Grid>
  );
};

export default WithFormField;
