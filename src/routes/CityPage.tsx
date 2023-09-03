// Core
import { useEffect } from "react";
import styled from "@emotion/styled";
import { fetchForecastData, fetchWeatherData } from "../store/weatherSlice";
import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";
import { openModal } from "../store/modalReducer";

// MUI
import { Box, Typography, Button } from "@mui/material";

// Router
import { useParams } from "react-router-dom";

// Main Components
import PageWrapper from "../ui/PageWrapper";
import FiveDaysForecast from "../components/CityPage/FiveDaysForecast";
import MainCard from "../components/CityPage/MainCard/MainCard";
import SunTimes from "../components/CityPage/SunTimes";
import Heading from "../components/CityPage/Heading";
import ForecastChart from "../components/CityPage/ForecastChart";

// Types
import { City } from "../types/types";

const ChartWrapper = styled("div")({
  width: "100%",
  height: "300px",
  canvas: {
    width: "100% !important",
    height: "100% !important",
    aspectRatio: "unset",
  },
});

const CityPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const handleOpenModal = () => dispatch(openModal());

  const cities: City[] = useAppSelector((state) => state.weather.cities);

  const currentCity: City = cities.find((city) => String(city.id) === id)! || cities[0];

  const city = currentCity?.city || "";
  const country = currentCity?.country || "";
  const latitude = currentCity?.latitude || 0;
  const longitude = currentCity?.longitude || 0;
  const cityId = id ? parseInt(id) : -1;

  // Data
  const weatherData = currentCity.weatherData;
  const hourlyForecastData = currentCity.forecastData;

  useEffect(() => {
    if (!weatherData) {
      dispatch(fetchWeatherData({ cityId, latitude, longitude }));
    }

    if (!hourlyForecastData) {
      dispatch(fetchForecastData({ cityId, latitude, longitude }));
    }
  }, [weatherData, hourlyForecastData, cityId]);

  if (!cities || cities.length === 0) {
    return (
      <PageWrapper sx={{ alignItems: "center", height: "calc(100svh - 4em)" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            flexGrow: 1,
            width: "25em",
            height: "100%",
            maxWidth: "100%",
          }}
        >
          <Typography variant="h6" textAlign="center">
            No Cities Found
          </Typography>
          <Typography variant="body2" textAlign="center">
            Enhance your weather experience by adding a city and stay up-to-date with the
            latest forecasts!
          </Typography>
          <Button
            variant="outlined"
            sx={{ color: "text.primary" }}
            startIcon={<Typography variant="body1">+</Typography>}
            onClick={handleOpenModal}
          >
            Add new city
          </Button>
        </Box>
      </PageWrapper>
    );
  }

  if (!weatherData || !hourlyForecastData) {
    return (
      <PageWrapper>
        <Typography variant="subtitle1" textAlign="center">
          Loading...
        </Typography>
      </PageWrapper>
    );
  }

  const userTimezoneShift = new Date().getTimezoneOffset() * 1000 * 60; // from UTC
  const cityTimezoneShift = weatherData.timezone * 1000; // from UTC
  const timezoneShift = userTimezoneShift + cityTimezoneShift;

  const currentTime = new Date(weatherData.dt * 1000 + timezoneShift);
  const sunriseTime = new Date(weatherData.sys.sunrise * 1000 + timezoneShift);
  const sunsetTime = new Date(weatherData.sys.sunset * 1000 + timezoneShift);

  const isDaytime = currentTime > sunriseTime && currentTime < sunsetTime;

  return (
    <PageWrapper>
      <Heading city={city} country={country} id={currentCity.id} />

      <Box
        display="flex"
        gap={2}
        flexDirection={{ xs: "column", sm: "column", md: "row" }}
      >
        <MainCard
          weatherData={weatherData}
          currentTime={currentTime}
          isDaytime={isDaytime}
        />
        <SunTimes
          sunriseTime={sunriseTime}
          sunsetTime={sunsetTime}
          currentTime={currentTime}
        />
      </Box>

      <FiveDaysForecast hourlyForecastData={hourlyForecastData} />

      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{ textTransform: "uppercase" }}
      >
        24-hour forecast
      </Typography>

      <ChartWrapper>
        <ForecastChart forecastData={hourlyForecastData.slice(0, 8)} />
      </ChartWrapper>
    </PageWrapper>
  );
};

export default CityPage;
