import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Grid, Tab } from "@mui/material";
import { useState } from "react";
import UsersManager from "../components/UsersManager";
import WithRole from "../components/wrappers/WithRole";
import { USER_ROLE_ADMIN } from "../constants/account.constants";

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
              <WithRole roles={[USER_ROLE_ADMIN]}>
                <Tab iconPosition="start" label="Company" value="tab-company" />
              </WithRole>
              <Tab iconPosition="start" label="Users" value="tab-users" />
            </TabList>
          </Box>
          <TabPanel value="tab-company">
            {/* <CompanyForm /> */}
            <p>:P</p>
          </TabPanel>
          <TabPanel value="tab-users">
            <UsersManager />
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  );
};

export default Settings;
