import {
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const groups = [
  {
    groupLabel: "Basic Info",
  },
  {
    groupLabel: "Delivery Assessment",
  },
  {
    groupLabel: "Maintenance",
  },
  {
    groupLabel: "Other",
  },
];

const FormGroupsManager = () => {
  return (
    <Grid container rowGap={4}>
      <Grid item md={8}>
        <Typography variant="h4">Data Groups</Typography>
      </Grid>
      <Grid item md={4} textAlign={"right"}>
        <Button variant="contained">New Group</Button>
      </Grid>
      {groups.map((group) => (
        <Grid item xs={12}>
          <Paper sx={{ p: 2, pt: 3, mb: 2 }}>
            <Stack gap={2}>
              <TextField
                id={`field-${group.groupLabel}`}
                label={"Group Name"}
                fullWidth
                value={group.groupLabel}
              />
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default FormGroupsManager;
