import {
  FIELD_CHECKBOXES,
  FIELD_DROPDOWN,
  FIELD_FILES,
  FIELD_IMAGE,
  FIELD_RICHTEXT,
  FIELD_TEXT,
} from "../constants/form.constants";

export const getDefaultField = () => {
  return FIELD_TEXT;
};

export const canBeDefaultField = (fieldType) => {
  return [FIELD_TEXT, FIELD_DROPDOWN].includes(fieldType);
};

export const canShowInRegister = (fieldType) => {
  return ![FIELD_RICHTEXT, FIELD_FILES, FIELD_IMAGE].includes(fieldType);
};

export const validateFormBuilder = (formFields) => {
  const result = { isValid: false, errors: [] };
  try {
    let formHasDefaultField = false;
    formFields.forEach((field, i) => {
      if (!field.name || field.name.trim() == "") {
        result.errors.push("Field name is required.");
      }

      if (canBeDefaultField(field.type) && field.isDefault == true)
        if (formHasDefaultField)
          result.errors.push("Form can not have more than one default field.");
        else formHasDefaultField = true;

      if (!field.span || field.span < 1 || field.span > 12)
        result.errors.push("Display must be between 1 and 12.");

      switch (field.type) {
        case FIELD_DROPDOWN:
          if (
            !field.meta.options ||
            field.meta.options.filter((o) => o.isDeleted == false).length == 0
          )
            result.errors.push("Dropdown field must have at least one option.");
          break;
        case FIELD_CHECKBOXES:
          if (
            !field.meta.options ||
            field.meta.options.filter((o) => o.isDeleted == false).length == 0
          )
            result.errors.push(
              "Checkbox list field must have at least one option."
            );
          break;
        default:
      }
    });

    if (!formHasDefaultField) {
      result.errors.push("Form must have at least one default field.");
    }

    if (result.errors.length == 0) result.isValid = true;
  } catch (error) {
    result.errors.push(error);
  }
  return result;
};
