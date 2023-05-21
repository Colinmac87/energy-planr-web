import {
  ArrowDownward,
  ArrowUpward,
  CloudDone,
  CloudOff,
  Delete,
} from "@mui/icons-material";
import {
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { saveFormGroups } from "../services/asset.service";
import { alertError, alertSuccess } from "../utils/alert.utils";

const FormGroupsManager = ({ asset, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    setGroups(asset?.formGroups.sort((a, b) => b - a) || []);
  }, [asset]);

  const onChangeGroupProperty = (index, property, value) => {
    const groupsCopy = JSON.parse(JSON.stringify(groups));
    groupsCopy[index][property] = value;
    setGroups(groupsCopy);
  };

  const moveUp = (index) => {
    const groupsCopy = JSON.parse(JSON.stringify(groups));
    const groupObject = groupsCopy[index];

    groupsCopy[index] = groupsCopy[index - 1];
    groupsCopy[index - 1] = groupObject;

    setGroups(groupsCopy);
  };

  const moveDown = (index) => {
    const groupsCopy = JSON.parse(JSON.stringify(groups));
    const groupObject = groupsCopy[index];

    groupsCopy[index] = groupsCopy[index + 1];
    groupsCopy[index + 1] = groupObject;

    setGroups(groupsCopy);
  };

  const remove = (index) => {
    const groupsCopy = JSON.parse(JSON.stringify(groups));
    groupsCopy.splice(index, 1);
    setGroups(groupsCopy);
  };

  const handleSave = () => {
    setLoading(true);

    saveFormGroups(asset.id, { formGroups: groups })
      .then(() => {
        alertSuccess("Changes saved.");
        onSave();
      })
      .catch(() => {
        alertError("Unable to save changes, please try again or contact us.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Grid container rowGap={4}>
      <Grid item xs={12}>
        <Stack flexDirection={"row"} gap={2} justifyContent={"space-between"}>
          <Typography variant="h4">Data Groups</Typography>
          <Button variant="contained" disabled={loading} onClick={handleSave}>
            Save
          </Button>
        </Stack>
      </Grid>
      {groups.map((group, i) => (
        <Grid item xs={12}>
          <Paper sx={{ p: 2, pt: 3, mb: 2 }}>
            <Stack
              flexDirection={"row"}
              gap={4}
              mb={4}
              justifyContent={"space-between"}
            >
              {group.key ? <CloudDone /> : <CloudOff />}
              <Stack flexDirection={"row"} gap={4} justifyContent={"flex-end"}>
                {i > 0 && (
                  <IconButton aria-label="move up" onClick={() => moveUp(i)}>
                    <ArrowUpward />
                  </IconButton>
                )}
                {i < groups.length - 1 && (
                  <IconButton
                    aria-label="move down"
                    onClick={() => moveDown(i)}
                  >
                    <ArrowDownward />
                  </IconButton>
                )}
                <IconButton aria-label="delete" onClick={() => remove(i)}>
                  <Delete />
                </IconButton>
              </Stack>
            </Stack>
            <Stack gap={2}>
              <TextField
                label={"Group Name"}
                fullWidth
                value={group.name}
                onChange={(e) => {
                  onChangeGroupProperty(i, "name", e.target.value);
                }}
              />
            </Stack>
          </Paper>
        </Grid>
      ))}

      <Grid item md={12} textAlign={"center"}>
        <Button variant="contained" onClick={() => setGroups([...groups, {}])}>
          New Group
        </Button>
      </Grid>
    </Grid>
  );
};

export default FormGroupsManager;
