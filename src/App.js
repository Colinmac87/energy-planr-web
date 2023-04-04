import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Asset from "./pages/Asset";
import DashboardLayout from "./layout/DashboardLayout";
import Settings from "./pages/Settings";

const router = createBrowserRouter([
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
    path: "/asset/:id",
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
  return <RouterProvider router={router} />;
}

export default App;
