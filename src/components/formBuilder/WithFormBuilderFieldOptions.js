import { Stack, TextField } from "@mui/material";
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
      <Stack sx={{ gap: 2 }}>
        <TextField
          label="Helper Text"
          value={meta?.helpText}
          onChange={(e) => {
            onChange({ ...meta, helpText: e.target.value });
          }}
        />
        {builder}
      </Stack>
    </Stack>
  );
};

export default WithFormBuilderFieldOptions;
