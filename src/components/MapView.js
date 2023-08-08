import { Box } from "@mui/material";
import React, { useState } from "react";
import { Map, Marker } from "react-canvas-map";

const MapView = ({
  image,
  data,
  arePinsVisible,
  mode = "view", // view || pin
  onPinPlacement,
}) => {
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
        backgroundColor: "#eee2",
      }}
    >
      <div
        id="olMap"
        class="olMap"
        className="olMap"
        style={{ width: "100%", height: "100%" }}
      >
        <Map image={image} onClick={handleMapClick}>
          {arePinsVisible &&
            data
              .filter((dataMarker) => dataMarker.xPin?.coords != null)
              .map((dataMarker, i) => (
                <>
                  <Marker
                    circleColour={dataMarker.xPin?.color}
                    inCircle={true}
                    size={dataMarker.xPin?.size * 16}
                    markerKey={i}
                    coords={dataMarker.xPin?.coords}
                    image={markerImage}
                  />
                </>
              ))}
        </Map>
      </div>
    </Box>
  );
};

export default MapView;
