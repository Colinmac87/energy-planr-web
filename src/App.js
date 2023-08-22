import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Asset from "./pages/Asset";
import DashboardLayout from "./layout/DashboardLayout";
import Settings from "./pages/Settings";
import SignUp from "./pages/SignUp";
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./features/account.slice";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { getUser } from "./services/user.service";
import {
  Box,
  createTheme,
  CssBaseline,
  Grid,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { SnackbarProvider } from "notistack";

import AdminSignIn from "./admin/pages/SignIn";
import AdminHome from "./admin/pages/Home";
import AdminDashboardLayout from "./layout/AdminDashboardLayout";

const router = createBrowserRouter([
  // Public routes
  {
    path: "/signin/:companyCode?",
    element: <SignIn />,
  },
  // Protected routes
  {
    path: "/",
    element: (
      <DashboardLayout>
        <Home />
      </DashboardLayout>
    ),
  },
  {
    path: "/asset/:id?/:tab?",
    element: (
      <DashboardLayout>
        <Asset />
      </DashboardLayout>
    ),
  },
  {
    path: "/settings",
    element: (
      <DashboardLayout>
        <Settings />
      </DashboardLayout>
    ),
  },
  // Admin Routes
  {
    path: "/admin/signin",
    element: <AdminSignIn />,
  },
  {
    path: "/admin",
    element: (
      <AdminDashboardLayout>
        <AdminHome />
      </AdminDashboardLayout>
    ),
  },
]);

function App() {
  const dispatch = useDispatch();
  const { colorMode } = useSelector((state) => state.system);

  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);

  const isLightTheme = colorMode == "light";
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: colorMode,
          background: {
            paper: isLightTheme ? "#f3f6f9" : "#313131",
            default: isLightTheme ? "#fff" : "#111111",
          },
          primary: {
            main: isLightTheme ? "#2e78f0" : "#2e78f0",
          },
        },
        typography: {
          fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
        },
        shape: {
          borderRadius: 0,
        },
      }),
    [colorMode]
  );

  useEffect(() => {
    window.addEventListener("resize", onWindowWidthChange);

    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        getUser({ uid: firebaseUser.uid }).then((user) => {
          dispatch(setUser(user));
        });
      } else {
        dispatch(setUser(null));
      }
    });
  }, []);

  const onWindowWidthChange = () => {
    setDeviceWidth(window.innerWidth);
  };

  const isDeviceSupported = deviceWidth >= theme.breakpoints.values.md;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isDeviceSupported ? (
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <SnackbarProvider
            autoHideDuration={3500}
            anchorOrigin={{
              horizontal: "center",
              vertical: "top",
            }}
          >
            <RouterProvider router={router} />
          </SnackbarProvider>
        </LocalizationProvider>
      ) : (
        <Grid
          container
          component="main"
          sx={{ height: "100vh", width: "100wh" }}
        >
          <Grid item xs={0} sm={1} md={2}></Grid>
          <Grid item xs={12} sm={10} md={8}>
            <Stack
              sx={{
                height: "100vh",
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Box
                component="form"
                elevation={6}
                sx={{ p: 6, textAlign: "center" }}
              >
                <Typography variant="h2">Device not supported!</Typography>
                <br />
                <Typography variant="subtitle1">
                  For optimal viewing experience we recommend you use this
                  application on a larger screen
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      )}
    </ThemeProvider>
  );
}

export default App;
