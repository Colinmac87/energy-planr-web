import { ArrowDownward, ArrowUpward, Delete, Edit } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
// import UserForm from "./UserForm";
import { useEffect, useState } from "react";
import {
  //   deleteUser,
  getUsers,
  getUsersByCompany,
  updateUserRole,
  updateUsersOrder,
} from "../services/user.service";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import {
  USER_ROLE_ADMIN,
  USER_ROLE_MODERATOR,
  USER_ROLE_VIEWER,
  isAdmin,
} from "../constants/account.constants";
import { getNameInitials } from "../utils/string.utils";
import UserForm from "./UserForm";

const UsersManager = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { user: currentUser } = useSelector((state) => state.account);

  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isUserDeleteDialogOpen, setIsUserDeleteDialogOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [contextUser, setContextUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    getUsersByCompany(currentUser.companyId).then((data) => setUsers(data));
  };

  const handleUserRoleChange = (id, role) => {
    updateUserRole(id, role).then(() => {
      loadUsers();
      enqueueSnackbar("User role saved", { variant: "success" });
    });
  };

  const handleDeleteUser = () => {
    // deleteUser(contextUser.id)
    //   .then(() => {
    //     loadUsers();
    //     enqueueSnackbar("User deleted", { variant: "success" });
    //     onCloseUserDeleteDialogOpen();
    //   })
    //   .catch(() => {
    //     enqueueSnackbar(
    //       "Unable to delete user, please try again or contact us",
    //       { variant: "error" }
    //     );
    //     onCloseUserDeleteDialogOpen();
    //   });
  };

  const onCloseUserForm = () => {
    setContextUser(null);
    setIsUserFormOpen(false);
  };

  const onCloseUserDeleteDialogOpen = () => {
    setContextUser(null);
    setIsUserDeleteDialogOpen(false);
  };

  return (
    <Grid
      container
      rowGap={4}
      sx={{
        alignContent: "flex-start",
      }}
    >
      <Grid item md={8}>
        <Typography variant="h4">Users</Typography>
      </Grid>
      <Grid item md={4} textAlign={"right"}>
        <Button
          disabled={!isAdmin(currentUser.role)}
          variant="contained"
          onClick={() => {
            setContextUser(null);
            setIsUserFormOpen(true);
          }}
        >
          New User
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
            }}
          >
            {users.map((user, i) => (
              <>
                {i > 0 && <Divider />}
                <ListItem
                  secondaryAction={
                    <Stack
                      direction="row"
                      spacing={4}
                      sx={{ alignItems: "center" }}
                    >
                      {!isAdmin(currentUser.role) ? (
                        <Typography variant="overline">{user.role}</Typography>
                      ) : (
                        <FormControl sx={{ mr: 2 }}>
                          <InputLabel>Role</InputLabel>
                          <Select
                            sx={{ width: 160 }}
                            size="small"
                            value={user.role}
                            label="Role"
                            onChange={(e) =>
                              handleUserRoleChange(user.id, e.target.value)
                            }
                          >
                            <MenuItem value={USER_ROLE_ADMIN}>Admin</MenuItem>
                            <MenuItem value={USER_ROLE_MODERATOR}>
                              Moderator
                            </MenuItem>
                            <MenuItem value={USER_ROLE_VIEWER}>Viewer</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                      <IconButton
                        disabled={!isAdmin(currentUser.role)}
                        edge="end"
                        aria-label="edit"
                        onClick={() => {
                          setContextUser(user);
                          setIsUserFormOpen(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        disabled={!isAdmin(currentUser.role)}
                        edge="end"
                        aria-label="delete"
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>{getNameInitials(user.fullName)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.fullName}
                    secondary={user.emailAddress}
                  />
                </ListItem>
              </>
            ))}
          </List>
        </Box>
      </Grid>

      <Drawer anchor={"right"} open={isUserFormOpen} onClose={onCloseUserForm}>
        <Box
          sx={{
            width: 440,
            flex: 1,
            height: "100%",
            backgroundColor: theme.palette.background.paper,
            p: 2,
          }}
        >
          <UserForm
            user={contextUser}
            onSaving={() => {}}
            onSave={() => {
              onCloseUserForm();
              loadUsers();
            }}
            onCancel={onCloseUserForm}
          />
        </Box>
      </Drawer>

      <Dialog
        open={isUserDeleteDialogOpen}
        onClose={onCloseUserDeleteDialogOpen}
      >
        <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
        <DialogActions>
          <Button onClick={onCloseUserDeleteDialogOpen}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default UsersManager;
