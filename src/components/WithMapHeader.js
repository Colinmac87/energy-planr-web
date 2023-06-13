import { AppBar, Box, Button, Stack, Toolbar, Typography } from "@mui/material";
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
    <Box
      sx={{
        display: "flex",
        flex: 1,
        position: "relative",
        flexDirection: "column",
        backgroundColor: "#eee2",
        minHeight: "100%",
        minWidth: "100%",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <AppBar
        sx={{
          position: "absolute",
          borderRadius: 2,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Headquarter Site / Mezz Floor
          </Typography>
          <Button
            key="btnTooglePinsVisibilitiy"
            onClick={onTogglePinsVisibility}
            size="small"
            variant="contained"
            sx={{ ml: 2, backgroundColor: "black", color: "white" }}
          >
            {arePinsVisible ? <Visibility /> : <VisibilityOff />}
          </Button>
          <Button
            key="btnMapDownload"
            size="small"
            variant="contained"
            sx={{ ml: 2, backgroundColor: "black", color: "white" }}
          >
            <Download />
          </Button>
          <Button
            key="btnMapFullScreenToggle"
            onClick={onToggleFullscreen}
            size="small"
            variant="contained"
            sx={{ ml: 2, backgroundColor: "black", color: "white" }}
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
    </Box>
  );
};

export default WithMapHeader;
