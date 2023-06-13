import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tab,
  Typography,
} from "@mui/material";

import WithFormField from "./formUI/WithFormField";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Close } from "@mui/icons-material";
import FormFileUploadField from "./formUI/FormFileUploadField";
import DataFileField from "./dataUI/DataFieldField";
import { FIELD_FILES, FIELD_IMAGE } from "../constants/form.constants";

const EquipmentDataForm = ({ asset, data, onSave, onClose }) => {
  const [selectedTab, setSelectedTab] = useState("data");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    JSON.parse(JSON.stringify(data || {}))
  );

  const onTabChange = (e, v) => {
    setSelectedTab(v);
  };

  const formGroups = [
    {
      name: "",
      fields: asset.formFields.filter((field) => field.group == "none"),
    },
    ...asset.formGroups.map((group) => ({
      ...group,
      fields: asset.formFields.filter((field) => field.group == group.key),
    })),
  ];

  return (
    <TabContext value={selectedTab}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TabList onChange={onTabChange} aria-label="Asset Tabs">
            <Tab label="Data" value="data" />
            <Tab label="Files" value="files" />
            <Tab label="Images" value="images" />
          </TabList>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
      </Box>

      <TabPanel value="data">
        <Stack spacing={0}>
          {formGroups
            .filter((group) => group.fields.length > 0)
            .map((group) => (
              <Paper sx={{ marginBottom: 2, padding: 2 }}>
                <Stack spacing={1}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6">{group.name}</Typography>
                    </Grid>
                    {group.fields.map((field, i) => (
                      <WithFormField
                        key={i}
                        field={field}
                        onChange={(v) => {
                          console.log(v);
                        }}
                      />
                    ))}
                  </Grid>
                  <br />
                </Stack>
              </Paper>
            ))}
          <Divider sx={{ mb: 3 }} />
          <Stack spacing={2} direction={"row"} justifyContent={"flex-end"}>
            <Button variant="outlined" onClick={onClose}>
              Close
            </Button>
            <Button variant="contained">Save</Button>
          </Stack>
        </Stack>
      </TabPanel>
      <TabPanel value="files">
        <Grid container gap={2}>
          <Grid item xs={12}>
            <Paper>
              <FormFileUploadField onChange={() => {}} />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <DataFileField field={{ type: FIELD_FILES }} />
          </Grid>
          <Grid item xs={12}>
            <DataFileField field={{ type: FIELD_FILES }} />
          </Grid>
          <Grid item xs={12}>
            <DataFileField field={{ type: FIELD_FILES }} />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value="images">
        <Grid container gap={2}>
          <Grid item xs={12}>
            <Paper>
              <FormFileUploadField onChange={() => {}} />
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <DataFileField field={{ type: FIELD_IMAGE }} />
          </Grid>
          <Grid item xs={3}>
            <DataFileField field={{ type: FIELD_IMAGE }} />
          </Grid>
          <Grid item xs={3}>
            <DataFileField field={{ type: FIELD_IMAGE }} />
          </Grid>
        </Grid>
      </TabPanel>
    </TabContext>
  );
};

export default EquipmentDataForm;
