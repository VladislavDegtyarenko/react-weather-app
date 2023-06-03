import { lazy } from "react";
import { Outlet } from "react-router-dom";

// MUI
import { Box } from "@mui/material";

// Main UI Components
import Header from "./components/Header";
// import AddCityModal from "./components/AddCityModal";
const AddCityModal = lazy(() => import("./components/AddCityModal"));

function App() {
  return (
    <Box sx={{ minHeight: "100svh", bgcolor: "background.paper" }}>
      <Header />
      <Outlet />
      <AddCityModal />
    </Box>
  );
}

export default App;
