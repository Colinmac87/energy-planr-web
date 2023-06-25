import { Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { useEffect, useState } from "react";

const FormDateTimeField = ({ field, value, onChange }) => {
  const [startDate, setStartDate] = useState(moment().valueOf());
  const [endDate, setEndDate] = useState(moment().valueOf());

  useEffect(() => {
    try {
      const [first, second] = value.split(",");
      setStartDate(first);
      setEndDate(second);
    } catch (error) {}
  }, []);

  useEffect(() => {
    onChange(`${startDate},${endDate}`);
  }, [startDate, endDate]);

  return (
    <Stack flexDirection={"row"} gap={2}>
      <DatePicker
        sx={{ width: "100%" }}
        format="ddd DD-MM-YYYY"
        value={moment(startDate)}
        onChange={(v) => {
          setStartDate(v.valueOf());
        }}
      />
      <p>-</p>
      <DatePicker
        sx={{ width: "100%" }}
        format="ddd DD-MM-YYYY"
        value={moment(endDate)}
        onChange={(v) => {
          setEndDate(v.valueOf());
        }}
      />
    </Stack>
  );
};

export default FormDateTimeField;
