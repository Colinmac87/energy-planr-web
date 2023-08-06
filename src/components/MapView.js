import { Add, Remove } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import React, {
  createRef,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { OSM } from "ol/source";
import Map from "ol/Map";
import { getCenter } from "ol/extent";
import Static from "ol/source/ImageStatic";
import View from "ol/View";
import Projection from "ol/proj/Projection";
import ImageLayer from "ol/layer/Image";
import TileLayer from "ol/layer/Tile";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Draw from "ol/interaction/Draw";

import "../../node_modules/ol/ol.css";
import { Overlay } from "ol";
import { stringify } from "../utils/string.utils";

const MapView = ({
  image,
  data,
  arePinsVisible,
  mode = "view", // view || pin
  onPinPlacement,
}) => {
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const [drawType, setDrawType] = useState("Point");
  // const [map, setMap] = useState(null);

  const popupContainer = document.getElementById("olPopup");

  const map = useRef();
  const draw = useRef();

  const extent = [0, 0, 1024, 968];
  const projection = new Projection({
    code: "xkcd-image",
    units: "pixels",
    extent: extent,
  });

  const raster = new TileLayer({
    source: new OSM(),
  });

  const source = new VectorSource({ wrapX: false });

  const vector = new VectorLayer({
    source: source,
  });

  const overlay = useRef(
    new Overlay({
      element: popupContainer,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    })
  );

  useEffect(() => {
    map.current = new Map({
      layers: [
        new ImageLayer({
          source: new Static({
            url: image,
            projection: projection,
            imageExtent: extent,
          }),
        }),
        raster,
        vector,
      ],
      target: "olMap",
      view: new View({
        projection: projection,
        center: getCenter(extent),
        zoom: 2,
        maxZoom: 8,
      }),
    });

    if (mode == "pin") {
      // draw.current = new Draw({
      //   source: source,
      //   type: drawType,
      // });
      // draw.current.on("drawend", (e) => {
      //   const [x, y] = e.target.sketchCoords_;
      //   overlay.current.setPosition([x, y]);

      //   onPinPlacement(x, y);
      // });
      // // draw.current = _draw;

      // map.current.addInteraction(draw.current);
      addDraw();
    }

    // map.current = newMap;

    // setMap(newMap);
    // setMap(JSON.parse(stringify(newMap)));

    // return () => {
    //   map?.dispose();
    // };
  }, [image]);

  useEffect(() => {
    console.log("mode", mode);
    if (mode == "view") {
      draw.current.removeLastPoint();

      setTimeout(() => {
        removeDraw();
        forceUpdate();
      }, 4000);
    } else {
      console.log("data", data);
    }
  }, [mode]);

  const addDraw = () => {
    draw.current = new Draw({
      source: source,
      type: drawType,
    });
    draw.current.on("drawend", (e) => {
      console.log("draw end");
      const [x, y] = e.target.sketchCoords_;
      overlay.current.setPosition([x, y]);

      onPinPlacement(x, y);
    });
    // draw.current = _draw;

    map.current.addInteraction(draw.current);
  };

  const removeDraw = () => {
    console.log("removing", draw.current);
    console.log("removed ", map.current.removeInteraction(draw.current));
    draw.current.dispose();
    // draw.current = null;
    // console.log("map", map);
    // const mapCopy = JSON.parse(stringify(map));
    // mapCopy

    // setMap(mapCopy);
  };

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
      {ignored}
      <div
        id="olMap"
        class="olMap"
        className="olMap"
        style={{ width: "100%", height: "100%" }}
      ></div>

      <div
        id="olPopup"
        class="olPopup"
        className="olPopup"
        style={{ position: "absolute", bottom: 12, left: -50, minWidth: 200 }}
      >
        <Button
          onClick={() => {
            overlay.current.setPosition(undefined);
            return false;
          }}
        >
          X
        </Button>
        HAHAHAH
      </div>
    </Box>
  );
};

export default MapView;
