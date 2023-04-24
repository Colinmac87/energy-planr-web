import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Link,
  MenuItem,
  Menu,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

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
    navigate("/signin");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="absolute" open={true}>
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
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
            <Link href={`/`} underline="none">
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                sx={{ display: "inline-block" }}
              >
                Energy Planr
              </Typography>
            </Link>
          </Box>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>

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
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container
          maxWidth="xl"
          sx={{
            mt: 4,
            mb: 4,
            minWidth: "100%",
            height: "100vh",
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
