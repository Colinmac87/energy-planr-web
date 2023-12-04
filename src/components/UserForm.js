import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { createUser } from "../services/user.service";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { SyncLock } from "@mui/icons-material";
import { generateRandomPassword } from "../utils/string.utils";
import { copyToClipboard } from "../utils/browser.utils";
import { useSelector } from "react-redux";
import {
  USER_ROLE_ADMIN,
  USER_ROLE_MODERATOR,
  USER_ROLE_VIEWER,
} from "../constants/account.constants";

const UserForm = ({ user, onSaving, onSave, onCancel }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { user: currentUser } = useSelector((state) => state.account);

  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName);
  const [role, setRole] = useState(user?.role);
  const [emailAddress, setEmailAddress] = useState(user?.emailAddress);
  const [password, setPassword] = useState(user?.id ? "************" : "");

  const generatePassword = () => {
    const newPassword = generateRandomPassword();
    setPassword(newPassword);
    copyToClipboard(newPassword);
    enqueueSnackbar("Password copied to clipboard", { variant: "info" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    onSaving();

    if (user?.id) {
      //   updateUser(user.id, { fullName })
      //     .then(() => {
      //       enqueueSnackbar("Changes saved", { variant: "success" });
      //       onSave();
      //     })
      //     .catch(() => {
      //       enqueueSnackbar(
      //         "Unable to save changes, please try again or contact us",
      //         { variant: "error" }
      //       );
      //     })
      //     .finally(() => setLoading(false));
    } else {
      createUser(currentUser.companyId, {
        fullName,
        role,
        emailAddress,
        password,
      })
        .then((userId) => {
          if (userId) {
            enqueueSnackbar("New user created", { variant: "success" });
            onSave();
          } else {
            enqueueSnackbar(
              "Unable to create user, please try again or contact us",
              { variant: "error" }
            );
          }
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <Box component={"form"} onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" mb={2}>
            {user?.id ? "Update" : "New"} User
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={"Full Name"}
            variant="outlined"
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              fullWidth
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value={USER_ROLE_ADMIN}>Admin</MenuItem>
              <MenuItem value={USER_ROLE_MODERATOR}>Moderator</MenuItem>
              <MenuItem value={USER_ROLE_VIEWER}>Viewer</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            disabled={user?.id}
            label={"Email Address"}
            variant="outlined"
            fullWidth
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />
        </Grid>
        {!user?.id && (
          <Grid item xs={12}>
            <TextField
              label={"Password"}
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setEmailAddress(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Generate random password">
                      <IconButton onClick={generatePassword} edge="end">
                        <SyncLock />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Stack flexDirection={"row"} justifyContent={"space-between"}>
            {/* <Button variant="outlined" disabled={loading} onClick={onCancel}>
                Cancel
              </Button> */}
            <LoadingButton type="submit" variant="contained" loading={loading}>
              Save
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserForm;
