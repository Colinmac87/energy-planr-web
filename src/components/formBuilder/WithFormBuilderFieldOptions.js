import { Stack } from "@mui/material";
import {
  FIELD_CHECKBOXES,
  FIELD_DATERANGE,
  FIELD_DROPDOWN,
  FIELD_NUMERIC,
  FIELD_TEXT,
} from "../../constants/form.constants";
import CheckboxesBuilderOptions from "./CheckboxesBuilderOptions";
import DropdownBuilderOptions from "./DropdownBuilderOptions";
import TextBuilderOptions from "./TextBuilderOptions";
import DateRangeBuilderOptions from "./DateRangeBuilderOptions";

const WithFormBuilderFieldOptions = ({ children, type, meta, onChange }) => {
  let builder = null;

  switch (type) {
    case FIELD_TEXT:
    case FIELD_NUMERIC:
      builder = <TextBuilderOptions meta={meta} onChangeMeta={onChange} />;
      break;
    case FIELD_DROPDOWN:
      builder = <DropdownBuilderOptions meta={meta} onChangeMeta={onChange} />;
      break;
    case FIELD_CHECKBOXES:
      builder = (
        <CheckboxesBuilderOptions meta={meta} onChangeMeta={onChange} />
      );
      break;
    case FIELD_DATERANGE:
      builder = <DateRangeBuilderOptions meta={meta} onChangeMeta={onChange} />;
      break;
    default:
      return null;
  }

  return (
    <Stack>
      {children}
      {builder}
    </Stack>
  );
};

export default WithFormBuilderFieldOptions;
