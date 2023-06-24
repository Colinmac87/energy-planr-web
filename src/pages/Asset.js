import { useEffect, useState } from "react";
import { Box, Stack, Drawer, Paper, IconButton, Tooltip } from "@mui/material";
import { Map, TableChart, Settings } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";

import AssetRegisterView from "../components/AssetRegisterView";
import AssetMapView from "../components/AssetMapView";
import { useNavigate, useParams } from "react-router-dom";

import { getAsset } from "../services/asset.service";
import EquipmentDataForm from "../components/EquipmentDataForm";
import { setAsset, setRegisters } from "../features/asset.slice";

import AssetSettings from "./AssetSettings";
import { getRegisters } from "../services/register.service";

const Asset = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState(
    params?.tab || "register-view"
  );

  const { asset } = useSelector((state) => state.asset);

  const [isDataFormOpen, setIsDataFormOpen] = useState(false);

  useEffect(() => {
    const id = params?.id;
    if (!id) navigate("/");

    getAsset(id)
      .then((_asset) => {
        if (!_asset) navigate("/");

        dispatch(setAsset(_asset));

        getRegisters(_asset.id).then((_registers) => {
          dispatch(setRegisters(_registers));
        });
      })
      .catch(() => navigate("/"));

    return () => {
      dispatch(setAsset(null));
      dispatch(setRegisters([]));
    };
  }, []);

  const onDeleteAsset = () => {
    navigate("/");
  };

  const onCloseDataForm = () => {
    setIsDataFormOpen(false);
  };

  const renderPage = () => {
    switch (selectedTab) {
      case "register-view":
        return <AssetRegisterView />;
      case "map-view":
        return <AssetMapView />;
      case "settings-view":
        return <AssetSettings onDeleteAsset={onDeleteAsset} />;
      default:
        return null;
    }
  };

  if (!asset) return null;

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
          width: 70,
          borderRadius: 0,
          justifyContent: "space-between",
          pt: 3,
          pb: 3,
        }}
      >
        <Stack
          sx={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Tooltip title="Register" placement="right">
            <IconButton
              aria-label="register"
              onClick={() =>
                selectedTab != "register-view" &&
                setSelectedTab("register-view")
              }
              color={selectedTab == "register-view" ? "primary" : "default"}
            >
              <TableChart fontSize="large" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Map" placement="right">
            <IconButton
              aria-label="map"
              onClick={() =>
                selectedTab != "map-view" && setSelectedTab("map-view")
              }
              color={selectedTab == "map-view" ? "primary" : "default"}
            >
              <Map fontSize="large" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings" placement="right">
            <IconButton
              aria-label="form"
              onClick={() =>
                selectedTab != "settings-view" &&
                setSelectedTab("settings-view")
              }
              color={selectedTab == "settings-view" ? "primary" : "default"}
            >
              <Settings fontSize="large" />
            </IconButton>
          </Tooltip>
        </Stack>
        {/* <Stack
          sx={{
            flex: 1,
            flexDirection: "column-reverse",
            alignItems: "center",
            gap: 8,
          }}
        >
          <IconButton aria-label="settings">
            <Settings fontSize="large" />
          </IconButton>
        </Stack> */}
      </Paper>

      <Box
        sx={{
          display: "flex",
          flex: 1,
          flexGrow: 1,
          position: "relative",
          m: 0,
          p: 0,
          overflow: "auto",
        }}
      >
        {renderPage()}
      </Box>
      <Drawer
        anchor={"bottom"}
        open={isDataFormOpen}
        onClose={onCloseDataForm}
        sx={{ height: "100%" }}
      >
        <Box sx={{ p: 4, height: "100%" }}>
          <EquipmentDataForm
            onClose={onCloseDataForm}
            onSaving={() => {}}
            onSave={() => {
              onCloseDataForm();
              // load data
            }}
          />
        </Box>
      </Drawer>
    </Box>
  );
};

export default Asset;
