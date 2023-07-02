import { Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const DateRangeBuilderOptions = ({ meta, onChangeMeta }) => {
  const [startLabel, setStartLabel] = useState(meta?.startLabel);
  const [endLabel, setEndLabel] = useState(meta?.endLabel);

  useEffect(() => {
    onChangeMeta({
      startLabel,
      endLabel,
    });
  }, [startLabel, endLabel]);

  return (
    <Stack sx={{ flexDirection: "row", gap: 2 }}>
      <TextField
        fullWidth
        label="Start Label"
        value={startLabel}
        onChange={(e) => setStartLabel(e.target.value)}
      />
      <TextField
        fullWidth
        label="End Label"
        value={endLabel}
        onChange={(e) => setEndLabel(e.target.value)}
      />
    </Stack>
  );
};

export default DateRangeBuilderOptions;
