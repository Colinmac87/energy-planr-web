import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { meta } from "../constants/data.constants";

const FormFieldsManager = () => {
  return (
    <Grid container rowGap={4}>
      <Grid item md={8}>
        <Typography variant="h4">Data Fields</Typography>
      </Grid>
      <Grid item md={4} textAlign={"right"}>
        <Button variant="contained">New Field</Button>
      </Grid>
      {meta.map((field) => (
        <Grid item xs={12}>
          <Paper sx={{ p: 2, pt: 3, mb: 2 }}>
            <Stack gap={2}>
              <TextField
                id={`field-${field.fieldTag}`}
                label={"Field/Column Name"}
                fullWidth
                value={field.fieldLabel}
              />
              <FormControl>
                <InputLabel>Group</InputLabel>
                <Select
                  fullWidth
                  id="demo-simple-select"
                  value={"basicInfo"}
                  label="Group"
                >
                  <MenuItem value={"basicInfo"}>Basic Info</MenuItem>
                  <MenuItem value={"deliveryAssessment"}>
                    Delivery Assessment
                  </MenuItem>
                  <MenuItem value={"maintenance"}>Maintenance</MenuItem>
                  <MenuItem value={"other"}>Other</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Visible In Register Table"
              />
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default FormFieldsManager;
