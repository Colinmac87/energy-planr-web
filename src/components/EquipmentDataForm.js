import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import WithFormField from "./formUI/WithFormField";
import { createData, updateData } from "../services/data.service";
import { alertError, alertSuccess } from "../utils/alert.utils";
import WithDataField from "./dataUI/WithDataField";

const EquipmentDataForm = ({ asset, data, onSaving, onSave, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    JSON.parse(JSON.stringify(data || {}))
  );

  const canEdit = true;

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

  const onChangeFormData = (property, value) => {
    const formDataCopy = JSON.parse(JSON.stringify(formData));
    formDataCopy[property] = value;
    setFormData(formDataCopy);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    onSaving();
    setLoading(true);

    if (data?.id) {
      updateData(data.id, formData)
        .then(() => {
          alertSuccess("Changes saved.");
          onSave();
        })
        .catch(() => {
          alertError("Unable to save changes, please try again or contact us.");
        })
        .finally(() => setLoading(false));
    } else {
      createData(asset.id, formData)
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
                        value={data?.id ? data[field.key] : null}
                        onChange={(v) => onChangeFormData(field.key, v)}
                      />
                    ) : (
                      <WithDataField
                        key={i}
                        field={field}
                        value={data[field.key]}
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
            {canEdit && data?.id && (
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
            <Button type="submit" variant="contained" disabled={loading}>
              Save
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default EquipmentDataForm;
