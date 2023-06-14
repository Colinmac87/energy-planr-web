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
  MenuList,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useEffect, useState } from "react";

import mezzMap from "../assets/Mezz-Floor.png";
import roofMap from "../assets/Roof-Deck.png";
import lowerMap from "../assets/Lower-Deck.png";
import WithMapViewer from "./WithMapViewer";

const AssetMapView = ({ preSelected, data }) => {
  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState(preSelected);

  const [selectedMap, setSelectedMap] = useState("");

  const [treeViewData, setTreeViewData] = useState([]);

  useEffect(() => {
    try {
      let temp = [];
      const schema = data[0];

      for (const property in schema) {
        // remove internal properties
        if (["id", "x", "y", "level"].includes(property)) continue;

        const allPropertyValues = data.map((i) => i[property]);

        temp.push({
          group: property,
          entries: [...new Set(allPropertyValues)],
        });
      }

      setTreeViewData(temp);
    } catch (error) {}
  }, []);

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
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "row",
        flex: 1,
        flexGrow: 1,
        m: 0,
        p: 0,
        position: "relative",
      }}
    >
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "16%",
          minWidth: 224,
          maxWidth: 296,
          borderRadius: 0,
          justifyContent: "space-between",
          pt: 3,
          pb: 3,
          backgroundColor: "#eee1",
        }}
      >
        <MenuList>
          <MenuItem>
            <ListItemText>Mezz Floor</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemText>Ground Floor</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemText>Top Floor</ListItemText>
          </MenuItem>
        </MenuList>

        <Box sx={{ display: "flex", flex: 1, flexDirection: "column", p: 2 }}>
          {treeViewData.map((treeViewObject) => (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>{treeViewObject.group}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense={true}>
                  {treeViewObject.entries.map((propertyValue, i) => (
                    <ListItemButton
                      key={`${treeViewObject.group}-${propertyValue}`}
                      selected={
                        selected == `${treeViewObject.group}-${propertyValue}`
                      }
                      onClick={() =>
                        setSelected(`${treeViewObject.group}-${propertyValue}`)
                      }
                    >
                      <ListItemText primary={propertyValue} />
                    </ListItemButton>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Paper>

      <Box
        sx={{
          display: "flex",
          flex: 1,
          flexGrow: 1,
          m: 0,
          p: 1,
          overflow: "hidden",
        }}
      >
        <WithMapViewer data={data} />
      </Box>
    </Box>
  );
};

export default AssetMapView;
