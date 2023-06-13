import { GroupWork, Info, Layers, TextFields } from "@mui/icons-material";
import {
  Box,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Paper,
} from "@mui/material";
import { useState } from "react";
import FormFieldsManager from "../components/FormFieldsManager";
import FormGroupsManager from "../components/FormGroupsManager";
import LevelsManager from "../components/LevelsManager";
import AssetForm from "../components/AssetForm";

const AssetSettings = ({ asset, onSave, onDelete }) => {
  const [selectedTab, setSelectedTab] = useState("fields-manager");

  const onTabChange = (v) => {
    setSelectedTab(v);
  };

  const renderTab = () => {
    switch (selectedTab) {
      case "fields-manager":
        return <FormFieldsManager asset={asset} onSave={onSave} />;
      case "groups-manager":
        return <FormGroupsManager asset={asset} onSave={onSave} />;
      case "locations-manager":
        return <LevelsManager />;
      case "settings":
        return (
          <AssetForm
            asset={asset}
            onSaving={() => {}}
            onSave={onSave}
            onDelete={onDelete}
          />
        );
      default:
        return null;
    }
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
          minWidth: 256,
          borderRadius: 0,
          justifyContent: "space-between",
          pt: 3,
          pb: 3,
          backgroundColor: "#eee1",
        }}
      >
        <Typography variant="h6" sx={{ p: 1.8 }}>
          Settings
        </Typography>
        <MenuList sx={{ flexGrow: 1 }}>
          <MenuItem
            selected={selectedTab == "fields-manager"}
            onClick={() => onTabChange("fields-manager")}
          >
            <ListItemIcon>
              <TextFields fontSize="small" />
            </ListItemIcon>
            <ListItemText>Fields</ListItemText>
          </MenuItem>
          <MenuItem
            selected={selectedTab == "groups-manager"}
            onClick={() => onTabChange("groups-manager")}
          >
            <ListItemIcon>
              <GroupWork fontSize="small" />
            </ListItemIcon>
            <ListItemText>Groups</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem
            selected={selectedTab == "locations-manager"}
            onClick={() => onTabChange("locations-manager")}
          >
            <ListItemIcon>
              <Layers fontSize="small" />
            </ListItemIcon>
            <ListItemText>Locations</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem
            selected={selectedTab == "settings"}
            onClick={() => onTabChange("settings")}
          >
            <ListItemIcon>
              <Info fontSize="small" />
            </ListItemIcon>
            <ListItemText>Asset Details</ListItemText>
          </MenuItem>
        </MenuList>
      </Paper>

      <Box
        sx={{
          display: "flex",
          flex: 1,
          m: 0,
          p: 4,
          overflow: "auto",
          position: "relative",
        }}
      >
        {renderTab()}
      </Box>
    </Box>
  );
};

export default AssetSettings;
