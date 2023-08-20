import { ArrowDownward, ArrowUpward, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import LocationForm from "./LocationForm";
import { useEffect, useState } from "react";
import {
  deleteLocation,
  getLocations,
  updateLocationsOrder,
} from "../services/location.service";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

const LocationsManager = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { asset } = useSelector((state) => state.asset);

  const [isLocationFormOpen, setIsLocationFormOpen] = useState(false);
  const [isLocationDeleteDialogOpen, setIsLocationDeleteDialogOpen] =
    useState(false);
  const [locations, setLocations] = useState([]);
  const [contextLocation, setContextLocation] = useState(null);
  const [locationsOrderDirty, setLocationsOrderDirty] = useState(false);

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    if (locationsOrderDirty) {
      updateLocationsOrder(locations.map((location) => location.id));
      setLocationsOrderDirty(false);
    }
  }, [locationsOrderDirty]);

  const loadLocations = () => {
    getLocations(asset.id).then((data) =>
      setLocations(data?.sort((l1, l2) => l1.order - l2.order))
    );
  };

  const handleDeleteLocation = () => {
    deleteLocation(contextLocation.id)
      .then(() => {
        loadLocations();
        enqueueSnackbar("Location deleted", { variant: "success" });
        onCloseLocationDeleteDialogOpen();
      })
      .catch(() => {
        enqueueSnackbar(
          "Unable to delete location, please try again or contact us",
          { variant: "error" }
        );
        onCloseLocationDeleteDialogOpen();
      });
  };

  const onCloseLocationForm = () => {
    setContextLocation(null);
    setIsLocationFormOpen(false);
  };

  const onCloseLocationDeleteDialogOpen = () => {
    setContextLocation(null);
    setIsLocationDeleteDialogOpen(false);
  };

  const moveUp = (index) => {
    const locationsCopy = JSON.parse(JSON.stringify(locations));
    const locationObject = locationsCopy[index];

    locationsCopy[index] = locationsCopy[index - 1];
    locationsCopy[index - 1] = locationObject;

    setLocations(locationsCopy);
    setLocationsOrderDirty(true);
  };

  const moveDown = (index) => {
    const locationsCopy = JSON.parse(JSON.stringify(locations));
    const locationObject = locationsCopy[index];

    locationsCopy[index] = locationsCopy[index + 1];
    locationsCopy[index + 1] = locationObject;

    setLocations(locationsCopy);
    setLocationsOrderDirty(true);
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
        <Typography variant="h4">Locations</Typography>
      </Grid>
      <Grid item md={4} textAlign={"right"}>
        <Button
          variant="contained"
          onClick={() => {
            setIsLocationFormOpen(true);
          }}
        >
          New Location
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
            }}
          >
            {locations.map((location, i) => (
              <>
                {i > 0 && <Divider />}
                <ListItem
                  className="locationListItem"
                  secondaryAction={
                    <Stack direction="row" gap={4}>
                      <Stack direction="row" gap={2}>
                        {i > 0 && (
                          <IconButton
                            className="locationListItem-sortButton"
                            onClick={() => moveUp(i)}
                          >
                            <ArrowUpward fontSize="small" />
                          </IconButton>
                        )}
                        {i < locations.length - 1 && (
                          <IconButton
                            className="locationListItem-sortButton"
                            onClick={() => moveDown(i)}
                          >
                            <ArrowDownward fontSize="small" />
                          </IconButton>
                        )}
                      </Stack>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => {
                          setContextLocation(location);
                          setIsLocationFormOpen(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => {
                          setContextLocation(location);
                          setIsLocationDeleteDialogOpen(true);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  }
                >
                  <ListItemText primary={location.name} secondary="-" />
                </ListItem>
              </>
            ))}
          </List>
        </Box>
      </Grid>

      <Drawer
        anchor={"right"}
        open={isLocationFormOpen}
        onClose={onCloseLocationForm}
      >
        <Box
          sx={{
            width: 440,
            flex: 1,
            height: "100%",
            backgroundColor: theme.palette.background.paper,
            p: 2,
          }}
        >
          <LocationForm
            assetId={asset.id}
            location={contextLocation}
            onSaving={() => {}}
            onSave={() => {
              onCloseLocationForm();
              loadLocations();
            }}
            onCancel={onCloseLocationForm}
          />
        </Box>
      </Drawer>

      <Dialog
        open={isLocationDeleteDialogOpen}
        onClose={onCloseLocationDeleteDialogOpen}
      >
        <DialogTitle>
          Are you sure you want to delete this location?
        </DialogTitle>
        <DialogActions>
          <Button onClick={onCloseLocationDeleteDialogOpen}>Cancel</Button>
          <Button onClick={handleDeleteLocation} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default LocationsManager;
