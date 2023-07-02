import {
  GroupWork,
  Info,
  Layers,
  TableChart,
  TextFields,
} from "@mui/icons-material";
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
import { useEffect, useState } from "react";
import FormFieldsManager from "../components/FormFieldsManager";
import FormGroupsManager from "../components/FormGroupsManager";
import LocationsManager from "../components/LocationsManager";
import AssetForm from "../components/AssetForm";
import { useDispatch, useSelector } from "react-redux";
import { setAsset, setRegisters } from "../features/asset.slice";
import { getAsset } from "../services/asset.service";
import { getRegisters } from "../services/register.service";
import RegistersManager from "../components/RegistersManager";

const AssetSettings = ({ onDeleteAsset }) => {
  const dispatch = useDispatch();
  const { asset, registers } = useSelector((state) => state.asset);

  const [selectedRegister, setSelectedRegister] = useState(null);
  const [selectedTab, setSelectedTab] = useState("registers-manager");

  useEffect(() => {
    setSelectedRegister(
      registers?.find((r) => r.id == selectedRegister?.id) ||
        registers.find((r) => r.isDefault) ||
        registers[0]
    );
  }, [registers]);

  const onTabChange = (v) => {
    setSelectedTab(v);
  };

  const reloadAsset = () => {
    getAsset(asset.id).then((_asset) => dispatch(setAsset(_asset)));
  };

  const reloadRegisters = () => {
    getRegisters(asset.id).then((_registers) => {
      dispatch(setRegisters(_registers));
    });
  };

  const renderTab = () => {
    switch (selectedTab) {
      case "registers-manager":
        return <RegistersManager onSave={reloadRegisters} />;
      case "fields-manager":
        return (
          <FormFieldsManager
            register={selectedRegister}
            onChangeRegister={(register) => setSelectedRegister(register)}
            onSave={reloadRegisters}
          />
        );
      case "groups-manager":
        return (
          <FormGroupsManager
            register={selectedRegister}
            onChangeRegister={(register) => setSelectedRegister(register)}
            onSave={reloadRegisters}
          />
        );
      case "locations-manager":
        return <LocationsManager />;
      case "settings":
        return (
          <AssetForm
            asset={asset}
            onSaving={() => {}}
            onSave={reloadAsset}
            onDelete={onDeleteAsset}
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
          <Divider textAlign="left">
            <Typography variant="caption">Data Management</Typography>
          </Divider>
          <MenuItem
            selected={selectedTab == "registers-manager"}
            onClick={() => onTabChange("registers-manager")}
            sx={{ mt: 1 }}
          >
            <ListItemIcon>
              <TableChart fontSize="small" />
            </ListItemIcon>
            <ListItemText>Registers</ListItemText>
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
          <MenuItem
            selected={selectedTab == "fields-manager"}
            onClick={() => onTabChange("fields-manager")}
            sx={{ mb: 2 }}
          >
            <ListItemIcon>
              <TextFields fontSize="small" />
            </ListItemIcon>
            <ListItemText>Fields</ListItemText>
          </MenuItem>
          <Divider textAlign="left">
            <Typography variant="caption">Data Mapping</Typography>
          </Divider>
          <MenuItem
            selected={selectedTab == "locations-manager"}
            onClick={() => onTabChange("locations-manager")}
            sx={{ mb: 2 }}
          >
            <ListItemIcon>
              <Layers fontSize="small" />
            </ListItemIcon>
            <ListItemText>Locations</ListItemText>
          </MenuItem>
          <Divider textAlign="left">
            <Typography variant="caption">Asset</Typography>
          </Divider>
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
          p: 2,
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
