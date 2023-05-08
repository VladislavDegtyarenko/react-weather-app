import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import Main from "./routes/Main";
import ErrorPage from "./routes/404";
import DetailsPage from "./routes/DetailsPage";

const BASE_URL = "/react-weather-app/";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Main />,
        },
        {
          path: ":id",
          element: <DetailsPage />,
        },
      ],
    },
  ],
  { basename: BASE_URL }
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
