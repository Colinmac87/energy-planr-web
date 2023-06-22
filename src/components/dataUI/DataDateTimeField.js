import { Typography } from "@mui/material";
import moment from "moment";

const DataDateTimeField = ({ field, value }) => {
  try {
    return <Typography>{moment(value).format("ddd DD-MM-YYYY")}</Typography>;
  } catch (error) {
    return <i>*failed to load data*</i>;
  }
};

export default DataDateTimeField;
