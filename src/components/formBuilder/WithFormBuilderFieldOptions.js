import {
  FIELD_CHECKBOXES,
  FIELD_DROPDOWN,
} from "../../constants/form.constants";
import CheckboxesBuilderOptions from "./CheckboxesBuilderOptions";
import DropdownBuilderOptions from "./DropdownBuilderOptions";

const WithFormBuilderFieldOptions = ({ type, meta, onChange }) => {
  switch (type) {
    case FIELD_DROPDOWN:
      return <DropdownBuilderOptions meta={meta} onChangeMeta={onChange} />;
    case FIELD_CHECKBOXES:
      return <CheckboxesBuilderOptions meta={meta} onChangeMeta={onChange} />;
    default:
      return null;
  }
};

export default WithFormBuilderFieldOptions;
