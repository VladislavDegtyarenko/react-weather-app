// React Router
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Main Components
import App from "./App";
import CityPage from "./routes/CityPage";
import AddCityModal from "./components/AddCityModal";

const BASE_URL = "/react-weather-app/";

function Router() {
  const router = createBrowserRouter(
    [
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
    ],
    { basename: BASE_URL }
  );

  return <RouterProvider router={router} />;
}

export default Router;
