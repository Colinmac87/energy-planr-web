import { Typography } from "@mui/material";
import moment from "moment";

const DataDateRangeField = ({ field, value }) => {
  try {
    const [start, end] = value.split(",");

    return (
      <Typography>
        {moment(parseInt(start)).format("ddd DD-MM-YYYY")} -{" "}
        {moment(parseInt(end)).format("ddd DD-MM-YYYY")}
      </Typography>
    );
  } catch (error) {
    console.log(error);
    return <i>*failed to load data*</i>;
  }
};

export default DataDateRangeField;
