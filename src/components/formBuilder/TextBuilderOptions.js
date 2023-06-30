import { Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const TextBuilderOptions = ({ meta, onChangeMeta }) => {
  const [startAdornment, setStartAdornment] = useState(meta?.startAdornment);
  const [endAdornment, setEndAdornment] = useState(meta?.endAdornment);

  useEffect(() => {
    onChangeMeta({ startAdornment, endAdornment });
  }, [startAdornment, endAdornment]);

  return (
    <Stack sx={{ flexDirection: "row", flex: 1, gap: 4 }}>
      <TextField
        fullWidth
        label="Adornment - Before"
        value={startAdornment}
        onChange={(e) => setStartAdornment(e.target.value)}
      />
      <TextField
        fullWidth
        label="Adornment - After"
        value={endAdornment}
        onChange={(e) => setEndAdornment(e.target.value)}
      />
    </Stack>
  );
};

export default TextBuilderOptions;
