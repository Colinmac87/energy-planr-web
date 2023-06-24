import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Link,
  MenuItem,
  Menu,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import { AccountCircle, DarkMode, LightMode } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../services/auth.service";
import { setUser } from "../features/account.slice";
import { toggleColorMode } from "../features/system.slice";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

  const { colorMode } = useSelector((state) => state.system);
  const { loginAttempted, user } = useSelector((state) => state.account);
  const { asset } = useSelector((state) => state.asset);

  useEffect(() => {
    if (loginAttempted && !user) navigate("/signin");
  }, [loginAttempted]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickSettings = () => {
    handleClose();
    navigate("/settings");
  };

  const onClickSignout = () => {
    handleClose();
    signOut().then(() => {
      dispatch(setUser(null));
      navigate("/signin");
    });
  };

  if (!loginAttempted || !user) return null;

  return (
    <Box sx={{ display: "flex", flex: 1 }}>
      <AppBar position="absolute" open={true}>
        <Toolbar
          sx={
            {
              // pr: "24px", // keep right padding when drawer closed
            }
          }
        >
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              flexDirection: "row",
              gap: 2,
              alignItems: "center",
            }}
          >
            <Link href={`/`} underline="none" color="inherit">
              <Typography
                component="h1"
                variant="h5"
                sx={{ display: "inline-block", fontWeight: "bold" }}
              >
                Energy Planr
              </Typography>
            </Link>
            {asset && (
              <Stack flexDirection={"row"} alignItems={"center"} gap={2}>
                <Typography variant="subtitle1" ml={2} mr={2}>
                  |
                </Typography>
                <Typography variant="h6" mr={4}>
                  {asset.name}
                </Typography>
              </Stack>
            )}
          </Box>
          <Box>
            <IconButton
              sx={{ mr: 4 }}
              onClick={() => dispatch(toggleColorMode())}
            >
              {colorMode == "dark" ? <LightMode /> : <DarkMode />}
            </IconButton>
            <Button
              size="large"
              endIcon={<AccountCircle />}
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              sx={{ textTransform: "capitalize" }}
            >
              {user.fullName}
            </Button>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={onClickSettings}>Settings</MenuItem>
              <MenuItem onClick={onClickSignout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          width: "100wh",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Toolbar />
        <Box
          component="main"
          sx={{
            display: "flex",
            flex: 1,
            flexGrow: 1,
            position: "relative",
            m: 0,
            p: 0,
            overflow: "auto",
            // alignItems: "flex-start",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
