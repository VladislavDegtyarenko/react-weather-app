import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

// MUI
import { Box } from "@mui/material";

// Main UI Components
import Header from "./components/Header";
import CityPage from "./routes/CityPage";
const AddCityModal = lazy(() => import("./components/AddCityModal"));

function App() {
  return (
    <Box sx={{ minHeight: "100svh", bgcolor: "background.paper" }}>
      <Header />
      <Routes>
        <Route path=":id" element={<CityPage />} />
        <Route path="*" element={<CityPage />} />
      </Routes>
      <AddCityModal />
    </Box>
  );
}

export default App;
