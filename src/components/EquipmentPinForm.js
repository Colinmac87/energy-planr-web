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
import { WhereToVote, WrongLocation } from "@mui/icons-material";
import { TwitterPicker } from "react-color";
import {
  PIN_DEFAULT_COLOR,
  PIN_DEFAULT_SIZE,
  PIN_SIZE_HUGE,
  PIN_SIZE_LARGE,
  PIN_SIZE_MEDIUM,
  PIN_SIZE_SMALL,
  PIN_SIZE_TINY,
} from "../constants/map.constants";

const EquipmentPinForm = ({ data }) => {
  const { enqueueSnackbar } = useSnackbar();

  const { asset } = useSelector((state) => state.asset);

  const [isConfirmPinDialogOpen, setIsConfirmPinDialogOpen] = useState(false);

  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState(null);

  const [pinCoords, setPinCoords] = useState(data?.xPin?.coords);
  const [pinColor, setPinColor] = useState(
    data?.xPin?.color || PIN_DEFAULT_COLOR
  );
  const [pinSize, setPinSize] = useState(data?.xPin?.size || PIN_DEFAULT_SIZE);

  useEffect(() => {
    getLocations(asset.id).then((_locations) => {
      setLocations(_locations);

      if (data?.xPin?.locationId) {
        setLocation(_locations.find((l) => l.id == data?.xPin?.locationId));
      }
    });
  }, []);

  const handleSavePin = () => {
    updateDataPin(data.id, {
      coords: pinCoords,
      color: pinColor,
      size: pinSize,
      locationId: location.id,
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
            gap: 64,
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
          <Stack sx={{ flexDirection: "row", gap: 4 }}>
            <FormControl sx={{ width: 150 }}>
              <InputLabel>Size</InputLabel>
              <Select
                value={pinSize}
                label="Size"
                onChange={(e) => {
                  setPinSize(e.target.value);
                }}
              >
                <MenuItem value={PIN_SIZE_TINY}>Tiny</MenuItem>
                <MenuItem value={PIN_SIZE_SMALL}>Small</MenuItem>
                <MenuItem value={PIN_SIZE_MEDIUM}>Medium</MenuItem>
                <MenuItem value={PIN_SIZE_LARGE}>Large</MenuItem>
                <MenuItem value={PIN_SIZE_HUGE}>Huge</MenuItem>
              </Select>
            </FormControl>
            <TwitterPicker
              triangle="hide"
              color={pinColor}
              onChangeComplete={(color) => setPinColor(color.hex)}
              colors={["#FCB900", "#00D084", PIN_DEFAULT_COLOR]}
            />
            <Button
              disabled={pinCoords == null}
              variant="outlined"
              startIcon={<WrongLocation />}
              onClick={() => {
                setPinCoords(null);
              }}
            >
              Clear
            </Button>
            <Button
              disabled={pinCoords == null}
              variant="contained"
              startIcon={<WhereToVote />}
              onClick={() => {
                setIsConfirmPinDialogOpen(true);
              }}
            >
              Save
            </Button>
          </Stack>
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
              data={[
                {
                  ...data,
                  xPin: {
                    coords: pinCoords,
                    color: pinColor,
                    size: pinSize,
                  },
                },
              ]}
              mode={pinCoords == null ? "pin" : "view"}
              onPinPlacement={(coords) => {
                setPinCoords(coords);
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
