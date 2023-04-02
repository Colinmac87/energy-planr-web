import { Button, Grid, TextField, Typography } from "@mui/material";

const PlanForm = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Create a new plan</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          id={"plan-name"}
          label={"Plan Name"}
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained">Save</Button>
      </Grid>
    </Grid>
  );
};

export default PlanForm;
