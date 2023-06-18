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
import { createData, updateData } from "../services/data.service";
import { alertError, alertSuccess } from "../utils/alert.utils";
import WithDataField from "./dataUI/WithDataField";
import { LoadingButton } from "@mui/lab";

const EquipmentDataForm = ({ register, data, onSaving, onSave, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    JSON.parse(JSON.stringify(data || {}))
  );
  const [selectedTab, setSelectedTab] = useState("data");

  const canEdit = true;

  const formGroups = [
    {
      name: "",
      fields: register.formFields.filter((field) => field.group == "none"),
    },
    ...register.formGroups.map((group) => ({
      ...group,
      fields: register.formFields.filter((field) => field.group == group.key),
    })),
  ];

  const onTabChange = (e, v) => {
    setSelectedTab(v);
  };

  const onChangeFormData = (property, value) => {
    const formDataCopy = JSON.parse(JSON.stringify(formData));
    formDataCopy[property] = value;
    setFormData(formDataCopy);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaving();
    setLoading(true);

    if (formData?.id) {
      updateData(formData.id, formData)
        .then(() => {
          alertSuccess("Changes saved.");
          onSave();
        })
        .catch(() => {
          alertError("Unable to save changes, please try again or contact us.");
        })
        .finally(() => setLoading(false));
    } else {
      createData(register.assetId, register.id, formData)
        .then((dataId) => {
          if (dataId) {
            alertSuccess("New data created.");
            onSave();
          } else {
            alertError(
              "Unable to create data, please try again or contact us."
            );
          }
        })
        .finally(() => setLoading(false));
    }
  };

  const handleDelete = () => {};

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
        <Box component={"form"} onSubmit={handleSubmit} noValidate>
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
                      {group.fields.map((field, i) =>
                        canEdit ? (
                          <WithFormField
                            key={i}
                            field={field}
                            value={formData?.id ? formData[field.key] : null}
                            onChange={(v) => onChangeFormData(field.key, v)}
                          />
                        ) : (
                          <WithDataField
                            key={i}
                            field={field}
                            value={formData[field.key]}
                          />
                        )
                      )}
                    </Grid>
                    <br />
                  </Stack>
                </Paper>
              ))}
            <Divider sx={{ mb: 3 }} />
            <Stack flexDirection={"row"} justifyContent={"space-between"}>
              <Stack flexDirection={"row"} gap={6}>
                <Button variant="outlined" disabled={loading} onClick={onClose}>
                  Cancel
                </Button>
                {canEdit && formData?.id && (
                  <Button
                    variant="outlined"
                    disabled={loading}
                    onClick={handleDelete}
                    color="error"
                  >
                    Delete
                  </Button>
                )}
              </Stack>
              {canEdit && (
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={loading}
                >
                  Save
                </LoadingButton>
              )}
            </Stack>
          </Stack>
        </Box>
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
