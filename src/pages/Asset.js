import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Drawer,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  UploadFile,
  Map,
  TableChart,
  Settings,
  Add,
} from "@mui/icons-material";
import { v4 } from "uuid";
import Papa from "papaparse";
import { useDispatch, useSelector } from "react-redux";

import AssetRegisterView from "../components/AssetRegisterView";
import AssetMapView from "../components/AssetMapView";
import { camelize } from "../utils/string.utils";
import { useNavigate, useParams } from "react-router-dom";
import { getAsset } from "../services/asset.service";
import { setAsset } from "../features/asset.slice";
import EquipmentDataForm from "../components/EquipmentDataForm";
import AssetSettings from "./AssetSettings";

const Asset = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState(
    params?.tab || "register-view"
  );

  const { asset } = useSelector((state) => state.asset);

  const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false);
  const [isFullScreenViewerOpen, setIsFullScreenViewerOpen] = useState(false);
  const [isDataFormOpen, setIsDataFormOpen] = useState(false);

  const [data, setData] = useState([]);

  useEffect(() => {
    const id = params?.id;
    if (!id) navigate("/");

    getAsset(id)
      .then((_asset) => {
        if (!_asset) navigate("/");

        dispatch(setAsset(_asset));
      })
      .catch(() => navigate("/"));

    return () => dispatch(setAsset(null));
  }, []);

  const onSaveAsset = () => {
    getAsset(asset.id).then((_asset) => {
      setAsset(_asset);
    });
  };

  const onDeleteAsset = () => {
    navigate("/");
  };

  const onCloseDataForm = () => {
    setIsDataFormOpen(false);
  };

  const onCSVUploaded = (e) => {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        let tempDataArr = [];
        results.data.map((row) => {
          const o = {};
          for (const prop in row) {
            o.id = v4();
            o.x = Math.floor(Math.random() * 100);
            o.y = Math.floor(Math.random() * 100);
            o[camelize(prop)] = row[prop];
          }

          tempDataArr.push(o);
        });
        setData(tempDataArr);
      },
    });
  };

  const renderPage = () => {
    switch (selectedTab) {
      case "register-view":
        return (
          <Box sx={{ display: "flex", flex: 1, flexDirection: "column", p: 4 }}>
            <Stack
              spacing={2}
              direction={"row"}
              justifyContent={"flex-end"}
              mb={2}
            >
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFile />}
              >
                Upload Data
                <input
                  type="file"
                  hidden
                  accept=".csv"
                  onChange={onCSVUploaded}
                />
              </Button>
              <Button
                variant="contained"
                component="label"
                startIcon={<Add />}
                onClick={() => setIsDataFormOpen(true)}
              >
                New Record
              </Button>
            </Stack>
            <AssetRegisterView asset={asset} data={data} />
          </Box>
        );
      case "map-view":
        return <AssetMapView data={data} />;
      case "settings-view":
        return (
          <AssetSettings
            asset={asset}
            onSave={onSaveAsset}
            onDelete={onDeleteAsset}
          />
        );
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

        <Drawer
          anchor={"bottom"}
          open={isDataFormOpen}
          onClose={onCloseDataForm}
          sx={{ maxHeight: window.outerHeight - 100, height: "100vh" }}
        >
          <Box sx={{ p: 4, height: "100vh" }}>
            <EquipmentDataForm
              asset={asset}
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
    </Box>
  );
};

export default Asset;
