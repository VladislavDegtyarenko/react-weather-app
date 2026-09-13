import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

// MUI
import { Box } from "@mui/material";

// Main UI Components
import Header from "./components/Header";
import CityPage from "./routes/CityPage";
import NotFoundPage from "./routes/404";
const AddCityModal = lazy(() => import("./components/AddCityModal"));
import { useAppSelector } from "./hooks/reduxHooks";
import { getCityRouteSlug } from "./functions/cityRoute";

function App() {
  const cities = useAppSelector((state) => state.weather.cities);
  const firstCity = cities[0];
  const firstCitySlug = firstCity ? getCityRouteSlug(firstCity, cities) : null;

  return (
    <Box sx={{ minHeight: "100svh", bgcolor: "background.paper" }}>
      <Header />
      <Routes>
        {cities.length > 0 && firstCitySlug ? (
          <Route path="/" element={<Navigate to={`/${firstCitySlug}`} replace />} />
        ) : null}
        {cities.length > 0 ? <Route path=":citySlug" element={<CityPage />} /> : null}
        <Route path="*" element={cities.length > 0 ? <NotFoundPage /> : <CityPage />} />
      </Routes>
      <AddCityModal />
    </Box>
  );
}

export default App;
