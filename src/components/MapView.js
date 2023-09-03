import {
  Add,
  CircleOutlined,
  Delete,
  Polyline,
  Remove,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { createEmpty, extend, getCenter, getHeight, getWidth } from "ol/extent";
import { Point, Polygon, Circle } from "ol/geom";
import { Projection } from "ol/proj";
import React, { useEffect, useState } from "react";
import WithDataField from "./dataUI/WithDataField";
import {
  RFeature,
  RInteraction,
  RLayerImage,
  RLayerVector,
  RMap,
  RPopup,
} from "rlayers";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { useSelector } from "react-redux";

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
  data,
  initialAnnotations,
  arePinsVisible,
  areAnnotationsVisible,
  mode = "view", // view || pin
  onPinPlacement,
  onSaveAnnotations,
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
  const initial = { center: center, zoom: 1 };

  const [view, setView] = useState(initial);

  const [drawType, setDrawType] = useState(null);
  const [annotations, setAnnotations] = useState(initialAnnotations);
  const [isErasingAnnotations, setIsErasingAnnotations] = useState(false);

  const [tempAnnotationCoords, setTempAnnotationCoords] = useState([]);

  useEffect(() => {
    setAnnotations(initialAnnotations);
  }, [initialAnnotations]);

  const handlePointPlace = (coords) => {
    onPinPlacement(coords);
  };

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

    return null;
  };

  const renderPin = (dataPoint) => {
    const register = registers.find((r) => r.id == dataPoint?.xRegisterId);
    const defaultField = register?.formFields?.find((f) => f.isDefault == true);

    return (
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
        {mode == "view" && (
          <RPopup trigger={"click"}>
            <Paper
              elevation={18}
              sx={{
                maxWidth: 256,
                borderStyle: "solid",
                borderColor: theme.palette.primary.main,
                borderWidth: 2,
              }}
            >
              <Stack sx={{ p: 2 }}>
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
              <Stack>
                <Divider />
                <Typography variant="caption" p={0.6}>
                  <i>Click on the pin to dismiss</i>
                </Typography>
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
      <RMap
        width={"100%"}
        height={"100%"}
        initial={initial}
        view={[view, setView]}
        projection={projection}
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

        {/* Pins display */}
        {arePinsVisible && data?.length > 0 && (
          <RLayerVector>
            {data
              .filter((dataPoint) => dataPoint.xPin.coords)
              .map((dataPoint) => renderPin(dataPoint))}
          </RLayerVector>
        )}

        {/* Annotations display */}
        {areAnnotationsVisible && annotations?.length > 0 && (
          <RLayerVector>
            {annotations?.map((annotation) => {
              if (annotation.type == "Circle")
                return (
                  <RFeature
                    geometry={new Circle(annotation.coords, null, "XY")}
                    style={
                      new Style({
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
                      if (!isErasingAnnotations) return;

                      const clickedCoords =
                        e.target.values_.geometry.flatCoordinates;
                      clickedCoords.pop();
                      clickedCoords.pop();

                      deleteAnnotation({
                        type: "Circle",
                        coords: clickedCoords,
                      });
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
                      if (!isErasingAnnotations) return;

                      const clickedCoords =
                        e.target.values_.geometry.flatCoordinates;

                      deleteAnnotation({
                        type: "Polygon",
                        coords: clickedCoords,
                      });
                    }}
                  ></RFeature>
                );

              return null;
            })}
          </RLayerVector>
        )}

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

        {/* Annotation layer */}
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
              borderStyle: "solid",
              borderColor: theme.palette.divider,
              borderWidth: 2,
            }}
            onClick={() => {
              try {
                setView({ ...view, zoom: 20 });
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
                setView({ ...view, zoom: 5 });
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
    </Box>
  );
};

export default MapView;
