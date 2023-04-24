import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Tab,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { meta } from "../constants/data.constants";
import { Delete } from "@mui/icons-material";

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

const Settings = () => {
  const [selectedTab, setSelectedTab] = useState("tab-fields");

  const onTabChange = (e, v) => {
    setSelectedTab(v);
  };

  return (
    <Grid container xs={12}>
      <Grid item xs={12}>
        <TabContext value={selectedTab}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={onTabChange} aria-label="Asset Tabs">
              <Tab iconPosition="start" label="Users" value="tab-users" />
              <Tab iconPosition="start" label="Fields" value="tab-fields" />
              <Tab iconPosition="start" label="Groups" value="tab-groups" />
            </TabList>
          </Box>
          <TabPanel value="tab-users">
            <Grid container>
              <Grid item md={8}>
                <Typography variant="h4">Users</Typography>
              </Grid>
              <Grid item md={4} textAlign={"right"}>
                <Button variant="contained">New User</Button>
              </Grid>
            </Grid>
            <br />
            <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
              <List
                sx={{
                  width: "100%",
                  bgcolor: "background.paper",
                }}
              >
                <ListItem
                  secondaryAction={
                    <Stack direction="row" spacing={2}>
                      <FormControl>
                        <InputLabel>Role</InputLabel>
                        <Select
                          sx={{ width: 120 }}
                          size="small"
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={"admin"}
                          label="Role"
                        >
                          <MenuItem value={"admin"}>Admin</MenuItem>
                          <MenuItem value={"user"}>User</MenuItem>
                        </Select>
                      </FormControl>
                      <IconButton edge="end" aria-label="delete">
                        <Delete />
                      </IconButton>
                    </Stack>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>AK</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Colin Mac"
                    secondary="colinmac@gmail.com"
                  />
                </ListItem>
                <Divider />
                <ListItem
                  secondaryAction={
                    <Stack direction="row" spacing={2}>
                      <FormControl>
                        <InputLabel>Role</InputLabel>
                        <Select
                          sx={{ width: 120 }}
                          size="small"
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={"user"}
                          label="Role"
                        >
                          <MenuItem value={"admin"}>Admin</MenuItem>
                          <MenuItem value={"user"}>User</MenuItem>
                        </Select>
                      </FormControl>
                      <IconButton edge="end" aria-label="delete">
                        <Delete />
                      </IconButton>
                    </Stack>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>MO</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Mo Sherry"
                    secondary="shaharyar.ms@outlook.com"
                  />
                </ListItem>
              </List>
            </Box>
          </TabPanel>
          <TabPanel value="tab-fields">
            <Grid container>
              <Grid item md={8}>
                <Typography variant="h4">Data Fields</Typography>
              </Grid>
              <Grid item md={4} textAlign={"right"}>
                <Button variant="contained">New Field</Button>
              </Grid>
            </Grid>
            <br />

            {meta.map((field) => (
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
            ))}
          </TabPanel>
          <TabPanel value="tab-groups">
            <Grid container>
              <Grid item md={8}>
                <Typography variant="h4">Data Groups</Typography>
              </Grid>
              <Grid item md={4} textAlign={"right"}>
                <Button variant="contained">New Group</Button>
              </Grid>
            </Grid>
            <br />
            {groups.map((group) => (
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
            ))}
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  );
};

export default Settings;
