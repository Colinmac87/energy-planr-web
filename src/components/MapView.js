import {
  Add,
  CircleOutlined,
  Close,
  Delete,
  OpenInFull,
  Polyline,
  Remove,
  Title,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { createEmpty, extend, getCenter, getHeight, getWidth } from "ol/extent";
import { Point, Polygon, Circle } from "ol/geom";
import { Projection } from "ol/proj";
import React, { createRef, useEffect, useRef, useState } from "react";
import WithDataField from "./dataUI/WithDataField";
import {
  RFeature,
  RInteraction,
  RLayerImage,
  RLayerTile,
  RLayerVector,
  RMap,
  RPopup,
} from "rlayers";
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style";
import { useSelector } from "react-redux";
import { PIN_TYPE_POINT, PIN_TYPE_POLYGON } from "../constants/map.constants";

const colorBlob = (size) =>
  "rgba(" +
  [255, 153, 0, Math.min(0.8, 0.4 + Math.log(size / 10) / 20)].join() +
  ")";

const extentFeatures = (features, resolution) => {
  const extent = createEmpty();
  for (const f of features) extend(extent, f.getGeometry().getExtent());
  return Math.round(0.25 * (getWidth(extent) + getHeight(extent))) / resolution;
};

const MapView = ({
  image,
  defaultZoomPercentage,
  data,
  initialAnnotations,
  arePinsVisible,
  areAnnotationsVisible,
  isArialViewVisible,
  mode, // view || pin
  onPinPlacement,
  onSaveAnnotations,
  onExpandPin,
}) => {
  const theme = useTheme();
  const { registers } = useSelector((state) => state.asset);

  const extent = [0, 0, 1024, 968];
  const projection = new Projection({
    code: "xkcd-image",
    units: "pixels",
    extent: extent,
  });
  const center = getCenter(extent);
  const initial = { center: center, zoom: defaultZoomPercentage / 10 };

  const [view, setView] = useState(initial);

  const [drawType, setDrawType] = useState(null);
  const [annotations, setAnnotations] = useState(initialAnnotations);
  const [isErasingAnnotations, setIsErasingAnnotations] = useState(false);
  const [isEditingAnnotationsLabel, setIsEditingAnnotationsLabel] =
    useState(false);
  const [isAnnotationLabelDialogOpen, setIsAnnotationLabelDialogOpen] =
    useState(false);

  const [tempAnnotationCoords, setTempAnnotationCoords] = useState([]);

  const [contextFeature, setContextFeature] = useState(null);

  const mapRef = createRef();
  const pinsRef = useRef(new Array(data.length));

  useEffect(() => {
    setAnnotations(initialAnnotations);
  }, [initialAnnotations]);

  const addDraw = (_drawType) => {
    setTempAnnotationCoords([]);
    setDrawType(null);
    setTimeout(() => {
      setDrawType(_drawType);
    }, 100);
  };

  const saveAnnotations = () => {
    const updatedAnnotations = [
      ...annotations,
      ...tempAnnotationCoords.map((coords) => ({
        type: drawType,
        coords: coords,
      })),
    ];

    setAnnotations(updatedAnnotations);
    onSaveAnnotations(updatedAnnotations);

    cancelAnnotations();
  };

  const deleteAnnotation = ({ type, coords }) => {
    const _annotations = annotations.filter(
      (a) => JSON.stringify(a.coords) != JSON.stringify(coords) // stringify for array comparison
    );
    setAnnotations(_annotations);
  };

  const editAnnotationLabel = ({ type, coords }) => {
    const _annotation = annotations.find(
      (a) => JSON.stringify(a.coords) == JSON.stringify(coords) // stringify for array comparison
    );
    setContextFeature(_annotation);
    setIsAnnotationLabelDialogOpen(true);
  };

  const saveAnnotationLabel = () => {
    onSaveAnnotations(
      annotations.map((a) =>
        JSON.stringify(a.coords) == JSON.stringify(contextFeature.coords) // stringify for array comparison
          ? { ...a, label: contextFeature.label }
          : a
      )
    );
    setTimeout(closeAnnotationLabelDialog, 50);
  };

  const closeAnnotationLabelDialog = () => {
    setContextFeature(null);
    setIsAnnotationLabelDialogOpen(false);
  };

  const cancelAnnotations = () => {
    setTempAnnotationCoords([]);
    setIsErasingAnnotations(false);
    setDrawType(null);
  };

  const renderStateInfo = () => {
    if (drawType)
      return (
        <Alert
          severity="info"
          action={
            <Stack sx={{ flexDirection: "row", gap: 2 }}>
              {tempAnnotationCoords.length > 0 && (
                <Button
                  color="inherit"
                  size="small"
                  variant="contained"
                  onClick={saveAnnotations}
                >
                  Save
                </Button>
              )}
              <Button color="inherit" size="small" onClick={cancelAnnotations}>
                Cancel
              </Button>
            </Stack>
          }
        >
          Annotating {drawType}
        </Alert>
      );

    if (isErasingAnnotations)
      return (
        <Alert
          severity="info"
          action={
            <Stack sx={{ flexDirection: "row", gap: 2 }}>
              <Button
                color="inherit"
                size="small"
                variant="contained"
                onClick={saveAnnotations}
              >
                Save
              </Button>
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  setAnnotations(initialAnnotations);
                  setIsErasingAnnotations(false);
                }}
              >
                Cancel
              </Button>
            </Stack>
          }
        >
          Click on an annotation to erase
        </Alert>
      );

    if (isEditingAnnotationsLabel)
      return (
        <Alert
          severity="info"
          action={
            <Stack sx={{ flexDirection: "row", gap: 2 }}>
              {/* <Button
                color="inherit"
                size="small"
                variant="contained"
                onClick={saveAnnotations}
              >
                Save
              </Button> */}
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  setIsEditingAnnotationsLabel(false);
                }}
              >
                Cancel
              </Button>
            </Stack>
          }
        >
          Click on an annotation to modify label
        </Alert>
      );

    return null;
  };

  const renderPin = (dataPoint, i) => {
    const register = registers.find((r) => r.id == dataPoint?.xRegisterId);
    const defaultField = register?.formFields?.find((f) => f.isDefault == true);

    return (
      <RFeature
        ref={(el) => (pinsRef.current[i] = el)}
        geometry={
          dataPoint.xPin.type == PIN_TYPE_POLYGON
            ? new Polygon(dataPoint.xPin.coords, "XY", [
                dataPoint.xPin.coords.length,
              ])
            : new Point(dataPoint.xPin.coords)
        }
        style={
          dataPoint.xPin.type == PIN_TYPE_POLYGON
            ? new Style({
                fill: new Fill({ color: dataPoint.xPin.color }),
                stroke: new Stroke({
                  width: 3,
                  color: "#111",
                }),
              })
            : new Style({
                image: new CircleStyle({
                  radius: dataPoint.xPin.size * 5,
                  fill: new Fill({ color: dataPoint.xPin.color }),
                  stroke: new Stroke({
                    color: "#111",
                    width: 3,
                  }),
                }),
              })
        }
      >
        {mode == "view" && (
          <RPopup trigger={"click"}>
            <Paper
              elevation={18}
              sx={{
                position: "relative",
                minWidth: 200,
                maxWidth: 256,
                borderStyle: "solid",
                borderColor: theme.palette.primary.main,
                borderWidth: 2,
              }}
            >
              <Stack
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  flexDirection: "row",
                }}
              >
                <Tooltip title="View Data">
                  <IconButton
                    sx={{ borderRadius: 0 }}
                    onClick={() => {
                      pinsRef.current[i].ol.dispatchEvent("click");
                      onExpandPin(dataPoint);
                    }}
                  >
                    <OpenInFull sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Close">
                  <IconButton
                    sx={{ borderRadius: 0 }}
                    onClick={() => {
                      try {
                        pinsRef.current[i].ol.dispatchEvent("click");
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  >
                    <Close sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Stack sx={{ p: 2, pt: 4 }}>
                {defaultField ? (
                  <Stack>
                    <Typography variant="caption">
                      {defaultField.name}
                    </Typography>
                    <WithDataField
                      field={defaultField}
                      value={dataPoint[defaultField.key]}
                      withLabel={false}
                    />
                  </Stack>
                ) : (
                  <Typography>{dataPoint.id}</Typography>
                )}
              </Stack>
            </Paper>
          </RPopup>
        )}
      </RFeature>
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
      {isArialViewVisible ? (
        <RMap
          ref={mapRef}
          width={"100%"}
          height={"100%"}
          initial={{ center: center, zoom: 6 }}
          noDefaultControls
        >
          <RLayerTile url="http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga" />
        </RMap>
      ) : (
        <RMap
          ref={mapRef}
          width={"100%"}
          height={"100%"}
          initial={initial}
          view={[view, setView]}
          projection={projection}
          minZoom={1}
          maxZoom={10}
          noDefaultControls
        >
          <RLayerImage url={image} extent={extent} />

          {/* {arePinsVisible && data?.length > 0 && (
          <RLayerCluster distance={20}>
            <RStyle
              cacheSize={1024}
              cacheId={(feature, resolution) => {
                // This is the hashing function, it takes a feature as its input
                // and returns a string
                // It must be dependant of the same inputs as the rendering function
                console.log("feature", feature);
                return feature.get("features").length > 1
                  ? "#" + extentFeatures(feature.get("features"), resolution)
                  : "$" + renderPin(feature.get("features")[0]);
              }}
              render={(feature, resolution) => {
                console.log("feature", feature);
                // This is the rendering function
                // It has access to the cluster which appears as a single feature
                // and has a property with an array of all the features that make it
                const size = feature.get("features").length;
                // This is the size (number of features) of the cluster
                if (size > 1) {
                  // Render a blob with a number
                  const radius = extentFeatures(
                    feature.get("features"),
                    resolution
                  );
                  return (
                    // A dynamic style should return a fragment instead of a
                    // full-blown RStyle - returning a full RStyle here
                    // will simply replace the style used by the vector layer
                    // with a fixed one
                    <>
                      <RCircle radius={radius}>
                        <RFill color={colorBlob(size)} />
                      </RCircle>
                      <RText text={size.toString()}>
                        <RFill color="#fff" />
                        <RStroke color="rgba(0, 0, 0, 0.6)" width={3} />
                      </RText>
                    </>
                  );
                }

                // We have a single feature cluster
                const unclusteredFeature = feature.get("features")[0];

                return renderPin(unclusteredFeature);
              }}
            />
          </RLayerCluster>
        )} */}

          {/* Pins display layer */}
          {arePinsVisible && data?.length > 0 && (
            <RLayerVector>
              {data
                .filter((dataPoint) => dataPoint.xPin.coords)
                .map((dataPoint, i) => renderPin(dataPoint, i))}
            </RLayerVector>
          )}

          {/* Annotations display layer */}
          {areAnnotationsVisible && annotations?.length > 0 && (
            <RLayerVector>
              {annotations?.map((annotation) => {
                if (annotation.type == "Circle")
                  return (
                    <RFeature
                      geometry={new Circle(annotation.coords, null, "XY")}
                      style={
                        new Style({
                          text: new Text({
                            text: annotation.label,
                            font: "bold 18px Inter",
                          }),
                          fill: new Fill({
                            color: `${theme.palette.primary.main}11`,
                          }),
                          stroke: new Stroke({
                            width: 2,
                            color: theme.palette.primary.main,
                          }),
                        })
                      }
                      onClick={(e) => {
                        const clickedCoords =
                          e.target.values_.geometry.flatCoordinates;
                        clickedCoords.pop();
                        clickedCoords.pop();

                        if (isErasingAnnotations) {
                          deleteAnnotation({
                            type: "Circle",
                            coords: clickedCoords,
                          });
                        }

                        if (isEditingAnnotationsLabel) {
                          editAnnotationLabel({
                            type: "Circle",
                            coords: clickedCoords,
                          });
                        }
                      }}
                    ></RFeature>
                  );
                if (annotation.type == "Polygon")
                  return (
                    <RFeature
                      geometry={
                        new Polygon(annotation.coords, "XY", [
                          annotation.coords.length,
                        ])
                      }
                      style={
                        new Style({
                          text: new Text({
                            text: annotation.label,
                            font: "bold 18px Inter",
                          }),
                          fill: new Fill({
                            color: `${theme.palette.primary.main}11`,
                          }),
                          stroke: new Stroke({
                            width: 2,
                            color: theme.palette.primary.main,
                          }),
                        })
                      }
                      onClick={(e) => {
                        const clickedCoords =
                          e.target.values_.geometry.flatCoordinates;

                        if (isErasingAnnotations) {
                          deleteAnnotation({
                            type: "Polygon",
                            coords: clickedCoords,
                          });
                        }

                        if (isEditingAnnotationsLabel) {
                          editAnnotationLabel({
                            type: "Polygon",
                            coords: clickedCoords,
                          });
                        }
                      }}
                      onDblClick={(e) => {
                        alert("hah!");
                      }}
                    ></RFeature>
                  );

                return null;
              })}
            </RLayerVector>
          )}

          {/* Pin draw layer */}
          {mode == "pin" && !data[0].xPin?.coords && (
            <RLayerVector>
              <RInteraction.RDraw
                style={
                  data[0].xPin?.type == PIN_TYPE_POINT &&
                  new Style({
                    image: new CircleStyle({
                      radius: data[0].xPin.size * 5,
                      fill: new Fill({ color: data[0].xPin.color }),
                    }),
                  })
                }
                type={data[0].xPin?.type}
                onDrawEnd={(e) => {
                  if (data[0].xPin?.type == PIN_TYPE_POLYGON)
                    onPinPlacement(e.feature.values_.geometry.flatCoordinates);
                  else onPinPlacement(e.target.sketchCoords_);
                }}
              />
            </RLayerVector>
          )}

          {/* Annotation draw layer */}
          {drawType && (
            <RLayerVector>
              <RInteraction.RDraw
                type={drawType}
                onDrawEnd={(e) => {
                  setTempAnnotationCoords([
                    ...tempAnnotationCoords,
                    e.feature.values_.geometry.flatCoordinates,
                  ]);
                }}
              />
            </RLayerVector>
          )}
        </RMap>
      )}

      {/* Status bar */}
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

      {/* Controls */}
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
              borderStyle: "solid",
              borderColor: theme.palette.divider,
              borderWidth: 2,
            }}
            onClick={() => {
              try {
                mapRef.current.ol
                  .getView()
                  .setZoom(mapRef.current.ol.getView().getZoom() + 0.3);
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
              borderStyle: "solid",
              borderColor: theme.palette.divider,
              borderWidth: 2,
            }}
            onClick={() => {
              try {
                mapRef.current.ol
                  .getView()
                  .setZoom(mapRef.current.ol.getView().getZoom() - 0.3);
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
      {mode == "view" && !isErasingAnnotations && (
        <Stack
          sx={{
            flexDirection: "column",
            gap: 1,
            position: "absolute",
            left: 12,
            bottom: 12,
          }}
        >
          {!isEditingAnnotationsLabel && (
            <Tooltip title="Modify Labels" placement="right">
              <IconButton
                size="small"
                variant="contained"
                sx={{
                  bgcolor: theme.palette.background.default,
                  borderRadius: theme.shape.borderRadius,
                  borderStyle: "solid",
                  borderColor: theme.palette.divider,
                  borderWidth: 2,
                }}
                onClick={() => {
                  try {
                    setIsEditingAnnotationsLabel(true);
                  } catch (error) {
                    console.log("circle", error);
                  }
                }}
              >
                <Title />
              </IconButton>
            </Tooltip>
          )}
          {!drawType && (
            <Tooltip title="Erase" placement="right">
              <IconButton
                size="small"
                variant="contained"
                sx={{
                  bgcolor: theme.palette.background.default,
                  borderRadius: theme.shape.borderRadius,
                  borderStyle: "solid",
                  borderColor: theme.palette.divider,
                  borderWidth: 2,
                }}
                onClick={() => {
                  try {
                    setIsErasingAnnotations(true);
                  } catch (error) {
                    console.log("circle", error);
                  }
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Circle" placement="right">
            <IconButton
              size="small"
              variant="contained"
              sx={{
                bgcolor: theme.palette.background.default,
                borderRadius: theme.shape.borderRadius,
                borderStyle: "solid",
                borderColor: theme.palette.divider,
                borderWidth: 2,
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
                borderStyle: "solid",
                borderColor: theme.palette.divider,
                borderWidth: 2,
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

      <Dialog
        open={isAnnotationLabelDialogOpen}
        onClose={closeAnnotationLabelDialog}
      >
        <DialogTitle>Annotation label</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={3}
            autoFocus
            margin="dense"
            label="Label"
            fullWidth
            variant="outlined"
            value={contextFeature?.label}
            onChange={(e) =>
              setContextFeature({
                ...contextFeature,
                label: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button variant="outlined" onClick={saveAnnotationLabel}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MapView;
