import { Box, IconButton, Stack, useTheme } from "@mui/material";
import React, { createRef, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  ImageOverlay,
  useMap,
  Marker,
  Popup,
  LayerGroup,
  Circle,
  FeatureGroup,
  Rectangle,
} from "react-leaflet";
import L from "leaflet";
import { Add, Remove } from "@mui/icons-material";

const center = [0, 0];
const rectangle = [
  [51.49, -0.08],
  [51.5, -0.06],
];

const fillBlueOptions = { fillColor: "blue" };
const fillRedOptions = { fillColor: "red" };
const greenOptions = { color: "green", fillColor: "green" };
const purpleOptions = { color: "purple" };

const ZoomControl = () => {
  const theme = useTheme();
  const map = useMap();

  return (
    <Stack
      sx={{
        flexDirection: "column",
        gap: 1,
        position: "absolute",
        right: 12,
        bottom: 12,
      }}
    >
      <IconButton
        size="small"
        variant="contained"
        sx={{
          bgcolor: theme.palette.background.default,
          borderRadius: theme.shape.borderRadius,
        }}
        onClick={() => {
          try {
            console.log("zoom", map.getZoom());
            map.setZoom(map.getZoom() + 1);
          } catch (error) {
            console.log("zoom-in", error);
          }
        }}
      >
        <Add />
      </IconButton>
      <IconButton
        size="small"
        variant="contained"
        sx={{
          bgcolor: theme.palette.background.default,
          borderRadius: theme.shape.borderRadius,
        }}
        onClick={() => {
          try {
            console.log("zoom", map.getZoom());
            map.setZoom(map.getZoom() - 1);
            // map.setZoom(1);
          } catch (error) {
            console.log("zoom-in", error);
          }
        }}
      >
        <Remove />
      </IconButton>
    </Stack>
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

  const map = createRef();
  // const [map, setMap] = useState(null);
  // const mapRef = createRef();
  const [markerImage] = useState(() => {
    const _image = new Image();
    _image.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC";
    return _image;
  });

  const handleMapClick = (coords) => {
    if (mode == "pin") {
      onPinPlacement({
        x: coords.x,
        y: coords.y,
      });
    }
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
      {/* <div
        // id="olMap"
        // class="olMap"
        // className="olMap"
        style={{ width: "100%", height: "100%" }}
      > */}
      <MapContainer
        ref={map}
        crs={L.CRS.Simple}
        center={[800, 500]}
        zoom={1}
        minZoom={-5}
        scrollWheelZoom={true}
        // style={{
        //   position: "relative",
        //   minWidth: "100%",
        //   maxWidth: "100%",
        //   minHeight: "100%",
        //   maxHeight: "100%",
        // }}
      >
        <ImageOverlay
          url={image}
          bounds={[
            [0, 0],
            [1000, 1000],
          ]}
        ></ImageOverlay>
        <Marker position={[800, 500]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        {/* <LayerGroup>
          <Circle center={center} pathOptions={fillBlueOptions} radius={200} />
          <Circle
            center={center}
            pathOptions={fillRedOptions}
            radius={100}
            stroke={false}
          />
          <LayerGroup>
            <Circle
              center={[51.51, -0.08]}
              pathOptions={greenOptions}
              radius={100}
            />
          </LayerGroup>
        </LayerGroup> */}
        {/* <Marker
            position={[200, 200]}

            // circleColour={dataMarker.xPin?.color}
            // inCircle={true}
            // size={dataMarker.xPin?.size * 16}
            // markerKey={i}
            // coords={dataMarker.xPin?.coords}
            // image={markerImage}
          >
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker> */}

        {/* {arePinsVisible &&
            data
              .filter((dataMarker) => dataMarker.xPin?.coords != null)
              .map((dataMarker, i) => (
                <Marker
                  position={[200, 200]}

                  // circleColour={dataMarker.xPin?.color}
                  // inCircle={true}
                  // size={dataMarker.xPin?.size * 16}
                  // markerKey={i}
                  // coords={dataMarker.xPin?.coords}
                  // image={markerImage}
                >
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>
              ))} */}

        {/* <ZoomControl position="bottomleft" /> */}

        <ZoomControl />
      </MapContainer>

      {/* <Stack
        sx={{
          flexDirection: "column",
          gap: 1,
          position: "absolute",
          right: 12,
          bottom: 12,
        }}
      >
        <IconButton
          size="small"
          variant="contained"
          sx={{
            bgcolor: theme.palette.background.default,
            borderRadius: theme.shape.borderRadius,
          }}
          onClick={() => {
            try {
              console.log("zoom", map.getZoom());
              map.setZoom(map.getZoom() + 0.2);
            } catch (error) {
              console.log("zoom-in", error);
            }
          }}
        >
          <Add />
        </IconButton>
        <IconButton
          size="small"
          variant="contained"
          sx={{
            bgcolor: theme.palette.background.default,
            borderRadius: theme.shape.borderRadius,
          }}
          onClick={() => {
            try {
              console.log("zoom", map.getZoom());
              map.setZoom(map.getZoom() - 0.2);
              // map.setZoom(1);
            } catch (error) {
              console.log("zoom-in", error);
            }
          }}
        >
          <Remove />
        </IconButton>
      </Stack> */}

      {/* <Map image={image} onClick={handleMapClick} ref={mapRef}>
          {arePinsVisible &&
            data
              .filter((dataMarker) => dataMarker.xPin?.coords != null)
              .map((dataMarker, i) => (
                <Marker
                  circleColour={dataMarker.xPin?.color}
                  inCircle={true}
                  size={dataMarker.xPin?.size * 16}
                  markerKey={i}
                  coords={dataMarker.xPin?.coords}
                  image={markerImage}
                />
              ))}
        </Map> */}
      {/* </div> */}
    </Box>
  );
};

export default MapView;
