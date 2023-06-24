import {
  Add,
  ArrowDownward,
  ArrowUpward,
  CloudDone,
  CloudOff,
  Delete,
  Save,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { saveFormGroups } from "../services/register.service";
import { alertError, alertSuccess } from "../utils/alert.utils";
import { LoadingButton } from "@mui/lab";
import { useSelector } from "react-redux";

const FormGroupsManager = ({ register, onChangeRegister, onSave }) => {
  const { registers } = useSelector((state) => state.asset);

  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (register) {
      setGroups(register?.formGroups || []);
    }
  }, [register]);

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

  const removeGroup = (index) => {
    const groupsCopy = JSON.parse(JSON.stringify(groups));
    groupsCopy.splice(index, 1);
    setGroups(groupsCopy);
  };

  const addGroup = () => {
    setGroups([...groups, { name: "" }]);
  };

  const handleSave = () => {
    setLoading(true);

    saveFormGroups(register.id, { formGroups: groups })
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
    <Paper
      sx={{
        display: "flex",
        flex: 1,
        flexGrow: 1,
        m: 0,
        p: 0,
        pb: 8,
        overflow: "hidden",
        position: "relative",
        borderRadius: 2,
      }}
    >
      <AppBar
        sx={{
          position: "absolute",
          borderRadius: 2,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <Toolbar>
          <Stack
            sx={{
              flexGrow: 2,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" component="div">
              Groups
            </Typography>
            <FormControl fullWidth sx={{ m: 2 }}>
              <InputLabel>Register</InputLabel>
              <Select
                value={register}
                label="Register"
                onChange={(e) => onChangeRegister(e.target.value)}
              >
                {registers.map((r) => (
                  <MenuItem value={r}>{r.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack
            flexDirection={"row"}
            gap={2}
            flexGrow={1}
            justifyContent={"flex-end"}
          >
            <Button variant="outlined" startIcon={<Add />} onClick={addGroup}>
              New Group
            </Button>

            <LoadingButton
              variant="contained"
              loading={loading}
              onClick={handleSave}
              startIcon={<Save />}
            >
              Save
            </LoadingButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          position: "relative",
          flexDirection: "column",
          backgroundColor: "#eee2",
          minHeight: "100%",
          minWidth: "100%",
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
          overflow: "auto",
          mt: 11,
          p: 2,
          pb: 3,
        }}
      >
        <Grid
          container
          rowGap={1}
          sx={{
            alignContent: "flex-start",
          }}
        >
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
                  <Stack
                    flexDirection={"row"}
                    gap={4}
                    justifyContent={"flex-end"}
                  >
                    {i > 0 && (
                      <IconButton
                        aria-label="move up"
                        onClick={() => moveUp(i)}
                      >
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
                    <IconButton
                      aria-label="delete"
                      onClick={() => removeGroup(i)}
                    >
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
        </Grid>
      </Box>
    </Paper>
  );
};

export default FormGroupsManager;
