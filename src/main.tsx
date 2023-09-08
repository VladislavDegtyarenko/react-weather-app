import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// MUI
import MUIProvider from "./MUIProvider";

// Redux
import { Provider as ReduxProvider } from "react-redux";
import store from "./store/store";

// Router
import RouterProvider from "./Router";


createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <MUIProvider>
      <ReduxProvider store={store}>
        <RouterProvider />
      </ReduxProvider>
    </MUIProvider>
  </StrictMode>
);
