import { Stack } from "@mui/material";
import {
  FIELD_CHECKBOXES,
  FIELD_DROPDOWN,
} from "../../constants/form.constants";
import CheckboxesBuilderOptions from "./CheckboxesBuilderOptions";
import DropdownBuilderOptions from "./DropdownBuilderOptions";

const WithFormBuilderFieldOptions = ({ children, type, meta, onChange }) => {
  let builder = null;

  switch (type) {
    case FIELD_DROPDOWN:
      builder = <DropdownBuilderOptions meta={meta} onChangeMeta={onChange} />;
      break;
    case FIELD_CHECKBOXES:
      builder = (
        <CheckboxesBuilderOptions meta={meta} onChangeMeta={onChange} />
      );
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
