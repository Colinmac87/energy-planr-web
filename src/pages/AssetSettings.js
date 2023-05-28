import { TabContext, TabList, TabPanel } from "@mui/lab";
import { GroupWork, Layers, Settings, TextFields } from "@mui/icons-material";
import { Box, Grid, Tab } from "@mui/material";
import { useState } from "react";
import FormFieldsManager from "../components/FormFieldsManager";
import FormGroupsManager from "../components/FormGroupsManager";
import LevelsManager from "../components/LevelsManager";
import AssetForm from "../components/AssetForm";

const AssetSettings = ({ asset, onSave, onDelete }) => {
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
              <br />
              <Tab
                icon={<Layers />}
                iconPosition="start"
                label="Locations"
                value="locations-manager"
              />
              <br />

              <Tab
                icon={<Settings />}
                iconPosition="start"
                label="Asset Settings"
                value="settings"
              />
            </TabList>
          </Box>
        </Grid>
        <Grid item sm={1}></Grid>
        <Grid item sm={8}>
          <TabPanel value="fields-manager">
            <FormFieldsManager asset={asset} onSave={onSave} />
          </TabPanel>
          <TabPanel value="groups-manager">
            <FormGroupsManager asset={asset} onSave={onSave} />
          </TabPanel>
          <TabPanel value="locations-manager">
            <LevelsManager />
          </TabPanel>
          <TabPanel value="settings">
            <AssetForm
              asset={asset}
              onSaving={() => {}}
              onSave={onSave}
              onDelete={onDelete}
            />
          </TabPanel>
        </Grid>
      </TabContext>
    </Grid>
  );
};

export default AssetSettings;
