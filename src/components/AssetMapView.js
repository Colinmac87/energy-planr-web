import { Box, Button, Grid, Drawer, Paper } from "@mui/material";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import { TreeView, TreeItem } from "@mui/lab";
import { useState } from "react";

import MapPin from "./MapPin";

import mezzMap from "../assets/Mezz-Floor.png";

const AssetMapView = ({ data }) => {
  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };

  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 ? ["1", "5", "6", "7"] : []
    );
  };

  const handleSelectClick = () => {
    setSelected((oldSelected) =>
      oldSelected.length === 0
        ? ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
        : []
    );
  };

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
            multiSelect
          >
            <TreeItem nodeId="1" label="Applications">
              <TreeItem nodeId="2" label="Calendar" />
              <TreeItem nodeId="3" label="Chrome" />
              <TreeItem nodeId="4" label="Webstorm" />
            </TreeItem>
            <TreeItem nodeId="5" label="Documents">
              <TreeItem nodeId="6" label="MUI">
                <TreeItem nodeId="7" label="src">
                  <TreeItem nodeId="8" label="index.js" />
                  <TreeItem nodeId="9" label="tree-view.js" />
                </TreeItem>
              </TreeItem>
            </TreeItem>
          </TreeView>
        </Paper>
      </Grid>
      <Grid item xs={12} md={9}>
        <Paper elevation={2}>
          <div
            style={{
              width: "100%",
              height: 400,
              backgroundImage: `url(${mezzMap})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              position: "relative",
            }}
          >
            {data.map((dataPin) => (
              <MapPin
                x={Math.floor(Math.random() * 100)}
                y={Math.floor(Math.random() * 100)}
                data={dataPin}
              />
            ))}
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AssetMapView;
