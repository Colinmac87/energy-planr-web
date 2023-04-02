import { Grid, Stack, TextField, Typography } from "@mui/material";

const meta = [
  {
    group: "Basic Info",
    fieldLabel: "Equipment No",
    fieldTag: "equipmentNo",
  },
  {
    group: "Basic Info",
    fieldLabel: "Location",
    fieldTag: "location",
  },
  {
    group: "Basic Info",
    fieldLabel: "Level",
    fieldTag: "level",
  },
  {
    group: "Basic Info",
    fieldLabel: "Description",
    fieldTag: "description",
  },
  {
    group: "Delivery Assessment",
    fieldLabel: "Type",
    fieldTag: "type",
  },
  {
    group: "Delivery Assessment",
    fieldLabel: "Run Status",
    fieldTag: "runStatus",
  },
  {
    group: "Maintenance",
    fieldLabel: "Temporary Repair",
    fieldTag: "temporaryRepair",
  },
  {
    group: "Maintenance",
    fieldLabel: "Repair Type",
    fieldTag: "repairType",
  },
  {
    group: "Other",
    fieldLabel: "Random Data",
    fieldTag: "data",
  },
];

const EquipmentDataForm = ({ data }) => {
  const formMetaFieldsByGroup = meta.reduce((groups, item) => {
    const group = groups[item.group] || [];
    group.push(item);
    groups[item.group] = group;
    return groups;
  }, {});

  let formMetaGroupsArr = [];
  for (const group in formMetaFieldsByGroup) {
    formMetaGroupsArr.push({
      group: group,
      fields: formMetaFieldsByGroup[group],
    });
  }

  return formMetaGroupsArr.map((group) => {
    return (
      <Stack spacing={1}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h6">{group.group}</Typography>
          </Grid>
          {group.fields.map((field, i) => (
            <Grid item xs={6}>
              <TextField
                id={`field-${i}`}
                label={field.fieldLabel}
                variant="filled"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                value={data[field.fieldTag]}
              />
            </Grid>
          ))}
        </Grid>
        <br />
      </Stack>
    );
  });
};

export default EquipmentDataForm;
