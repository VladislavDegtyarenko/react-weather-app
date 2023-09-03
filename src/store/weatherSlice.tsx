import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import { WEATHER_API_BASE_URL, WEATHER_API_KEY } from "../api/weather";

// Types
import { InitialState, City, WeatherData, ForecastData } from "../types/types";

const LOCAL_STORAGE_KEY = "weatherState";

const DEFAULT_STATE: City[] = [
  {
    id: 126549,
    city: "Los Angeles",
    country: "USA",
    latitude: 34.04735269917587,
    longitude: -118.2716916229172,
  },
  {
    id: 3520102,
    city: "Kyiv",
    country: "Ukraine",
    latitude: 50.45,
    longitude: 30.523611111,
  },
  {
    id: 51185,
    city: "Ubud",
    country: "Indonesia",
    latitude: -8.389712542019078,
    longitude: 115.17302126836792,
  },
  {
    id: 4935,
    city: "Sydney",
    country: "Australia",
    latitude: -33.86785,
    longitude: 151.20732,
  },
];

let initialState: InitialState;

// load state from localStorage if possible
try {
  const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
  initialState = savedState ? JSON.parse(savedState) : { cities: DEFAULT_STATE };
} catch (error) {
  console.error("Error loading weather state from localStorage:", error);
  initialState = { cities: DEFAULT_STATE };
}

// Thunks
export const fetchWeatherData = createAsyncThunk(
  "weather/fetchWeatherData",
  async ({
    cityId,
    latitude,
    longitude,
  }: {
    cityId: number;
    latitude: number;
    longitude: number;
  }) => {
    const response = await axios.get(
      `${WEATHER_API_BASE_URL}/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
    );

    return { cityId, weatherData: response.data };
  }
);

export const fetchForecastData = createAsyncThunk(
  "weather/fetchForecastData",
  async ({
    cityId,
    latitude,
    longitude,
  }: {
    cityId: number;
    latitude: number;
    longitude: number;
  }) => {
    const response = await axios.get(
      `${WEATHER_API_BASE_URL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
    );
    return { cityId, forecastData: response.data.list };
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    addCity: (state, action: PayloadAction<City>) => {
      const city = action.payload;
      if (!city) return;

      state.cities.push(city);
      // localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    },
    removeCity: (state, action: PayloadAction<City["id"]>) => {
      const cityIdToRemove = action.payload;
      const index = state.cities.findIndex((city: City) => city.id === cityIdToRemove);

      if (index !== -1) {
        state.cities.splice(index, 1);
        // localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchWeatherData.fulfilled,
      (
        state,
        action: PayloadAction<{
          cityId: number;
          weatherData: WeatherData;
        }>
      ) => {
        const { cityId, weatherData } = action.payload;

        state.cities = state.cities.map((city) =>
          city.id === cityId ? { ...city, weatherData } : city
        );
      }
    );

    builder.addCase(
      fetchForecastData.fulfilled,
      (
        state,
        action: PayloadAction<{
          cityId: number;
          forecastData: ForecastData;
        }>
      ) => {
        const { cityId, forecastData } = action.payload;

        state.cities = state.cities.map((city) =>
          city.id === cityId ? { ...city, forecastData } : city
        );
      }
    );
  },
});

export const { addCity, removeCity } = weatherSlice.actions;
export default weatherSlice.reducer;
