import { Typography } from "@mui/material";
import moment from "moment";

const DataDateTimeField = ({ field, value }) => {
  try {
    return (
      <Typography>
        {moment(value, "YYYY-MM-DD").toDate().toDateString()}
      </Typography>
    );
  } catch (error) {
    return <i>*failed to load data*</i>;
  }
};

export default DataDateTimeField;
