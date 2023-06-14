import { Clear, PlaylistAdd } from "@mui/icons-material";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { generateId } from "../../utils/string.utils";

const CheckboxesBuilderOptions = ({ meta, onChangeMeta }) => {
  const [orientation, setOrientation] = useState(
    meta?.orientation || "vertical"
  );
  const [options, setOptions] = useState(meta?.options || []);
  const [newOption, setNewOption] = useState("");

  useEffect(() => {
    onChangeMeta({ orientation: orientation, options: options });
  }, [orientation, options]);

  const edit = (key, value) => {
    const optionsCopy = JSON.parse(JSON.stringify(options));
    const index = optionsCopy.findIndex((o) => o.key == key);
    optionsCopy[index]["text"] = value;
    setOptions(optionsCopy);
  };

  const add = () => {
    setOptions([
      ...options,
      {
        key: generateId(),
        text: newOption,
        isDeleted: false,
      },
    ]);
    setNewOption("");
  };

  const remove = (key) => {
    const optionsCopy = JSON.parse(JSON.stringify(options));
    const index = optionsCopy.findIndex((o) => o.key == key);
    optionsCopy[index].isDeleted = true;
    setOptions(optionsCopy);
  };

  return (
    <Stack gap={2}>
      <FormControl fullWidth>
        <InputLabel>Orientation</InputLabel>
        <Select
          value={orientation}
          label="Orientation"
          onChange={(e) => setOrientation(e.target.value)}
        >
          <MenuItem value={"vertical"}>Vertical</MenuItem>
          <MenuItem value={"horizontal"}>Horizontal</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="subtitle2">Checkbox Options</Typography>
      {options
        .filter((option) => !option.isDeleted)
        .map((option) => (
          <Stack key={option.key} flexDirection={"row"} gap={2}>
            <TextField
              sx={{ width: "50%" }}
              value={option.text}
              onChange={(e) => edit(option.key, e.target.value)}
            />
            <IconButton
              aria-label="move down"
              onClick={() => remove(option.key)}
            >
              <Clear />
            </IconButton>
          </Stack>
        ))}
      <Stack flexDirection={"row"} gap={2}>
        <TextField
          sx={{ width: "50%" }}
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
        />
        <Button
          variant="outlined"
          onClick={() => add()}
          startIcon={<PlaylistAdd />}
        >
          Add
        </Button>
      </Stack>
    </Stack>
  );
};

export default CheckboxesBuilderOptions;
