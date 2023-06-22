import { Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { useEffect, useState } from "react";

const FormDateTimeField = ({ field, value, onChange }) => {
  const [tempValue, setTempValue] = useState(",");

  let start = moment(),
    end = moment();
  try {
    [start, end] = value.split(",");
    start = moment(start);
    end = moment(end);
  } catch (error) {}

  useEffect(() => {
    onChange(tempValue);
  }, [tempValue]);

  const setStart = (date) => {
    const [first, second] = tempValue.split(",");
    setTempValue([date, second].join(","));
  };
  const setEnd = (date) => {
    const [first, second] = tempValue.split(",");
    setTempValue([first, date].join(","));
  };

  return (
    <Stack flexDirection={"row"} gap={2}>
      <DatePicker
        sx={{ width: "100%" }}
        label={field.name + " - Start"}
        format="ddd DD-MM-YYYY"
        value={start}
        onChange={(v) => {
          setStart(v.valueOf().toString());
        }}
      />
      <p>-</p>
      <DatePicker
        sx={{ width: "100%" }}
        label={field.name + " - End"}
        format="ddd DD-MM-YYYY"
        value={end}
        onChange={(v) => {
          setEnd(v.valueOf().toString());
        }}
      />
    </Stack>
  );
};

export default FormDateTimeField;
