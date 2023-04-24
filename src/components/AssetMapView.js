import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useState } from "react";

import mezzMap from "../assets/Mezz-Floor.png";
import roofMap from "../assets/Roof-Deck.png";
import lowerMap from "../assets/Lower-Deck.png";
import WithMapViewer from "./WithMapViewer";

const AssetMapView = ({ preSelected, data }) => {
  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState(preSelected);

  const [selectedMap, setSelectedMap] = useState("");

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeId) => {
    if (selected == nodeId) {
      setSelected(null);
      return;
    }

    if (nodeId.includes("location")) {
    } else if (nodeId.includes("level")) {
      if (nodeId.includes("roofDeck")) setSelectedMap(roofMap);
      if (nodeId.includes("lowerDeck")) setSelectedMap(lowerMap);
      if (nodeId.includes("mezzFloor")) setSelectedMap(mezzMap);
    } else {
      setSelected(nodeId);
    }
  };

  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 ? ["1", "5", "6", "7"] : []
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        <Paper elevation={2} sx={{ mb: 1, p: 2 }}>
          <Box sx={{ mb: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Location</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Location"
              >
                <MenuItem value={10}>Location 1</MenuItem>
                <MenuItem value={20}>Location 2</MenuItem>
                <MenuItem value={30}>Location 3</MenuItem>
              </Select>
            </FormControl>
            {/* <Button
              size="small"
              onClick={handleExpandClick}
              fullWidth
              sx={{ mt: 1 }}
            >
              {expanded.length === 0 ? "Expand all" : "Collapse all"}
            </Button> */}
          </Box>
          {/* <TreeView
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
                {data.slice(0, 3).map((dataPoint) => (
                  <TreeItem
                    nodeId={dataPoint.id}
                    label={dataPoint.equipmentNo}
                  />
                ))}
              </TreeItem>
              <TreeItem nodeId="level-lowerDeck" label="Lower Deck">
                {data.slice(4, 6).map((dataPoint) => (
                  <TreeItem
                    nodeId={dataPoint.id}
                    label={dataPoint.equipmentNo}
                  />
                ))}
              </TreeItem>
            </TreeItem>
            <TreeItem nodeId="location-2" label="Location 2">
              <TreeItem nodeId="level-mezzFloor" label="Mezz Floor">
                {data.slice(7, 9).map((dataPoint) => (
                  <TreeItem
                    nodeId={dataPoint.id}
                    label={dataPoint.equipmentNo}
                  />
                ))}
              </TreeItem>
            </TreeItem>
          </TreeView> */}

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Mezz Floor</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense={true}>
                {data.slice(0, 3).map((dataPoint) => (
                  <ListItemButton>
                    <ListItemText
                      primary={dataPoint.equipmentNo}
                    />
                  </ListItemButton>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Ground</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense={true}>
                {data.slice(4, 6).map((dataPoint) => (
                  <ListItemButton>
                    <ListItemText
                      primary={dataPoint.equipmentNo}
                    />
                  </ListItemButton>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography>Top Floor</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <List dense={true}>
                {data.slice(7, 9).map((dataPoint) => (
                  <ListItemButton>
                    <ListItemText
                      primary={dataPoint.equipmentNo}
                    />
                  </ListItemButton>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Paper>
      </Grid>
      <Grid item xs={12} md={10}>
        <WithMapViewer data={data} />
      </Grid>
    </Grid>
  );
};

export default AssetMapView;
