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
import { getDataByAsset } from "../services/data.service";
import { isInternalField } from "../utils/form.utils";

const AssetMapView = ({ preSelected }) => {
  const { asset } = useSelector((state) => state.asset);

  const [data, setData] = useState([]);
  const [selectedDataGroup, setSelectedDataGroup] = useState(preSelected);

  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [treeViewData, setTreeViewData] = useState([]);

  useEffect(() => {
    try {
      getLocations(asset.id).then((_locations) => setLocations(_locations));

      getDataByAsset(asset.id).then((_data) => setData(_data));
    } catch (error) {}
  }, []);

  useEffect(() => {
    try {
      let temp = [];
      const schema = data[0];

      for (const property in schema) {
        if (isInternalField(property)) continue;

        const allPropertyValues = data.map((i) => i[property]);

        temp.push({
          group: property,
          entries: [...new Set(allPropertyValues)],
        });
      }

      setTreeViewData(temp);
    } catch (error) {}
  }, [data]);

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
          {locations
            .sort((l1, l2) => l1.order - l2.order)
            .map((l) => (
              <MenuItem
                divider
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
          {treeViewData.map((treeViewObject) => {
            let isGroupSelected = false;

            if (selectedDataGroup) {
              const keyValue = selectedDataGroup.split(";;");
              isGroupSelected = treeViewObject.group == keyValue[0];
            }

            return (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography
                    sx={{ fontWeight: isGroupSelected ? "bold" : "normal" }}
                  >
                    {treeViewObject.group}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense={true}>
                    {treeViewObject.entries
                      .filter((propertyValue) => propertyValue)
                      .map((propertyValue, i) => (
                        <ListItemButton
                          key={`${treeViewObject.group};;${propertyValue}`}
                          selected={
                            selectedDataGroup ==
                            `${treeViewObject.group};;${propertyValue}`
                          }
                          onClick={() => {
                            if (
                              selectedDataGroup ==
                              `${treeViewObject.group};;${propertyValue}`
                            )
                              setSelectedDataGroup(null);
                            else
                              setSelectedDataGroup(
                                `${treeViewObject.group};;${propertyValue}`
                              );
                          }}
                        >
                          <ListItemText primary={propertyValue} />
                        </ListItemButton>
                      ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      </Paper>

      <Box
        sx={{
          display: "flex",
          flex: 1,
          flexGrow: 1,
          m: 0,
          p: 1,
          pt: 0,
          pb: 0,
          pr: 0,
          overflow: "hidden",
        }}
      >
        {selectedLocation ? (
          <WithMapViewer
            location={selectedLocation}
            data={data.filter((d) => {
              if (
                d.xPin?.coords &&
                d.xPin?.locationId == selectedLocation?.id
              ) {
                if (!selectedDataGroup) return true;

                const keyValue = selectedDataGroup.split(";;");
                return d[keyValue[0]] == keyValue[1];
              }
              return false;
            })}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="caption">
              Select a location to view the map
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AssetMapView;
