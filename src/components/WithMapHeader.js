import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Fullscreen,
  Layers,
  LayersClear,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useState } from "react";
import WithMapAnnotations from "./WithMapAnnotations";

const WithMapHeader = ({ location, data, onToggleFullscreen }) => {
  const [arePinsVisible, setArePinsVisibile] = useState(true);
  const [areAnnotationsVisible, setAreAnnotationsVisibile] = useState(true);

  const onTogglePinsVisibility = () => {
    setArePinsVisibile(!arePinsVisible);
  };

  const onToggleAnnotationsVisibility = () => {
    setAreAnnotationsVisibile(!areAnnotationsVisible);
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
            <Tooltip title="Toggle annotations">
              <IconButton
                key="btnToogleAnnotationsVisibilitiy"
                onClick={onToggleAnnotationsVisibility}
                size="small"
              >
                {areAnnotationsVisible ? <Layers /> : <LayersClear />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Toggle pins">
              <IconButton
                key="btnTooglePinsVisibilitiy"
                onClick={onTogglePinsVisibility}
                size="small"
              >
                {arePinsVisible ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Toggle fullscreen">
              <IconButton
                key="btnMapFullScreenToggle"
                onClick={onToggleFullscreen}
                size="small"
              >
                <Fullscreen />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      <WithMapAnnotations
        location={location}
        data={data}
        areAnnotationsVisible={areAnnotationsVisible}
        arePinsVisible={arePinsVisible}
      />
    </Box>
  );
};

export default WithMapHeader;
