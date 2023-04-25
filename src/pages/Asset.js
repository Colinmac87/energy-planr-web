import { useState } from "react";
import { Box, Tab, Grid, Button, Stack } from "@mui/material";
import {
  UploadFile,
  Map,
  TableChart,
  Layers,
  DynamicForm,
} from "@mui/icons-material";
import { TabPanel, TabContext, TabList } from "@mui/lab";
import { v4 } from "uuid";
import Papa from "papaparse";

import AssetRegisterView from "../components/AssetRegisterView";
import AssetMapView from "../components/AssetMapView";
import EquipmentFileUpload from "../components/EquipmentFileUpload";
import { camelize } from "../utils/string.utils";
import { useParams, useSearchParams } from "react-router-dom";
import FullScreenViewer from "../components/FullScreenViewer";
import LevelsManager from "../components/LevelsManager";
import FormManager from "../components/FormManager";

const Asset = () => {
  const params = useParams();
  let [searchParams, setSearchParams] = useSearchParams();

  const [selectedTab, setSelectedTab] = useState(
    params?.tab || "register-view"
  );
  const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false);
  const [isFullScreenViewerOpen, setIsFullScreenViewerOpen] = useState(false);

  const [data, setData] = useState([]);

  const onTabChange = (e, v) => {
    setSelectedTab(v);
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
                label="Levels"
                value="levels-manager"
              />
              <Tab
                icon={<DynamicForm />}
                iconPosition="start"
                label="Form Settings"
                value="form-manager"
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
              >
                Upload Data
                <input
                  type="file"
                  hidden
                  accept=".csv"
                  onChange={onCSVUploaded}
                />
              </Button>
            </Stack>
            <AssetRegisterView data={data} />
          </TabPanel>
          <TabPanel value="map-view">
            <AssetMapView data={data} />
          </TabPanel>
          <TabPanel value="levels-manager">
            <LevelsManager />
          </TabPanel>
          <TabPanel value="form-manager">
            <FormManager />
          </TabPanel>
        </TabContext>
      </Grid>

      <EquipmentFileUpload
        isOpen={isFileUploadDialogOpen}
        onClose={() => setIsFileUploadDialogOpen(false)}
      />

      <FullScreenViewer
        isOpen={isFullScreenViewerOpen}
        onClose={() => setIsFullScreenViewerOpen(false)}
        data={data}
      />
    </Grid>
  );
};

export default Asset;
