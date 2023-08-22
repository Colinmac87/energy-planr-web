import { Stack, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { useEffect, useState } from "react";

const FormDateTimeField = ({ field, value, onChange }) => {
  let firstPart = moment().valueOf().toString(),
    secondPart = moment().valueOf().toString();
  try {
    [firstPart, secondPart] = value.split(",");
  } catch (error) {}

  const [startDate, setStartDate] = useState(parseInt(firstPart));
  const [endDate, setEndDate] = useState(parseInt(secondPart));

  useEffect(() => {
    onChange(`${startDate},${endDate}`);
  }, [startDate, endDate]);

  return (
    <Stack flexDirection={"row"} gap={2} alignItems={"center"}>
      <Stack sx={{ flex: 1 }}>
        <Typography variant="overline" sx={{ display: "block", lineHeight: 2 }}>
          {field.meta?.startLabel}
        </Typography>
        <DatePicker
          sx={{
            width: "100%",
            border: field.required && !value && "1px solid #f00 !important",
          }}
          format="DD-MM-YYYY"
          value={moment(startDate)}
          onChange={(v) => {
            setStartDate(v.valueOf());
          }}
        />
      </Stack>
      <p>-</p>
      <Stack sx={{ flex: 1 }}>
        <Typography variant="overline" sx={{ display: "block", lineHeight: 2 }}>
          {field.meta?.endLabel}
        </Typography>
        <DatePicker
          sx={{
            width: "100%",
            border: field.required && !value && "1px solid #f00 !important",
          }}
          format="DD-MM-YYYY"
          value={moment(endDate)}
          onChange={(v) => {
            setEndDate(v.valueOf());
          }}
        />
      </Stack>
    </Stack>
  );
};

export default FormDateTimeField;
