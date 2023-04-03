import { useState } from "react";
import { Box, Tab, Grid, Typography, Button } from "@mui/material";
import { UploadFile, Map, TableRows, TableChart } from "@mui/icons-material";
import { TabPanel, TabContext, TabList } from "@mui/lab";
import Papa from "papaparse";

import PlanRegisterView from "../components/PlanRegisterView";
import PlanMapView from "../components/PlanMapView";
import EquipmentFileUpload from "../components/EquipmentFileUpload";
import { camelize } from "../utils/string.utils";

const Plan = () => {
  const [selectedTab, setSelectedTab] = useState("tab-register");
  const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false);

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
        <Typography gutterBottom variant="h3" component="div">
          Headquarter site
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="outlined"
          component="label"
          startIcon={<UploadFile />}
          // onClick={() => setIsFileUploadDialogOpen(true)}
        >
          Upload
          <input type="file" hidden accept=".csv" onChange={onCSVUploaded} />
        </Button>
      </Grid>
      <Grid item xs={12}>
        <TabContext value={selectedTab}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={onTabChange} aria-label="Plan Tabs">
              <Tab
                icon={<TableChart />}
                iconPosition="start"
                label="Register"
                value="tab-register"
              />
              <Tab
                icon={<Map />}
                iconPosition="start"
                label="Map Viewer"
                value="tab-viewer"
              />
            </TabList>
          </Box>
          <TabPanel value="tab-register">
            <PlanRegisterView data={data} />
          </TabPanel>
          <TabPanel value="tab-viewer">
            <PlanMapView data={data} />
          </TabPanel>
        </TabContext>
      </Grid>

      <EquipmentFileUpload
        isOpen={isFileUploadDialogOpen}
        onClose={() => setIsFileUploadDialogOpen(false)}
      />
    </Grid>
  );
};

export default Plan;
