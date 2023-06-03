import React from "react";
import ReactDOM from "react-dom/client";
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
import Router from "./Router";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MUIProvider>
      <ReduxProvider store={store}>
        <Router />
      </ReduxProvider>
    </MUIProvider>
  </React.StrictMode>
);
