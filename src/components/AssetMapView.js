import { Box, Button, Grid, Drawer, Paper, Typography } from "@mui/material";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import { TreeView, TreeItem } from "@mui/lab";
import { useState } from "react";

import MapPin from "./MapPin";

import mezzMap from "../assets/Mezz-Floor.png";
import roofMap from "../assets/Roof-Deck.png";
import lowerMap from "../assets/Lower-Deck.png";

const AssetMapView = ({ data }) => {
  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);

  const [selectedMap, setSelectedMap] = useState("");

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeId) => {
    if (nodeId.includes("location")) {
    setSelected(nodeId);
    console.log("location");
    }

    if (nodeId.includes("level")) {
      if (nodeId.includes("roofDeck")) setSelectedMap(roofMap);
      if (nodeId.includes("lowerDeck")) setSelectedMap(lowerMap);
      if (nodeId.includes("mezzFloor")) setSelectedMap(mezzMap);
      setSelected(nodeId);
    }
  };

  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 ? ["1", "5", "6", "7"] : []
    );
  };

  // const handleSelectClick = () => {
  //   setSelected((oldSelected) =>
  //     oldSelected.length === 0
  //       ? ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
  //       : []
  //   );
  // };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <Paper elevation={2} sx={{ mb: 1, p: 1 }}>
          <Box sx={{ mb: 2 }}>
            <Button onClick={handleExpandClick}>
              {expanded.length === 0 ? "Expand all" : "Collapse all"}
            </Button>
            {/* <Button onClick={handleSelectClick}>
              {selected.length === 0 ? "Select all" : "Unselect all"}
            </Button> */}
          </Box>
          <TreeView
            aria-label="controlled"
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<ChevronRight />}
            expanded={expanded}
            selected={selected}
            onNodeToggle={handleToggle}
            onNodeSelect={handleSelect}
          >
            <TreeItem nodeId="location-1" label="Location 1">
              <TreeItem nodeId="level-roofDeck" label="Roof Deck">
                <TreeItem nodeId="eq-1" label="Equipment 1" />
                <TreeItem nodeId="eq-2" label="Equipment 2" />
                <TreeItem nodeId="eq-3" label="Equipment 3" />
                <TreeItem nodeId="eq-4" label="Equipment 4" />
              </TreeItem>
              <TreeItem nodeId="level-lowerDeck" label="Lower Deck">
                <TreeItem nodeId="eq-5" label="Equipment 5" />
                <TreeItem nodeId="eq-6" label="Equipment 6" />
                <TreeItem nodeId="eq-7" label="Equipment 7" />
                <TreeItem nodeId="eq-8" label="Equipment 8" />
              </TreeItem>
            </TreeItem>
            <TreeItem nodeId="location-2" label="Location 2">
              <TreeItem nodeId="level-mezzFloor" label="Mezz Floor">
                <TreeItem nodeId="eq-9" label="Equipment 9"></TreeItem>
                <TreeItem nodeId="eq-10" label="Equipment 10"></TreeItem>
                <TreeItem nodeId="eq-11" label="Equipment 11"></TreeItem>
              </TreeItem>
            </TreeItem>
          </TreeView>
        </Paper>
      </Grid>
      <Grid item xs={12} md={9}>
        <Paper elevation={2}>
          <Box
            sx={{
              width: "100%",
              minHeight: 120,
              position: "relative",
            }}
          >
            {selectedMap ? (
              <img
                style={{ width: "100%" }}
                src={selectedMap}
                alt="Level Map"
              />
            ) : (
              <Box
                sx={{
                  p: 4,
                  display: "flex",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography>Select a level to view map</Typography>
              </Box>
            )}
            {data.map((dataPin) => (
              <MapPin
                x={Math.floor(Math.random() * 100)}
                y={Math.floor(Math.random() * 100)}
                data={dataPin}
              />
            ))}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AssetMapView;
