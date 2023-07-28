import { Delete, Save } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  createRegister,
  deleteRegister,
  setDefaultRegister,
  updateRegister,
} from "../services/register.service";
import { removeSpecialCharacters } from "../utils/string.utils";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";

const RegistersManager = ({ onSave }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { asset, registers: _registers } = useSelector((state) => state.asset);

  const [isRegisterDeleteDialogOpen, setIsRegisterDeleteDialogOpen] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [contextRegister, setContextRegister] = useState(null);
  const [registers, setRegisters] = useState([]);

  useEffect(() => {
    setRegisters(_registers);
  }, [_registers]);

  const onChangeRegisterProperty = (index, prop, value) => {
    let registersCopy = JSON.parse(JSON.stringify(registers));

    if (prop == "isDefault") {
      registersCopy = registersCopy.map((r) => ({
        ...r,
        isDefault: false,
      }));
    }

    registersCopy[index][prop] = value;
    setRegisters(registersCopy);
  };

  const addRegister = () => {
    setRegisters([
      ...registers,
      {
        name: "",
        isDefault: false,
      },
    ]);
  };

  const onCloseRegisterDeleteDialogOpen = () => {
    setContextRegister(null);
    setIsRegisterDeleteDialogOpen(false);
  };

  const onToggleDefaultRegister = (defaultRegisterId) => {
    setDefaultRegister(
      defaultRegisterId,
      registers.map((r) => r.id).filter((rId) => rId != defaultRegisterId)
    ).then(() => onSave());
  };

  const onSaveRegister = (index) => {
    try {
      setLoading(true);

      const register = registers[index];

      register.name = removeSpecialCharacters(register.name);
      if (register.name == "") {
        enqueueSnackbar("Please enter a valid register name", {
          variant: "error",
        });
        return;
      }

      if (
        registers.find((r) => r.id != register.id && r.name == register.name)
      ) {
        enqueueSnackbar(
          "Another register with a same name already exist, please use a different one",
          { variant: "error" }
        );
        return;
      }
      if (register.id) {
        updateRegister(register.id, {
          name: register.name,
        })
          .then(() => {
            enqueueSnackbar("Changes saved.", { variant: "success" });
            onSave();
          })
          .finally(() => setLoading(false));
      } else {
        createRegister({
          assetId: asset.id,
          name: register.name,
          isDefault: register.isDefault,
        })
          .then(() => {
            enqueueSnackbar("Changes saved.", { variant: "success" });
            onSave();
          })
          .finally(() => setLoading(false));
      }
    } catch (error) {
      enqueueSnackbar(
        "Unable to save changes, please try again or contact us.",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  const onDeleteRegister = () => {
    try {
      setLoading(true);
      deleteRegister(contextRegister.id)
        .then(() => {
          onSave();
          enqueueSnackbar("Register deleted.", { variant: "success" });
        })
        .catch((error) => {
          enqueueSnackbar(
            "Unable to delete location, please try again or contact us",
            { variant: "error" }
          );
        })
        .finally(() => {
          onCloseRegisterDeleteDialogOpen();
          setLoading(false);
        });
    } catch (error) {}
  };

  return (
    <Grid
      container
      rowGap={4}
      sx={{
        alignContent: "flex-start",
      }}
    >
      <Grid item md={8}>
        <Typography variant="h4">Registers</Typography>
      </Grid>
      <Grid item md={4} textAlign={"right"}>
        <Button variant="contained" onClick={addRegister}>
          New Register
        </Button>
      </Grid>
      {registers.map((register, i) => {
        const isValid =
          register.name.length == 0 ||
          removeSpecialCharacters(register.name).length > 0;

        return (
          <Grid item md={12} textAlign={"right"}>
            <Paper
              sx={{
                display: "flex",
                flexDirection: "row",
                p: 2,
                justifyContent: "space-between",
              }}
            >
              <Stack
                sx={{
                  flex: 2,
                  flexDirection: "row",
                  gap: 2,
                }}
              >
                <TextField
                  error={!isValid}
                  autoFocus
                  label="Register Name"
                  sx={{ width: "50%" }}
                  value={register.name}
                  onChange={(e) => {
                    onChangeRegisterProperty(i, "name", e.target.value);
                  }}
                  helperText={
                    !isValid &&
                    "Register name should only contain alphabets or numbers"
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={register.isDefault}
                      onChange={(e) => {
                        onChangeRegisterProperty(
                          i,
                          "isDefault",
                          e.target.checked
                        );
                        onToggleDefaultRegister(register.id);
                      }}
                    />
                  }
                  label="Default"
                />
              </Stack>
              <Stack
                direction="row"
                gap={4}
                sx={{ flex: 1, justifyContent: "flex-end" }}
              >
                <IconButton
                  edge="end"
                  aria-label="save"
                  disabled={loading || !isValid}
                  onClick={() => {
                    onSaveRegister(i);
                  }}
                >
                  <Save />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  disabled={loading}
                  onClick={() => {
                    setContextRegister(register);
                    setIsRegisterDeleteDialogOpen(true);
                  }}
                >
                  <Delete />
                </IconButton>
              </Stack>
            </Paper>
          </Grid>
        );
      })}

      <Dialog
        open={isRegisterDeleteDialogOpen}
        onClose={onCloseRegisterDeleteDialogOpen}
      >
        <DialogTitle>
          Are you sure you want to delete this register?
        </DialogTitle>
        <DialogContent>
          <Typography>All associated data will also be removed.</Typography>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={onCloseRegisterDeleteDialogOpen}>
            Cancel
          </Button>
          <LoadingButton
            loading={loading}
            onClick={onDeleteRegister}
            color="error"
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default RegistersManager;
