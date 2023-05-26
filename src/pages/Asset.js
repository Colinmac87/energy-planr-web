import { useEffect, useState } from "react";
import { Box, Tab, Grid, Button, Stack, Drawer } from "@mui/material";
import {
  UploadFile,
  Map,
  TableChart,
  Layers,
  DynamicForm,
  Settings,
  Add,
} from "@mui/icons-material";
import { TabPanel, TabContext, TabList } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";

import AssetRegisterView from "../components/AssetRegisterView";
import AssetMapView from "../components/AssetMapView";
import EquipmentFileUpload from "../components/EquipmentFileUpload";
import { useNavigate, useParams } from "react-router-dom";
import FullScreenViewer from "../components/FullScreenViewer";
import LocationsManager from "../components/LocationsManager";
import FormManager from "../components/FormManager";
import AssetForm from "../components/AssetForm";
import { getAsset } from "../services/asset.service";
import EquipmentDataForm from "../components/EquipmentDataForm";
import { getData } from "../services/data.service";
import { setAsset } from "../features/asset.slice";

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
        loadData(_asset.id);
      })
      .catch(() => navigate("/"));

    return () => dispatch(setAsset(null));
  }, []);

  const onSaveAsset = () => {
    getAsset(asset.id).then((_asset) => {
      setAsset(_asset);
    });
  };

  const loadData = (assetId) => {
    getData(assetId).then((_data) => {
      setData(_data);
    });
  };

  const onTabChange = (e, v) => {
    setSelectedTab(v);
  };

  const onCloseDataForm = () => {
    setIsDataFormOpen(false);
  };

  if (!asset) return null;

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <TabContext value={selectedTab}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={onTabChange} aria-label="Asset Tabs">
              <Tab
                icon={<TableChart />}
                iconPosition="start"
                label="Register"
                value="register-view"
              />
              <Tab
                icon={<Map />}
                iconPosition="start"
                label="Map Viewer"
                value="map-view"
              />
              <Tab
                icon={<Layers />}
                iconPosition="start"
                label="Locations"
                value="locations-manager"
              />
              <Tab
                icon={<DynamicForm />}
                iconPosition="start"
                label="Form Settings"
                value="form-manager"
              />
              <Tab
                icon={<Settings />}
                iconPosition="start"
                label="Settings"
                value="asset-settings"
              />
            </TabList>
          </Box>
          <TabPanel value="register-view">
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
                onClick={() => setIsFileUploadDialogOpen(true)}
              >
                Upload Data
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
            <AssetRegisterView data={data} />
          </TabPanel>
          <TabPanel value="map-view">
            <AssetMapView data={data} />
          </TabPanel>
          <TabPanel value="locations-manager">
            <LocationsManager />
          </TabPanel>
          <TabPanel value="form-manager">
            <FormManager onSave={onSaveAsset} />
          </TabPanel>
          <TabPanel value="asset-settings">
            <AssetForm onSaving={() => {}} onSave={onSaveAsset} />
          </TabPanel>
        </TabContext>
      </Grid>

      <EquipmentFileUpload
        isOpen={isFileUploadDialogOpen}
        onClose={() => setIsFileUploadDialogOpen(false)}
        onSave={() => {}}
      />

      <FullScreenViewer
        isOpen={isFullScreenViewerOpen}
        onClose={() => setIsFullScreenViewerOpen(false)}
        data={data}
      />

      <Drawer
        anchor={"bottom"}
        open={isDataFormOpen}
        onClose={onCloseDataForm}
        sx={{ maxHeight: window.outerHeight - 100 }}
      >
        <Box sx={{ p: 4 }}>
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
    </Grid>
  );
};

export default Asset;
