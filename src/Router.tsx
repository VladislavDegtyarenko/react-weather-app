// React Router
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Main Components
import App from "./App";
import CityPage from "./routes/CityPage";
import AddCityModal from "./components/AddCityModal";

function Router() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: <CityPage />,
        },
        {
          path: ":id",
          element: <CityPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Router;
