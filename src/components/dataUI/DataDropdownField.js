const DataDropdownField = ({ field, value }) => {
  try {
    return field.meta.options.filter((option) => option.key == value)[0].text;
  } catch (error) {
    return <i>*failed to load data*</i>;
  }
};

export default DataDropdownField;
