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
import { Point, Polygon, Circle } from "ol/geom";
import { Projection } from "ol/proj";
import React, { useEffect, useRef, useState } from "react";
import {
  RFeature,
  RInteraction,
  RLayerImage,
  RLayerVector,
  RMap,
  RPopup,
} from "rlayers";
import { Circle as CircleStyle, Fill, Style } from "ol/style";

const MapView = ({
  image,
  data,
  overlays,
  arePinsVisible,
  mode = "view", // view || pin
  onPinPlacement,
  onDraw,
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

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  const handlePointPlace = (coords) => {
    onPinPlacement(coords);
  };

  const handleDraw = (coords) => {
    onDraw({
      type: drawType,
      coords: coords,
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
        {arePinsVisible && (
          <RLayerVector>
            {data?.length > 0 &&
              data
                .filter((dataPoint) => dataPoint.xPin.coords)
                .map((dataPoint) => (
                  <RFeature
                    geometry={new Point(dataPoint.xPin.coords)}
                    style={
                      new Style({
                        image: new CircleStyle({
                          radius: dataPoint.xPin.size * 5,
                          fill: new Fill({ color: dataPoint.xPin.color }),
                        }),
                      })
                    }
                  >
                    <RPopup trigger={"click"}>
                      <Paper elevation={18} sx={{ p: 2 }}>
                        <Typography>{dataPoint.id}</Typography>
                      </Paper>
                    </RPopup>
                  </RFeature>
                ))}
          </RLayerVector>
        )}

        {/* Drawings display */}
        <RLayerVector>
          {overlays?.map((overlay) => {
            console.log(overlay);
            if (overlay.type == "Circle")
              return (
                <RFeature
                  geometry={new Circle(overlay.coords[0], 500)}
                ></RFeature>
              );
            if (overlay.type == "Polygon")
              return (
                <RFeature geometry={new Polygon(overlay.coords)}></RFeature>
              );

            return null;
          })}
        </RLayerVector>

        {/* Pin placement layer */}
        {mode == "pin" && !data[0].xPin?.coords && (
          <RLayerVector>
            <RInteraction.RDraw
              style={
                new Style({
                  image: new CircleStyle({
                    radius: data[0].xPin.size * 5,
                    fill: new Fill({ color: data[0].xPin.color }),
                  }),
                })
              }
              type={"Point"}
              onDrawEnd={(e) => {
                handlePointPlace(e.target.sketchCoords_);
              }}
            />
          </RLayerVector>
        )}

        {/* Drawing layer */}
        <RLayerVector>
          {drawType && (
            <RInteraction.RDraw
              type={drawType}
              onDrawEnd={(e) => {
                console.log("eee", e.target);
                // handleDraw(e.target.sketchCoords_);
              }}
            />
          )}
        </RLayerVector>
      </RMap>

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
