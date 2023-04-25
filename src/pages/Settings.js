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
import { Delete } from "@mui/icons-material";


const Settings = () => {
  const [selectedTab, setSelectedTab] = useState("tab-users");

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
          <TabPanel value="tab-groups">
            
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  );
};

export default Settings;
