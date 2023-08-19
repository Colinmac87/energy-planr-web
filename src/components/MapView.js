import { Add, Remove } from "@mui/icons-material";
import { Box, IconButton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import Map from "ol/Map";
import { getCenter } from "ol/extent";
import Static from "ol/source/ImageStatic";
import View from "ol/View";
import Projection from "ol/proj/Projection";
import ImageLayer from "ol/layer/Image";

import "../../node_modules/ol/ol.css";

const MapView = ({ image, data, arePinsVisible }) => {
  const extent = [0, 0, 1024, 968];
  const projection = new Projection({
    code: "xkcd-image",
    units: "pixels",
    extent: extent,
  });

  const [map, setMap] = useState(null);

  useEffect(() => {
    const newMap = new Map({
      layers: [
        new ImageLayer({
          source: new Static({
            url: image,
            projection: projection,
            imageExtent: extent,
          }),
        }),
      ],
      target: "olMap",
      view: new View({
        projection: projection,
        center: getCenter(extent),
        zoom: 2,
        maxZoom: 8,
      }),
    });
    setMap(newMap);

    return () => {
      map?.dispose();
    };
  }, [image]);

  return (
    <Box
      sx={{
        position: "relative",
        maxWidth: "100%",
        height: "100%",
        backgroundColor: "#DFDEDD",
      }}
    >
      <div
        id="olMap"
        class="olMap"
        style={{ width: "100%", height: "100%" }}
      ></div>

      <Box sx={{ position: "absolute", bottom: 8, right: 8 }}>
        <Stack direction={"column"} spacing={0.5}>
          <IconButton
            key="btnZoomIn"
            // onClick={onZoomIn}
            size="small"
            variant="contained"
            sx={{ backgroundColor: "black", color: "white", borderRadius: 0 }}
          >
            <Add />
          </IconButton>
          <IconButton
            key="btnZoomOut"
            // onClick={onZoomOut}
            size="small"
            variant="contained"
            sx={{ backgroundColor: "black", color: "white", borderRadius: 0 }}
          >
            <Remove />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
};

export default MapView;
