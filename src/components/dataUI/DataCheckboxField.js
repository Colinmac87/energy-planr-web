import { Typography } from "@mui/material";

const DataCheckboxField = ({ field, value }) => {
  try {
    let listTexts = JSON.parse(value).map(
      (key) => field.meta.options.filter((option) => option.key == key)[0].text
    );

    return (
      <Typography sx={{ whiteSpace: "pre-line" }}>
        {listTexts.join("\n")}
      </Typography>
    );
  } catch (error) {
    return <i>*failed to load data*</i>;
  }
};

export default DataCheckboxField;
