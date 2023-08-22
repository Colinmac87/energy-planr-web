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
  IconButton,
  useTheme,
} from "@mui/material";
import { AccountCircle, DarkMode, LightMode } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../services/auth.service";
import { toggleColorMode } from "../features/system.slice";

const AdminDashboardLayout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

  const { colorMode } = useSelector((state) => state.system);
  const { loginAttempted, user } = useSelector((state) => state.account);

  useEffect(() => {
    if (loginAttempted && !user) navigate("/admin/signin");
  }, [loginAttempted]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickSignout = () => {
    handleClose();
    signOut().then(() => {
      navigate("/admin/signin");
    });
  };

  if (!loginAttempted || !user) return null;

  return (
    <Box sx={{ display: "flex", flex: 1 }}>
      <AppBar
        position="absolute"
        open={true}
        elevation={6}
        sx={{
          height: 60,
          bgcolor: theme.palette.background.default,
        }}
      >
        <Toolbar
          sx={{
            height: 60,
            bgcolor: theme.palette.background.default,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              flexDirection: "row",
              gap: 2,
              alignItems: "center",
              colorScheme: "light",
              bgcolor: theme.palette.background.default,
            }}
          >
            <Link href={`/admin`} underline="none">
              <Typography
                component="h1"
                variant="h5"
                sx={{
                  display: "inline-block",
                  fontWeight: "bold",
                  position: "relative",
                  left: -8,
                }}
              >
                Energy Planr
              </Typography>
            </Link>
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
              sx={{ textTransform: "capitalize" }}
            >
              Admin
            </Button>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              keepMounted
            >
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

export default AdminDashboardLayout;
