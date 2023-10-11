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
  SpeedDial,
  SpeedDialAction,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getLocations } from "../services/location.service";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { updateDataPin } from "../services/data.service";
import { useSnackbar } from "notistack";
import {
  Draw,
  LocationOn,
  PinDrop,
  Save,
  WrongLocation,
} from "@mui/icons-material";
import {
  PIN_DEFAULT_COLOR,
  PIN_DEFAULT_SIZE,
  PIN_TYPE_POINT,
  PIN_TYPE_POLYGON,
} from "../constants/map.constants";
import WithMapAnnotations from "./WithMapAnnotations";

const EquipmentPinForm = ({ data }) => {
  const { enqueueSnackbar } = useSnackbar();

  const { asset } = useSelector((state) => state.asset);

  const [isConfirmPinDialogOpen, setIsConfirmPinDialogOpen] = useState(false);

  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState(null);

  const [pinType, setPinType] = useState(data?.xPin?.type || null);
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
      type: pinType,
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
      }}
    >
      <Stack sx={{ flex: 1, width: "100%", height: "100%", gap: 1 }}>
        <Stack
          sx={{
            flexDirection: "row",
          }}
        >
          <Stack sx={{ flex: 1 }}>
            {locations.length > 0 ? (
              <FormControl sx={{ width: "50%" }} size="small">
                <InputLabel>Location</InputLabel>
                <Select
                  autoFocus
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
            ) : (
              <Typography sx={{ flex: 1 }}>&nbsp;</Typography>
            )}
          </Stack>
        </Stack>
        <Paper
          sx={{
            position: "relative",
            flex: 1,
            backgroundColor: "eee2",
            minHeight: "100%",
            minWidth: "100%",
            overflow: "hidden",
          }}
        >
          {location && (
            <WithMapAnnotations
              location={location}
              data={[
                {
                  ...data,
                  xPin: {
                    type: pinType,
                    coords: pinCoords,
                    color: pinColor,
                    size: pinSize,
                  },
                },
              ]}
              areAnnotationsVisible={false}
              arePinsVisible={true}
              mode={pinType == null ? "null" : "pin"}
              onPinPlacement={(coords) => {
                // alert(coords);
                setPinCoords(coords);
              }}
            />
          )}
          <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: "absolute", bottom: 16, left: 16 }}
            icon={<PinDrop />}
          >
            <SpeedDialAction
              key={"Default Pin"}
              icon={<LocationOn />}
              tooltipTitle={"Default Pin"}
              onClick={() => {
                setPinCoords(null);
                setPinType(PIN_TYPE_POINT);
              }}
            />
            <SpeedDialAction
              key={"Custom Pin"}
              icon={<Draw />}
              tooltipTitle={"Custom Pin"}
              onClick={() => {
                setPinCoords(null);
                setPinType(PIN_TYPE_POLYGON);
              }}
            />
            <SpeedDialAction
              key={"Delete Pin"}
              icon={<WrongLocation />}
              tooltipTitle={"Delete Pin"}
              onClick={() => {
                setPinCoords(null);
                setPinType(null);
              }}
            />
            <SpeedDialAction
              key={"Save Pin"}
              icon={<Save />}
              tooltipTitle={"Save Pin"}
              onClick={() => {
                setIsConfirmPinDialogOpen(true);
              }}
            />
          </SpeedDial>
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
              variant="outlined"
              onClick={() => setIsConfirmPinDialogOpen(false)}
            >
              Cancel
            </Button>
            <LoadingButton variant="contained" onClick={handleSavePin}>
              Save
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
};

export default EquipmentPinForm;
