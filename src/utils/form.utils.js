import {
  FIELD_CHECKBOXES,
  FIELD_DATETIME,
  FIELD_DROPDOWN,
  FIELD_FILE,
  FIELD_IMAGE,
  FIELD_MULTILINE,
  FIELD_NUMERIC,
  FIELD_RICHTEXT,
  FIELD_TEXT,
  FIELD_URL,
  FIELD_YESNO,
  INTERNAL_FIELDS,
} from "../constants/form.constants";

export const getDefaultField = () => {
  return FIELD_TEXT;
};

export const canBeDefaultField = (fieldType) => {
  return [FIELD_TEXT, FIELD_DROPDOWN].includes(fieldType);
};

export const canShowInRegister = (fieldType) => {
  return ![FIELD_RICHTEXT, FIELD_FILE, FIELD_IMAGE].includes(fieldType);
};

export const canShowInMapTree = (fieldType) => {
  return ![FIELD_RICHTEXT, FIELD_FILE, FIELD_IMAGE].includes(fieldType);
};

export const muiDataGridCellEditProps = (fieldType) => {
  switch (fieldType) {
    case FIELD_TEXT:
    case FIELD_MULTILINE:
    case FIELD_URL:
      return {
        enableEditing: true,
        editVariant: "text",
      };
    case FIELD_NUMERIC:
      return {
        enableEditing: true,
        editVariant: "text",
      };
    default:
      return {
        enableEditing: false,
      };
  }
};

export const isFieldUploadParsable = (field) => {
  return [
    FIELD_TEXT,
    FIELD_MULTILINE,
    FIELD_NUMERIC,
    FIELD_URL,
    FIELD_DATETIME,
    FIELD_YESNO,
  ].includes(field.type);
};

export const isInternalField = (field) => {
  return INTERNAL_FIELDS.includes(field);
};

export const validateFormBuilder = (formFields) => {
  const result = { isValid: false, errors: [] };
  try {
    let formHasDefaultField = false;
    formFields.forEach((field, index) => {
      const i = index + 1;

      if (!field.name || field.name.trim() == "")
        result.errors.push(`${i}: Field name is required`);

      if (canBeDefaultField(field.type) && field.isDefault == true)
        if (formHasDefaultField)
          result.errors.push(
            `${i}: Form can not have more than one default field`
          );
        else formHasDefaultField = true;

      if (!field.span || field.span < 1 || field.span > 12)
        result.errors.push(`${i}: Display must be between 1 and 12`);

      switch (field.type) {
        case FIELD_DROPDOWN:
          if (
            !field.meta.options ||
            field.meta.options.filter((o) => o.isDeleted == false).length == 0
          )
            result.errors.push(
              `${i}: Dropdown field must have at least one option`
            );
          break;
        case FIELD_CHECKBOXES:
          if (
            !field.meta.options ||
            field.meta.options.filter((o) => o.isDeleted == false).length == 0
          )
            result.errors.push(
              `${i}: Checkbox list field must have at least one option`
            );
          break;
        default:
      }
    });

    if (!formHasDefaultField) {
      result.errors.push("Form must have at least one default field");
    }

    if (result.errors.length == 0) result.isValid = true;
  } catch (error) {
    result.errors.push(error);
  }
  return result;
};

export const tryParseValue = (field, value) => {
  return value;
};
