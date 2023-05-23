import { FIELD_CHECKBOXES } from "../../constants/form.constants";
import CheckboxesBuilderOptions from "./CheckboxesBuilderOptions";

const WithFormBuilderFieldOptions = ({ type, meta, onChange }) => {
  switch (type) {
    case FIELD_CHECKBOXES:
      return <CheckboxesBuilderOptions meta={meta} onChangeMeta={onChange} />;
    default:
      return null;
  }
};

export default WithFormBuilderFieldOptions;
