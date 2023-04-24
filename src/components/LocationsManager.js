import { Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

const LocationsManager = () => {
  return (
    <Grid container>
      <Grid item md={8}>
        <Typography variant="h4">Site Locations</Typography>
      </Grid>
      <Grid item md={4} textAlign={"right"}>
        <Button variant="contained">New Location</Button>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
            }}
          >
            <ListItem
              secondaryAction={
                <Stack direction="row" spacing={2}>
                  <IconButton edge="end" aria-label="edit">
                    <Edit />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete">
                    <Delete />
                  </IconButton>
                </Stack>
              }
            >
              <ListItemText primary="Location 1" secondary="has 3 levels" />
            </ListItem>
            <Divider />
            <ListItem
              secondaryAction={
                <Stack direction="row" spacing={2}>
                  <IconButton edge="end" aria-label="edit">
                    <Edit />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete">
                    <Delete />
                  </IconButton>
                </Stack>
              }
            >
              <ListItemText primary="Location 2" secondary="has 2 levels" />
            </ListItem>
          </List>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LocationsManager;
