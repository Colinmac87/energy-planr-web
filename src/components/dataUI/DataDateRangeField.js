import { Typography } from "@mui/material";
import moment from "moment";

const DataDateRangeField = ({ field, value }) => {
  try {
    const [start, end] = value.split(",");

    return (
      <Typography>
        {moment(start).format("ddd DD-MM-YYYY")} -{" "}
        {moment(end).format("ddd DD-MM-YYYY")}
      </Typography>
    );
  } catch (error) {
    console.log(error);
    return <i>*failed to load data*</i>;
  }
};

export default DataDateRangeField;
