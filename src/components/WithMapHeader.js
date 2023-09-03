import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Fullscreen, Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import WithMapOverlays from "./WithMapOverlays";

const WithMapHeader = ({ location, data, onToggleFullscreen }) => {
  const [arePinsVisible, setArePinsVisibile] = useState(true);

  const onTogglePinsVisibility = () => {
    setArePinsVisibile(!arePinsVisible);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        position: "relative",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        minHeight: "100%",
        minWidth: "100%",
        overflow: "hidden",
        pt: 8,
      }}
    >
      <AppBar
        sx={{
          position: "absolute",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {location?.name}
          </Typography>
          <Stack sx={{ flexDirection: "row", gap: 3 }}>
            <IconButton
              key="btnTooglePinsVisibilitiy"
              onClick={onTogglePinsVisibility}
              size="small"
            >
              {arePinsVisible ? <Visibility /> : <VisibilityOff />}
            </IconButton>
            <IconButton
              key="btnMapFullScreenToggle"
              onClick={onToggleFullscreen}
              size="small"
            >
              <Fullscreen />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <WithMapOverlays
        location={location}
        data={data}
        arePinsVisible={arePinsVisible}
      />
    </Box>
  );
};

export default WithMapHeader;
