import { TabContext, TabList, TabPanel } from "@mui/lab";
import FormFieldsManager from "./FormFieldsManager";
import FormGroupsManager from "./FormGroupsManager";
import { GroupWork, TextFields } from "@mui/icons-material";
import { Box, Grid, Tab } from "@mui/material";
import { useState } from "react";

const FormManager = ({ asset, onSave }) => {
  const [selectedTab, setSelectedTab] = useState("fields-manager");

  const onTabChange = (e, v) => {
    setSelectedTab(v);
  };

  return (
    <Grid container spacing={1}>
      <TabContext value={selectedTab}>
        <Grid item sm={2}>
          <Box>
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
        <Grid item sm={10}>
          <TabPanel value="fields-manager">
            <FormFieldsManager asset={asset} onSave={onSave} />
          </TabPanel>
          <TabPanel value="groups-manager">
            <FormGroupsManager asset={asset} onSave={onSave} />
          </TabPanel>
        </Grid>
      </TabContext>
    </Grid>
  );
};

export default FormManager;
