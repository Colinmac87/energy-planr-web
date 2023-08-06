import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getLocations } from "../services/location.service";
import { useSelector } from "react-redux";
import MapView from "./MapView";
import { LoadingButton } from "@mui/lab";
import { updateDataPin } from "../services/data.service";
import { useSnackbar } from "notistack";
import { WrongLocation } from "@mui/icons-material";

const EquipmentPinForm = ({ data }) => {
  const { enqueueSnackbar } = useSnackbar();

  const { asset } = useSelector((state) => state.asset);

  const [isConfirmPinDialogOpen, setIsConfirmPinDialogOpen] = useState(false);

  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState(data?.xPin?.location || null);

  const [pin, setPin] = useState(data?.xPin || null);

  useEffect(() => {
    getLocations(asset.id).then((_locations) => {
      setLocations(_locations);
    });
  }, []);

  const handleSavePin = () => {
    updateDataPin(FormData.dataId, {
      ...pin,
      location: location,
    }).then(() => {
      enqueueSnackbar("Changes saved", { variant: "success" });
      setIsConfirmPinDialogOpen(false);
    });
  };

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flex: 1,
        flexGrow: 1,
        flexDirection: "column",
        height: 768,
        m: 0,
        p: 1,
        overflow: "hidden",
      }}
    >
      <Stack sx={{ flex: 1, width: "100%", height: "100%" }}>
        <Stack
          sx={{
            flexDirection: "row",
            gap: 128,
          }}
        >
          <FormControl fullWidth sx={{ flex: 1 }}>
            <InputLabel>Location</InputLabel>
            <Select
              value={location}
              label="Location"
              onChange={(e) => {
                setLocation(null);
                setTimeout(() => setLocation(e.target.value), 50);
              }}
            >
              {locations.map((l) => (
                <MenuItem value={l}>{l.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            disabled={pin == null}
            variant="outlined"
            startIcon={<WrongLocation />}
            onClick={() => {
              setPin(null);
            }}
          >
            Clear Pin
          </Button>
        </Stack>
        <Paper
          sx={{
            mt: 2,
            flex: 1,
            backgroundColor: "eee2",
            minHeight: "100%",
            minWidth: "100%",
            overflow: "hidden",
          }}
        >
          {location && (
            <MapView
              image={location.backgroundMapUrl}
              arePinsVisible={false}
              data={[data]}
              mode={pin == null ? "pin" : "view"}
              onPinPlacement={(x, y) => {
                setPin({
                  x: x,
                  y: y,
                });
              }}
            />
          )}
        </Paper>

        <Dialog
          open={isConfirmPinDialogOpen}
          onClose={() => setIsConfirmPinDialogOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Place Pin?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please confirm the placement of the pin, previous pin location
              will be overwritten.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={() => setIsConfirmPinDialogOpen(false)}
            >
              Cancel
            </Button>
            <LoadingButton variant="outlined" onClick={handleSavePin}>
              Save
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
};

export default EquipmentPinForm;
