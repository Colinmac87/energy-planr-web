import {
  Box,
  Paper,
  Typography,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItemText,
  ListItemButton,
  MenuList,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useEffect, useState } from "react";

import WithMapViewer from "./WithMapViewer";
import { getLocations } from "../services/location.service";
import { useSelector } from "react-redux";

const AssetMapView = ({ preSelected, data }) => {
  const { asset } = useSelector((state) => state.asset);

  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState(preSelected);

  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [treeViewData, setTreeViewData] = useState([]);

  useEffect(() => {
    try {
      getLocations(asset.id).then((_locations) => setLocations(_locations));

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
        overflow: "hidden",
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
          justifyContent: "space-between",
          pt: 3,
          pb: 3,
          backgroundColor: "#eee1",
          overflow: "auto",
        }}
      >
        <MenuList>
          {locations.map((l) => (
            <MenuItem
              disabled={!l.backgroundMapUrl}
              onClick={() => {
                if (selectedLocation?.id == l.id) return;
                setSelectedLocation(null);
                setTimeout(() => setSelectedLocation(l), 50);
              }}
            >
              <ListItemText>{l.name}</ListItemText>
            </MenuItem>
          ))}
        </MenuList>

        <Box sx={{ display: "flex", flex: 1, flexDirection: "column", p: 2 }}>
          {treeViewData.map((treeViewObject) => (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
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
        {selectedLocation && (
          <WithMapViewer location={selectedLocation} data={data} />
        )}
      </Box>
    </Box>
  );
};

export default AssetMapView;
