import {
  Alert,
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  useTheme,
} from "@mui/material";
import React, { createRef, useEffect, useRef, useState } from "react";
import { MapComponent, useOL } from "react-ol-fiber";
import { getCenter } from "ol/extent";
import Projection from "ol/proj/Projection";
import "ol/ol.css";
import {
  Add,
  Circle,
  CircleOutlined,
  Polyline,
  RectangleOutlined,
  Remove,
} from "@mui/icons-material";
import { Draw } from "ol/interaction";

const extent = [0, 0, 1024, 968];
const attributions = '© <a href="http://xkcd.com/license.html">xkcd</a>';
const projection = new Projection({
  code: "xkcd-image",
  units: "pixels",
  extent,
});

const DrawingLayer = ({ drawType }) => {
  const { map } = useOL();
  const [draw, setDraw] = useState();
  const vectorSource = createRef();

  useEffect(() => {
    console.log("draw type", drawType);
    if (drawType) addDraw();
    else map.removeInteraction(draw);
  }, [drawType]);

  const addDraw = () => {
    const _draw = new Draw({
      source: vectorSource.current,
      type: drawType,
    });

    // draw.current = new Draw({
    //   source: vectorSource.current,
    //   type: drawType,
    // });
    // draw.current= _draw;

    map.addInteraction(_draw);
    setDraw(_draw);
  };

  return (
    <vectorLayer>
      <vectorSource ref={vectorSource}></vectorSource>
    </vectorLayer>
  );
};

const MapView = ({
  image,
  data,
  arePinsVisible,
  mode = "view", // view || pin
  onPinPlacement,
}) => {
  const theme = useTheme();

  const mapRef = useRef();
  const vectorSource = useRef();
  const draw = useRef();

  const [drawType, setDrawType] = useState("Circle");
  const [canDragPan, setCanDragPan] = useState(true);

  const [markerImage] = useState(() => {
    const _image = new Image();
    _image.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC";
    return _image;
  });

  // useEffect(() => {
  //   setTimeout(() => {
  //     mapRef.current.render();
  //   }, 500);
  // }, [drawType]);

  const initMap = () => {
    // addDraw();
  };

  const removeDraw = () => {
    setDrawType(null);
    // map.current.removeInteraction(draw.current);
    // draw.current = null;
  };

  const handleMapClick = (coords) => {
    if (mode == "pin") {
      onPinPlacement({
        x: coords.x,
        y: coords.y,
      });
    }
  };

  const renderStateInfo = () => {
    if (!drawType) return null;

    return (
      <Alert
        severity="info"
        // onClose={() => alert("lol")}
        action={
          <Button color="inherit" size="small" onClick={removeDraw}>
            Cancel
          </Button>
        }
      >
        Drawing {drawType}, {canDragPan.toString()}
      </Alert>
    );
  };

  if (!image) return null;

  return (
    <Box
      sx={{
        position: "relative",
        minWidth: "100%",
        maxWidth: "100%",
        minHeight: "100%",
        maxHeight: "100%",
        height: "100%",
        width: "100%",
        backgroundColor: "#DFDEDD",
      }}
    >
      <MapComponent
        ref={mapRef}
        onChange={(e) => console.log("map changed", e.target.interactions)}
        view={{
          projection: projection,
          zoom: 2,
          maxZoom: 8,
          center: getCenter(extent),
        }}
      >
        {/* <olView
            projection: projection,
          arg={{
          }}
          zoom={2}
          maxZoom={8}
          center={getCenter(extent)}
        /> */}

        <imageLayer>
          <imageStaticSource
            arg={{
              attributions: attributions,
              url: image,
              projection: projection,
              imageExtent: extent,
            }}
            onError={(e) => console.log("error", e)}
            onImageloaderror={(e) => console.log("error", e)}
            onImageloadend={(e) => {
              initMap();
            }}
          />
        </imageLayer>

        <vectorLayer>
          <vectorSource ref={vectorSource}></vectorSource>
        </vectorLayer>

        {drawType && (
          <drawInteraction
            arg={{ type: drawType, source: vectorSource.current }}
            onDrawend={(e) => console.log(e)}
            attachAdd="interaction"
          />
        )}
        <dragPanInteraction active={canDragPan} />
        <mouseWheelZoomInteraction />
      </MapComponent>

      {/* Status bar */}
      {
        <Box
          sx={{
            gap: 1,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {renderStateInfo()}
        </Box>
      }

      {/* Interaction controls */}
      <Stack
        sx={{
          flexDirection: "column",
          gap: 1,
          position: "absolute",
          right: 12,
          bottom: 12,
        }}
      >
        <Tooltip title="Zoom in" placement="left">
          <IconButton
            size="small"
            variant="contained"
            sx={{
              bgcolor: theme.palette.background.default,
              borderRadius: theme.shape.borderRadius,
            }}
            onClick={() => {
              try {
                const view = mapRef.current.getView();
                view.setZoom(view.getZoom() + 0.5);
              } catch (error) {
                console.log("zoom-in", error);
              }
            }}
          >
            <Add />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom out" placement="left">
          <IconButton
            size="small"
            variant="contained"
            sx={{
              bgcolor: theme.palette.background.default,
              borderRadius: theme.shape.borderRadius,
            }}
            onClick={() => {
              try {
                const view = mapRef.current.getView();
                view.setZoom(view.getZoom() - 0.5);
              } catch (error) {
                console.log("zoom-in", error);
              }
            }}
          >
            <Remove />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Draw features */}
      <Stack
        sx={{
          flexDirection: "column",
          gap: 1,
          position: "absolute",
          left: 12,
          bottom: 12,
        }}
      >
        <Tooltip title="Circle" placement="right">
          <IconButton
            size="small"
            variant="contained"
            sx={{
              bgcolor: theme.palette.background.default,
              borderRadius: theme.shape.borderRadius,
            }}
            onClick={() => {
              try {
                // addDraw("Circle");
                // setDrawType("Circle");
                setCanDragPan(!canDragPan);
              } catch (error) {
                console.log("circle", error);
              }
            }}
          >
            <CircleOutlined />
          </IconButton>
        </Tooltip>
        <Tooltip title="Polygon" placement="right">
          <IconButton
            size="small"
            variant="contained"
            sx={{
              bgcolor: theme.palette.background.default,
              borderRadius: theme.shape.borderRadius,
            }}
            onClick={() => {
              try {
                // addDraw("Polygon");
                setDrawType("Polygon");
              } catch (error) {
                console.log("polygon", error);
              }
            }}
          >
            <Polyline />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default MapView;
