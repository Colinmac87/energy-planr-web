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
import DataDropdownField from "./DataDropdownField";
import DataCheckboxField from "./DataCheckboxField";
import DataDateTimeField from "./DataDateTimeField";
import DataDateRangeField from "./DataDateRangeField";

const WithDataField = ({ field, value, withLabel = true }) => {
  const renderDataField = () => {
    switch (field.type) {
      case FIELD_TEXT:
      case FIELD_URL:
      case FIELD_MULTILINE:
      case FIELD_NUMERIC:
      case FIELD_YESNO:
        return <Typography sx={{ whiteSpace: "pre-line" }}>{value}</Typography>;
      case FIELD_RICHTEXT:
        return value;
      case FIELD_DATETIME:
        return <DataDateTimeField field={field} value={value} />;
      case FIELD_DATERANGE:
        return <DataDateRangeField field={field} value={value} />;
      case FIELD_FILES:
        return value;
      case FIELD_IMAGE:
        return value;
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
