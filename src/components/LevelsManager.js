import { Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
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
import LevelForm from "./LevelForm";
import { useState } from "react";

const LevelsManager = () => {
  const [isNewLevelFormOpen, setIsNewLevelFormOpen] = useState(false);

  const onCloseNewLevelForm = () => {
    setIsNewLevelFormOpen(false);
  };

  return (
    <Grid container>
      <Grid item md={8}>
        <Typography variant="h4">Site Levels</Typography>
      </Grid>
      <Grid item md={4} textAlign={"right"}>
        <Button variant="contained" onClick={() => setIsNewLevelFormOpen(true)}>
          New Level
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
              <ListItemText
                primary="Mezz Floor"
                secondary="contains 3 assets"
              />
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
              <ListItemText primary="Ground" secondary="contains 3 assets" />
            </ListItem>
          </List>
        </Box>
      </Grid>

      <Drawer
        anchor={"right"}
        open={isNewLevelFormOpen}
        onClose={onCloseNewLevelForm}
      >
        <Box sx={{ p: 4 }}>
          <LevelForm />
        </Box>
      </Drawer>
    </Grid>
  );
};

export default LevelsManager;
