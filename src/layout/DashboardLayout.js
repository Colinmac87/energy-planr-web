import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
} from "@mui/material";
import { Logout, Menu, Settings } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();

  const onClickHome = () => {
    navigate("/");
  };

  const onClickSettings = () => {
    navigate("/settings");
  };

  const onClickSignout = () => {
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
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            // onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              //   ...(open && { display: "none" }),
            }}
          >
            <Menu />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              flexDirection: "row",
              gap: 2,
              alignItems: "center",
            }}
          >
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              sx={{ display: "inline-block" }}
            >
              Energy Planr
            </Typography>
            <Button variant="Text" onClick={onClickHome}>
              Home
            </Button>
          </Box>
          <IconButton color="inherit" onClick={onClickSettings}>
            <Settings />
          </IconButton>
          <IconButton color="inherit" onClick={onClickSignout}>
            <Logout />
          </IconButton>
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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
