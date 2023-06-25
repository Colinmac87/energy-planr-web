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
import { FIELD_FILE, FIELD_IMAGE } from "../constants/form.constants";
import { createData, deleteData, updateData } from "../services/data.service";
import { alertError, alertSuccess } from "../utils/alert.utils";
import WithDataField from "./dataUI/WithDataField";
import { LoadingButton } from "@mui/lab";
import EquipmentFilesForm from "./EquipmentFilesForm";
import { useSelector } from "react-redux";

const EquipmentDataForm = ({ register, data, onSaving, onSave, onClose }) => {
  const { asset } = useSelector((state) => state.asset);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    JSON.parse(JSON.stringify(data || {}))
  );
  const [selectedTab, setSelectedTab] = useState("data");

  const canEdit = true;

  const formGroups = [
    {
      hasFields:
        register.formFields.findIndex((field) => field.group == "none") >= 0,
    },
    ...register.formGroups.map((group) => ({
      ...group,
      hasFields:
        register.formFields.findIndex((field) => field.group == group.key) >= 0,
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

  const handleDelete = () => {
    setLoading(true);

    deleteData(formData.id)
      .then(() => {
        alertSuccess("Data deleted.");
        onSave();
        onClose();
      })
      .catch(() => {
        alertError("Unable to delete, please try again or contact us.");
      })
      .finally(() => setLoading(false));
  };

  const renderTabs = () => {
    if (formData?.id)
      return (
        <TabList onChange={onTabChange} aria-label="Asset Tabs">
          <Tab label="Data" value="data" />
          <Tab label="Files" value="files" />
          <Tab label="Images" value="images" />
        </TabList>
      );
    return (
      <TabList onChange={onTabChange} aria-label="Asset Tabs">
        <Tab label="Data" value="data" />
      </TabList>
    );
  };

  return (
    <Box sx={{ height: "100%" }}>
      <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {asset.name} - {register.name}
        </Typography>
        <IconButton onClick={onClose}>
          <Close fontSize="large" />
        </IconButton>
      </Stack>
      <TabContext value={selectedTab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          {renderTabs()}
        </Box>

        <TabPanel value="data">
          <Box component={"form"} onSubmit={handleSubmit} noValidate>
            <Stack spacing={0}>
              {formGroups
                .filter((group) => group.hasFields == true)
                .map((group) => (
                  <Paper sx={{ marginBottom: 2, padding: 2 }}>
                    <Stack spacing={1}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="h6">{group.name}</Typography>
                        </Grid>
                        {register.formFields
                          .filter(
                            (field) => field.group == (group.key || "none")
                          )
                          .map((field, i) =>
                            canEdit ? (
                              <WithFormField
                                key={i}
                                field={field}
                                value={formData[field.key] || null}
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
                  <Button
                    variant="outlined"
                    disabled={loading}
                    onClick={onClose}
                  >
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
          <EquipmentFilesForm dataId={formData.id} type={FIELD_FILE} />
        </TabPanel>
        <TabPanel value="images">
          <EquipmentFilesForm dataId={formData.id} type={FIELD_IMAGE} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default EquipmentDataForm;
