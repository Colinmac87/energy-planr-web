import { Typography } from "@mui/material";
import moment from "moment";

const DataDateRangeField = ({ field, value }) => {
  try {
    const [start, end] = value.split(",");

    return (
      <Typography>
        {moment(start, "YYYY-MM-DD").toDate().toDateString()} -{" "}
        {moment(end, "YYYY-MM-DD").toDate().toDateString()}
      </Typography>
    );
  } catch (error) {
    return <i>*failed to load data*</i>;
  }
};

export default DataDateRangeField;
