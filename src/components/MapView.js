import { Add, CircleOutlined, Polyline, Remove } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { getCenter } from "ol/extent";
import { Point, Polygon } from "ol/geom";
import { Projection, fromLonLat, get } from "ol/proj";
import React, { createRef, useEffect, useRef, useState } from "react";
import {
  RFeature,
  RInteraction,
  RLayerImage,
  RLayerVector,
  RMap,
  ROverlay,
  RPopup,
  RStyle,
} from "rlayers";

const MapView = ({
  image,
  data,
  arePinsVisible,
  mode = "view", // view || pin
  onPinPlacement,
}) => {
  const theme = useTheme();

  const extent = [0, 0, 1024, 968];
  const projection = new Projection({
    code: "xkcd-image",
    units: "pixels",
    extent: extent,
  });
  const center = getCenter(extent);

  const [drawType, setDrawType] = useState(null);

  const mapRef = useRef();

  // useEffect(() => {
  //   if (mode == "pin") setDrawType("Point");
  //   else setDrawType(null);
  // }, [mode]);

  const handlePointPlace = (coords) => {
    // if (mode == "pin") {
    onPinPlacement(coords);
    // }
  };

  const handleDraw = (coords) => {
    console.log("coords", {
      type: drawType,
      coords: JSON.stringify(coords),
    });
  };

  const addDraw = (_drawType) => {
    setDrawType(null);
    setTimeout(() => {
      setDrawType(_drawType);
    }, 100);
  };

  const renderStateInfo = () => {
    if (!drawType) return null;

    return (
      <Alert
        severity="info"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => setDrawType(null)}
          >
            Cancel
          </Button>
        }
      >
        Drawing {drawType}
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
        backgroundColor: "#DFDEDD",
      }}
    >
      <RMap
        ref={mapRef}
        width={"100%"}
        height={"100%"}
        initial={{ center: center, zoom: 1 }}
        noDefaultControls
        projection={projection}
      >
        <RLayerImage url={image} extent={extent} />

        {/* Markers display */}
        <RLayerVector>
          {arePinsVisible &&
            data?.length > 0 &&
            data
              .filter((dataPoint) => dataPoint.xPin.coords)
              .map((dataPoint) => (
                <RFeature
                  geometry={new Point(dataPoint.xPin.coords)}
                  // onClick={(e) =>
                  // e.map.getView().fit(e.target.getGeometry().getExtent(), {
                  //   duration: 250,
                  //   maxZoom: 15,
                  // })
                  // }
                >
                  <RPopup trigger={"click"}>
                    <Paper elevation={18} sx={{ p: 2 }}>
                      <Typography>{dataPoint.id}</Typography>
                    </Paper>
                  </RPopup>
                </RFeature>
              ))}
        </RLayerVector>

        {/* Drawings display */}
        <RLayerVector>
          <RFeature
            geometry={
              new Polygon([
                [
                  [268.9355169663954, 768.7197534397103],
                  [306.8041108466033, 772.4728372225447],
                  [301.676061322356, 712.65780342833],
                ],
              ])
            }
          ></RFeature>
        </RLayerVector>

        {/* Pin placement layer */}
        {mode == "pin" && (
          <RLayerVector>
            <RInteraction.RDraw
              type={"Point"}
              onDrawEnd={(e) => {
                handlePointPlace(e.target.sketchCoords_);
              }}
            />
          </RLayerVector>
        )}

        {/* Drawing layer */}
        <RLayerVector
        // onChange={React.useCallback((e) => {
        //     // On every change, check if there is a feature covering the Eiffel Tower
        //     const source = e.target;
        //     if (source?.forEachFeatureAtCoordinateDirect)
        //         setSelected(
        //             source.forEachFeatureAtCoordinateDirect(TourEiffel, () => true)
        //         );
        // }, [])}
        >
          {/* <RStyle.RStyle>
            <RStyle.RStroke color="#0000ff" width={3} />
            <RStyle.RFill color="rgba(0, 0, 0)" />
          </RStyle.RStyle> */}

          {drawType && (
            <RInteraction.RDraw
              type={drawType}
              onDrawEnd={(e) => {
                handleDraw(e.target.sketchCoords_);
              }}
            />
          )}
        </RLayerVector>
      </RMap>

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
                const view = mapRef.current.target.getView();
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
                console.log("mapref", mapRef.current);
                const view = mapRef.current.target.getView();
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

      {/* Draw Features */}
      {mode == "view" && (
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
                  if (drawType == "Circle") setDrawType(null);
                  else addDraw("Circle");
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
                  if (drawType == "Polygon") setDrawType(null);
                  else addDraw("Polygon");
                } catch (error) {
                  console.log("polygon", error);
                }
              }}
            >
              <Polyline />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
    </Box>
  );
};

export default MapView;
