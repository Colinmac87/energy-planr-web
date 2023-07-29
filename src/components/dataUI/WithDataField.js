import { Grid, Link, Typography } from "@mui/material";
import {
  FIELD_CHECKBOXES,
  FIELD_DATERANGE,
  FIELD_DATETIME,
  FIELD_DROPDOWN,
  FIELD_MULTILINE,
  FIELD_NUMERIC,
  FIELD_RICHTEXT,
  FIELD_TEXT,
  FIELD_URL,
  FIELD_YESNO,
} from "../../constants/form.constants";
import DataDropdownField from "./DataDropdownField";
import DataCheckboxField from "./DataCheckboxField";
import DataDateTimeField from "./DataDateTimeField";
import DataDateRangeField from "./DataDateRangeField";

const WithDataField = ({ field, value, withLabel = true }) => {
  const renderDataField = () => {
    switch (field.type) {
      case FIELD_TEXT:
      case FIELD_MULTILINE:
      case FIELD_NUMERIC:
      case FIELD_YESNO:
        return (
          <Typography sx={{ whiteSpace: "pre-line" }}>
            {field.meta?.startAdornment} {value} {field.meta?.endAdornment}
          </Typography>
        );
      case FIELD_URL:
        return (
          <Link href={value} target="_blank">
            {value}
          </Link>
        );
      case FIELD_RICHTEXT:
        return value;
      case FIELD_DATETIME:
        return <DataDateTimeField field={field} value={value} />;
      case FIELD_DATERANGE:
        return <DataDateRangeField field={field} value={value} />;
      case FIELD_DROPDOWN:
        return <DataDropdownField field={field} value={value} />;
      case FIELD_CHECKBOXES:
        return <DataCheckboxField field={field} value={value} />;
      default:
        return null;
    }
  };

  return (
    <Grid item sm={field.span}>
      {withLabel && (
        <Typography variant="overline" sx={{ display: "block", lineHeight: 2 }}>
          {field.name}
        </Typography>
      )}
      {value ? renderDataField() : <i>-</i>}
    </Grid>
  );
};

export default WithDataField;
