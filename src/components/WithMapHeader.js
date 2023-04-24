import { AppBar, Button, Stack, Toolbar, Typography } from "@mui/material";
import { dummyBackground } from "../constants";
import {
  Download,
  Fullscreen,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useState } from "react";
import MapView from "./MapView";

const WithMapHeader = ({ data, level, asset, onToggleFullscreen }) => {
  const [arePinsVisible, setArePinsVisibile] = useState(true);

  const onTogglePinsVisibility = () => {
    setArePinsVisibile(!arePinsVisible);
  };

  return (
    <Stack>
      <AppBar
        position="static"
        sx={{ borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Mezz Floor
          </Typography>
          <Button
            key="btnTooglePinsVisibilitiy"
            onClick={onTogglePinsVisibility}
            size="small"
            variant="contained"
            sx={{ ml: 2 }}
          >
            {arePinsVisible ? <Visibility /> : <VisibilityOff />}
          </Button>
          <Button
            key="btnMapDownload"
            size="small"
            variant="contained"
            sx={{ ml: 2 }}
          >
            <Download />
          </Button>
          <Button
            key="btnMapFullScreenToggle"
            onClick={onToggleFullscreen}
            size="small"
            variant="contained"
            sx={{ ml: 2 }}
          >
            <Fullscreen />
          </Button>
        </Toolbar>
      </AppBar>
      <MapView
        image={dummyBackground}
        data={data}
        arePinsVisible={arePinsVisible}
      />
    </Stack>
  );
};

export default WithMapHeader;
