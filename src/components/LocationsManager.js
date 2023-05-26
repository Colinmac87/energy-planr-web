import { Delete, Edit } from "@mui/icons-material";
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
} from "@mui/material";
import LocationForm from "./LocationForm";
import { useEffect, useState } from "react";
import { deleteLocation, getLocations } from "../services/location.service";
import { alertInfo } from "../utils/alert.utils";
import { useSelector } from "react-redux";

const LocationsManager = () => {
  const { asset } = useSelector((state) => state.asset);

  const [isLocationFormOpen, setIsLocationFormOpen] = useState(false);
  const [isLocationDeleteDialogOpen, setIsLocationDeleteDialogOpen] =
    useState(false);
  const [locations, setLocations] = useState([]);
  const [contextLocation, setContextLocation] = useState(null);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = () => {
    getLocations(asset.id).then((data) => setLocations(data));
  };

  const handleDeleteLocation = () => {
    deleteLocation(contextLocation.id)
      .then(() => {
        loadLocations();
        alertInfo("Location deleted.");
        onCloseLocationDeleteDialogOpen();
      })
      .catch(() => {
        alertInfo("Unable to delete location, please try again or contact us");
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

  return (
    <Grid container>
      <Grid item md={8}>
        <Typography variant="h4">Locations</Typography>
      </Grid>
      <Grid item md={4} textAlign={"right"}>
        <Button variant="contained" onClick={() => setIsLocationFormOpen(true)}>
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
                  secondaryAction={
                    <Stack direction="row" gap={4}>
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
        <Box sx={{ p: 4 }}>
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
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default LocationsManager;
