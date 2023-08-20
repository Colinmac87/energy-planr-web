import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Grid, Tab } from "@mui/material";
import { useState } from "react";
import UsersManager from "../components/UsersManager";

const Settings = () => {
  const [selectedTab, setSelectedTab] = useState("tab-users");

  const onTabChange = (e, v) => {
    setSelectedTab(v);
  };

  return (
    <Grid container xs={12}>
      <Grid item xs={12}>
        <TabContext value={selectedTab}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={onTabChange} aria-label="Asset Tabs">
              <Tab iconPosition="start" label="Users" value="tab-users" />
            </TabList>
          </Box>
          <TabPanel value="tab-users">
            <UsersManager />
          </TabPanel>
          {/* <TabPanel value="tab-groups"></TabPanel> */}
        </TabContext>
      </Grid>
    </Grid>
  );
};

export default Settings;
