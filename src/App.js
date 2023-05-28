import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Asset from "./pages/Asset";
import DashboardLayout from "./layout/DashboardLayout";
import Settings from "./pages/Settings";
import SignUp from "./pages/SignUp";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { setUser } from "./features/account.slice";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { getUser } from "./services/user.service";

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
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <RouterProvider router={router} />
    </LocalizationProvider>
  );
}

export default App;
