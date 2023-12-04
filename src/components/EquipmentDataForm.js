import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
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
import WithDataField from "./dataUI/WithDataField";
import { LoadingButton } from "@mui/lab";
import EquipmentFilesForm from "./EquipmentFilesForm";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { fromSecs, withFormat } from "../utils/date.utils";
import EquipmentPinForm from "./EquipmentPinForm";
import { canEdit } from "../constants/account.constants";

const EquipmentDataForm = ({
  tab = "data",
  register,
  data,
  onSaving,
  onSave,
  onClose,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { asset } = useSelector((state) => state.asset);
  const { user } = useSelector((state) => state.account);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    JSON.parse(JSON.stringify(data || {}))
  );
  const [selectedTab, setSelectedTab] = useState(tab);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isEditable = canEdit(user.role);

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
      updateData(formData.id, formData, {
        defaultField: register.formFields.find((r) => r.isDefault == true)?.key,
      })
        .then(() => {
          enqueueSnackbar("Changes saved", { variant: "success" });
          onSave();
        })
        .catch((error) => {
          enqueueSnackbar("Unable to save changes: " + error, {
            variant: "error",
          });
        })
        .finally(() => setLoading(false));
    } else {
      createData(register.assetId, register.id, formData, {
        defaultField: register.formFields.find((r) => r.isDefault == true)?.key,
      })
        .then((dataId) => {
          if (dataId) {
            enqueueSnackbar("New data created", { variant: "success" });
            onSave();
          } else {
            enqueueSnackbar(
              "Unable to create data, please try again or contact us",
              { variant: "error" }
            );
          }
        })
        .catch((error) => {
          enqueueSnackbar(error, { variant: "error" });
        })
        .finally(() => setLoading(false));
    }
  };

  const handleDelete = () => {
    setLoading(true);

    deleteData(formData.id)
      .then(() => {
        enqueueSnackbar("Data deleted", { variant: "success" });
        onSave();
        onClose();
      })
      .catch(() => {
        enqueueSnackbar("Unable to delete, please try again or contact us", {
          variant: "error",
        });
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
          <Tab label="Pin" value="pin" />
        </TabList>
      );
    return (
      <TabList onChange={onTabChange} aria-label="Asset Tabs">
        <Tab label="Data" value="data" />
      </TabList>
    );
  };

  return (
    <Box
      sx={{
        p: 3,
        flex: 1,
        height: "100%",
        overflow: "auto",
      }}
    >
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

        <TabPanel value="data" sx={{ p: 0, pt: 2 }}>
          <Box component={"form"} onSubmit={handleSubmit} noValidate>
            <Stack spacing={0}>
              {formGroups
                .filter((group) => group.hasFields == true)
                .map((group) => (
                  <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="h6">{group.name}</Typography>
                      </Grid>
                      {register.formFields
                        .filter((field) => field.group == (group.key || "none"))
                        .map((field, i) =>
                          isEditable ? (
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
                  </Paper>
                ))}
              <Stack
                sx={{ flexDirection: "row", justifyContent: "space-between" }}
              >
                {formData.xCreatedBy && (
                  <Typography variant="caption">
                    Created by {formData.xCreatedBy?.fullName}, on{" "}
                    {withFormat(fromSecs(formData.xCreatedAt?.seconds))}
                  </Typography>
                )}
                {formData.xUpdatedBy && (
                  <Typography variant="caption">
                    Modified by {formData.xUpdatedBy?.fullName}, on{" "}
                    {withFormat(fromSecs(formData.xUpdatedAt?.seconds))}
                  </Typography>
                )}
              </Stack>
              <Divider sx={{ mt: 2, mb: 3 }} />
              <Stack flexDirection={"row"} justifyContent={"space-between"}>
                <Stack flexDirection={"row"} gap={6}>
                  {/* <Button
                    variant="outlined"
                    disabled={loading}
                    onClick={onClose}
                  >
                    Cancel
                  </Button> */}
                </Stack>
                <Stack flexDirection={"row"} gap={6}>
                  {/* {isEditable && formData?.id && (
                    <Button
                      variant="outlined"
                      disabled={loading}
                      onClick={() => setIsDeleteDialogOpen(true)}
                      color="error"
                    >
                      Delete
                    </Button>
                  )} */}
                  <Stack flexDirection={"row"} gap={6}>
                    <Button
                      variant="outlined"
                      disabled={loading}
                      onClick={onClose}
                      sx={{ minWidth: 128 }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                  {isEditable && (
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={loading}
                      sx={{ minWidth: 128 }}
                    >
                      Save
                    </LoadingButton>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </TabPanel>
        <TabPanel value="files" sx={{ p: 0, pt: 2 }}>
          <EquipmentFilesForm dataId={formData.id} type={FIELD_FILE} />
        </TabPanel>
        <TabPanel value="images" sx={{ p: 0, pt: 2 }}>
          <EquipmentFilesForm dataId={formData.id} type={FIELD_IMAGE} />
        </TabPanel>
        <TabPanel value="pin" sx={{ p: 0, pt: 2 }}>
          <EquipmentPinForm data={formData} />
        </TabPanel>
      </TabContext>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Are you sure you want to delete this data permanently?
        </DialogTitle>
        <DialogActions>
          <Button
            disabled={loading}
            onClick={() => setIsDeleteDialogOpen(false)}
          >
            Cancel
          </Button>
          <LoadingButton loading={loading} onClick={handleDelete} color="error">
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EquipmentDataForm;
