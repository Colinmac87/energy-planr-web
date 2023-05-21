import { useState } from "react";
import { Button, Divider, Grid, Stack, Typography } from "@mui/material";

import WithFormField from "./formUI/WithFormField";

const EquipmentDataForm = ({ asset, data, onSave, onClose }) => {
  const [formData, setFormData] = useState(JSON.parse(JSON.stringify(data)));

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
    <Stack spacing={0}>
      {formGroups
        .filter((group) => group.fields.length > 0)
        .map((group) => (
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
        ))}
      <Divider sx={{ mb: 3 }} />
      <Stack spacing={2} direction={"row"} justifyContent={"space-between"}>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
        <Button variant="contained">Save</Button>
      </Stack>
    </Stack>
  );
};

export default EquipmentDataForm;
