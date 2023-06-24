import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Asset from "./pages/Asset";
import DashboardLayout from "./layout/DashboardLayout";
import Settings from "./pages/Settings";
import SignUp from "./pages/SignUp";
import { useEffect, useMemo } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./features/account.slice";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { getUser } from "./services/user.service";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/signin/:companyCode?",
    element: <SignIn />,
  },
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
]);

function App() {
  const dispatch = useDispatch();
  const { colorMode } = useSelector((state) => state.system);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: colorMode,
        },
        typography: {
          fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
        },
      }),
    [colorMode]
  );

  useEffect(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        getUser({ uid: firebaseUser.uid }).then((user) =>
          dispatch(setUser(user))
        );
      } else {
        dispatch(setUser(null));
      }
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <RouterProvider router={router} />
      </LocalizationProvider>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
