import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/signin",
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
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(setUser(null));
      }
    });
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
