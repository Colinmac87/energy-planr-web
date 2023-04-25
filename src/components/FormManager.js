import { TabContext, TabList, TabPanel } from "@mui/lab";
import FormFieldsManager from "./FormFieldsManager";
import FormGroupsManager from "./FormGroupsManager";
import { GroupWork, TextFields } from "@mui/icons-material";
import { Box, Grid, Tab } from "@mui/material";
import { useState } from "react";

const FormManager = () => {
  const [selectedTab, setSelectedTab] = useState("fields-manager");

  const onTabChange = (e, v) => {
    setSelectedTab(v);
  };

  return (
    <Grid container spacing={1}>
      <TabContext value={selectedTab}>
        <Grid item md={1}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={onTabChange}
              aria-label="Asset Tabs"
              orientation="vertical"
            >
              <Tab
                icon={<TextFields />}
                iconPosition="start"
                label="Fields"
                value="fields-manager"
              />
              <Tab
                icon={<GroupWork />}
                iconPosition="start"
                label="Groups"
                value="groups-manager"
              />
            </TabList>
          </Box>
        </Grid>
        <Grid item md={11}>
          <TabPanel value="fields-manager">
            <FormFieldsManager />
          </TabPanel>
          <TabPanel value="groups-manager">
            <FormGroupsManager />
          </TabPanel>
        </Grid>
      </TabContext>
    </Grid>
  );
};

export default FormManager;
