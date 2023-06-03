import axios from "axios";
import { useState, useEffect } from "react";

/**
 * Custom hook for retrieving weather forecast data from the Weather API.
 *
 * @param latitude - The latitude coordinate.
 * @param longitude - The longitude coordinate.
 * @returns An object containing forecastData, loading, and refreshData.
 *  - forecastData: The weather forecast data.
 *  - loading: A boolean indicating whether the data is being loaded.
 *  - refreshData: A function to re-request the weather data.
 *
 * @example
 * const { forecastData, loading, refreshData } = useForecastData(latitude, longitude);
 *
 * if (loading) {
 *  return <p>Loading...</p>
 * }
 */

import { WEATHER_API_BASE_URL, WEATHER_API_KEY } from "../api/weather";
import { ForecastData } from "../types/types";

const MOCK_FORECAST_DATA = [
  {
    dt: 1685134800,
    main: {
      temp: 17.3,
      feels_like: 17.15,
      temp_min: 17.3,
      temp_max: 17.72,
      pressure: 1004,
      sea_level: 1004,
      grnd_level: 997,
      humidity: 79,
      temp_kf: -0.42,
    },
    weather: [
      {
        id: 803,
        main: "Clouds",
        description: "broken clouds",
        icon: "04n",
      },
    ],
    clouds: {
      all: 59,
    },
    wind: {
      speed: 1.36,
      deg: 8,
      gust: 2.21,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "n",
    },
    dt_txt: "2023-05-26 21:00:00",
  },
  {
    dt: 1685145600,
    main: {
      temp: 17.18,
      feels_like: 16.86,
      temp_min: 16.94,
      temp_max: 17.18,
      pressure: 1008,
      sea_level: 1008,
      grnd_level: 997,
      humidity: 73,
      temp_kf: 0.24,
    },
    weather: [
      {
        id: 803,
        main: "Clouds",
        description: "broken clouds",
        icon: "04n",
      },
    ],
    clouds: {
      all: 61,
    },
    wind: {
      speed: 2.48,
      deg: 334,
      gust: 4.58,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "n",
    },
    dt_txt: "2023-05-27 00:00:00",
  },
  {
    dt: 1685156400,
    main: {
      temp: 15.89,
      feels_like: 15.52,
      temp_min: 15.19,
      temp_max: 15.89,
      pressure: 1012,
      sea_level: 1012,
      grnd_level: 997,
      humidity: 76,
      temp_kf: 0.7,
    },
    weather: [
      {
        id: 803,
        main: "Clouds",
        description: "broken clouds",
        icon: "04d",
      },
    ],
    clouds: {
      all: 68,
    },
    wind: {
      speed: 2.68,
      deg: 345,
      gust: 5.57,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-27 03:00:00",
  },
  {
    dt: 1685167200,
    main: {
      temp: 18.99,
      feels_like: 18.64,
      temp_min: 18.99,
      temp_max: 18.99,
      pressure: 1016,
      sea_level: 1016,
      grnd_level: 997,
      humidity: 65,
      temp_kf: 0,
    },
    weather: [
      {
        id: 802,
        main: "Clouds",
        description: "scattered clouds",
        icon: "03d",
      },
    ],
    clouds: {
      all: 48,
    },
    wind: {
      speed: 4.15,
      deg: 352,
      gust: 5.69,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-27 06:00:00",
  },
  {
    dt: 1685178000,
    main: {
      temp: 22.41,
      feels_like: 22.09,
      temp_min: 22.41,
      temp_max: 22.41,
      pressure: 1016,
      sea_level: 1016,
      grnd_level: 998,
      humidity: 53,
      temp_kf: 0,
    },
    weather: [
      {
        id: 801,
        main: "Clouds",
        description: "few clouds",
        icon: "02d",
      },
    ],
    clouds: {
      all: 19,
    },
    wind: {
      speed: 4.39,
      deg: 0,
      gust: 5.14,
    },
    visibility: 10000,
    pop: 0.23,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-27 09:00:00",
  },
  {
    dt: 1685188800,
    main: {
      temp: 24.01,
      feels_like: 23.51,
      temp_min: 24.01,
      temp_max: 24.01,
      pressure: 1016,
      sea_level: 1016,
      grnd_level: 997,
      humidity: 40,
      temp_kf: 0,
    },
    weather: [
      {
        id: 500,
        main: "Rain",
        description: "light rain",
        icon: "10d",
      },
    ],
    clouds: {
      all: 21,
    },
    wind: {
      speed: 5.51,
      deg: 4,
      gust: 5.99,
    },
    visibility: 10000,
    pop: 0.61,
    rain: {
      "3h": 0.48,
    },
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-27 12:00:00",
  },
  {
    dt: 1685199600,
    main: {
      temp: 22.59,
      feels_like: 21.87,
      temp_min: 22.59,
      temp_max: 22.59,
      pressure: 1016,
      sea_level: 1016,
      grnd_level: 997,
      humidity: 37,
      temp_kf: 0,
    },
    weather: [
      {
        id: 803,
        main: "Clouds",
        description: "broken clouds",
        icon: "04d",
      },
    ],
    clouds: {
      all: 63,
    },
    wind: {
      speed: 5.74,
      deg: 5,
      gust: 7.35,
    },
    visibility: 10000,
    pop: 0.25,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-27 15:00:00",
  },
  {
    dt: 1685210400,
    main: {
      temp: 17.96,
      feels_like: 17.09,
      temp_min: 17.96,
      temp_max: 17.96,
      pressure: 1018,
      sea_level: 1018,
      grnd_level: 999,
      humidity: 49,
      temp_kf: 0,
    },
    weather: [
      {
        id: 802,
        main: "Clouds",
        description: "scattered clouds",
        icon: "03n",
      },
    ],
    clouds: {
      all: 35,
    },
    wind: {
      speed: 4.56,
      deg: 12,
      gust: 9.67,
    },
    visibility: 10000,
    pop: 0.17,
    sys: {
      pod: "n",
    },
    dt_txt: "2023-05-27 18:00:00",
  },
  {
    dt: 1685221200,
    main: {
      temp: 14.95,
      feels_like: 14.15,
      temp_min: 14.95,
      temp_max: 14.95,
      pressure: 1019,
      sea_level: 1019,
      grnd_level: 1000,
      humidity: 63,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01n",
      },
    ],
    clouds: {
      all: 0,
    },
    wind: {
      speed: 5.05,
      deg: 20,
      gust: 11.33,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "n",
    },
    dt_txt: "2023-05-27 21:00:00",
  },
  {
    dt: 1685232000,
    main: {
      temp: 12.63,
      feels_like: 11.62,
      temp_min: 12.63,
      temp_max: 12.63,
      pressure: 1020,
      sea_level: 1020,
      grnd_level: 1000,
      humidity: 64,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01n",
      },
    ],
    clouds: {
      all: 0,
    },
    wind: {
      speed: 3.92,
      deg: 7,
      gust: 9.55,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "n",
    },
    dt_txt: "2023-05-28 00:00:00",
  },
  {
    dt: 1685242800,
    main: {
      temp: 11.22,
      feels_like: 9.96,
      temp_min: 11.22,
      temp_max: 11.22,
      pressure: 1020,
      sea_level: 1020,
      grnd_level: 1001,
      humidity: 60,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    clouds: {
      all: 0,
    },
    wind: {
      speed: 4.01,
      deg: 7,
      gust: 8.83,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-28 03:00:00",
  },
  {
    dt: 1685253600,
    main: {
      temp: 14.62,
      feels_like: 13.39,
      temp_min: 14.62,
      temp_max: 14.62,
      pressure: 1021,
      sea_level: 1021,
      grnd_level: 1002,
      humidity: 48,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    clouds: {
      all: 0,
    },
    wind: {
      speed: 4.72,
      deg: 22,
      gust: 7.04,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-28 06:00:00",
  },
  {
    dt: 1685264400,
    main: {
      temp: 18.39,
      feels_like: 17.25,
      temp_min: 18.39,
      temp_max: 18.39,
      pressure: 1021,
      sea_level: 1021,
      grnd_level: 1002,
      humidity: 37,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    clouds: {
      all: 2,
    },
    wind: {
      speed: 4.91,
      deg: 34,
      gust: 5.46,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-28 09:00:00",
  },
  {
    dt: 1685275200,
    main: {
      temp: 19.76,
      feels_like: 18.65,
      temp_min: 19.76,
      temp_max: 19.76,
      pressure: 1020,
      sea_level: 1020,
      grnd_level: 1001,
      humidity: 33,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    clouds: {
      all: 4,
    },
    wind: {
      speed: 4.54,
      deg: 36,
      gust: 4.74,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-28 12:00:00",
  },
  {
    dt: 1685286000,
    main: {
      temp: 18.91,
      feels_like: 17.85,
      temp_min: 18.91,
      temp_max: 18.91,
      pressure: 1020,
      sea_level: 1020,
      grnd_level: 1001,
      humidity: 38,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    clouds: {
      all: 7,
    },
    wind: {
      speed: 4.26,
      deg: 46,
      gust: 4.49,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-28 15:00:00",
  },
  {
    dt: 1685296800,
    main: {
      temp: 14.64,
      feels_like: 13.54,
      temp_min: 14.64,
      temp_max: 14.64,
      pressure: 1021,
      sea_level: 1021,
      grnd_level: 1002,
      humidity: 53,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01n",
      },
    ],
    clouds: {
      all: 7,
    },
    wind: {
      speed: 3.28,
      deg: 52,
      gust: 7.07,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "n",
    },
    dt_txt: "2023-05-28 18:00:00",
  },
  {
    dt: 1685307600,
    main: {
      temp: 12.04,
      feels_like: 10.76,
      temp_min: 12.04,
      temp_max: 12.04,
      pressure: 1022,
      sea_level: 1022,
      grnd_level: 1003,
      humidity: 56,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01n",
      },
    ],
    clouds: {
      all: 1,
    },
    wind: {
      speed: 2.8,
      deg: 64,
      gust: 7.09,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "n",
    },
    dt_txt: "2023-05-28 21:00:00",
  },
  {
    dt: 1685318400,
    main: {
      temp: 10.3,
      feels_like: 9.08,
      temp_min: 10.3,
      temp_max: 10.3,
      pressure: 1023,
      sea_level: 1023,
      grnd_level: 1003,
      humidity: 65,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01n",
      },
    ],
    clouds: {
      all: 1,
    },
    wind: {
      speed: 1.79,
      deg: 81,
      gust: 4.04,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "n",
    },
    dt_txt: "2023-05-29 00:00:00",
  },
  {
    dt: 1685329200,
    main: {
      temp: 9.68,
      feels_like: 8.73,
      temp_min: 9.68,
      temp_max: 9.68,
      pressure: 1023,
      sea_level: 1023,
      grnd_level: 1003,
      humidity: 61,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    clouds: {
      all: 0,
    },
    wind: {
      speed: 2.11,
      deg: 68,
      gust: 4.01,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-29 03:00:00",
  },
  {
    dt: 1685340000,
    main: {
      temp: 15.02,
      feels_like: 13.88,
      temp_min: 15.02,
      temp_max: 15.02,
      pressure: 1023,
      sea_level: 1023,
      grnd_level: 1003,
      humidity: 50,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    clouds: {
      all: 0,
    },
    wind: {
      speed: 2.63,
      deg: 91,
      gust: 3.92,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-29 06:00:00",
  },
  {
    dt: 1685350800,
    main: {
      temp: 18.82,
      feels_like: 17.7,
      temp_min: 18.82,
      temp_max: 18.82,
      pressure: 1022,
      sea_level: 1022,
      grnd_level: 1003,
      humidity: 36,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    clouds: {
      all: 0,
    },
    wind: {
      speed: 3.34,
      deg: 91,
      gust: 3.67,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-29 09:00:00",
  },
  {
    dt: 1685361600,
    main: {
      temp: 20.66,
      feels_like: 19.64,
      temp_min: 20.66,
      temp_max: 20.66,
      pressure: 1021,
      sea_level: 1021,
      grnd_level: 1002,
      humidity: 33,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    clouds: {
      all: 0,
    },
    wind: {
      speed: 3.49,
      deg: 84,
      gust: 3.37,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-29 12:00:00",
  },
  {
    dt: 1685372400,
    main: {
      temp: 20.21,
      feels_like: 19.28,
      temp_min: 20.21,
      temp_max: 20.21,
      pressure: 1020,
      sea_level: 1020,
      grnd_level: 1001,
      humidity: 38,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    clouds: {
      all: 0,
    },
    wind: {
      speed: 3.31,
      deg: 87,
      gust: 3.22,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-29 15:00:00",
  },
  {
    dt: 1685383200,
    main: {
      temp: 16,
      feels_like: 15.17,
      temp_min: 16,
      temp_max: 16,
      pressure: 1021,
      sea_level: 1021,
      grnd_level: 1001,
      humidity: 58,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01n",
      },
    ],
    clouds: {
      all: 0,
    },
    wind: {
      speed: 2.07,
      deg: 90,
      gust: 3.45,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "n",
    },
    dt_txt: "2023-05-29 18:00:00",
  },
  {
    dt: 1685394000,
    main: {
      temp: 13.74,
      feels_like: 12.95,
      temp_min: 13.74,
      temp_max: 13.74,
      pressure: 1021,
      sea_level: 1021,
      grnd_level: 1001,
      humidity: 68,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01n",
      },
    ],
    clouds: {
      all: 0,
    },
    wind: {
      speed: 1.37,
      deg: 96,
      gust: 1.49,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "n",
    },
    dt_txt: "2023-05-29 21:00:00",
  },
  {
    dt: 1685404800,
    main: {
      temp: 12.45,
      feels_like: 11.66,
      temp_min: 12.45,
      temp_max: 12.45,
      pressure: 1020,
      sea_level: 1020,
      grnd_level: 1001,
      humidity: 73,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01n",
      },
    ],
    clouds: {
      all: 0,
    },
    wind: {
      speed: 1.24,
      deg: 59,
      gust: 1.23,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "n",
    },
    dt_txt: "2023-05-30 00:00:00",
  },
  {
    dt: 1685415600,
    main: {
      temp: 12.14,
      feels_like: 11.34,
      temp_min: 12.14,
      temp_max: 12.14,
      pressure: 1020,
      sea_level: 1020,
      grnd_level: 1001,
      humidity: 74,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    clouds: {
      all: 0,
    },
    wind: {
      speed: 1.37,
      deg: 41,
      gust: 1.9,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-30 03:00:00",
  },
  {
    dt: 1685426400,
    main: {
      temp: 17.36,
      feels_like: 16.59,
      temp_min: 17.36,
      temp_max: 17.36,
      pressure: 1020,
      sea_level: 1020,
      grnd_level: 1001,
      humidity: 55,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    clouds: {
      all: 0,
    },
    wind: {
      speed: 2.25,
      deg: 51,
      gust: 3.23,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-30 06:00:00",
  },
  {
    dt: 1685437200,
    main: {
      temp: 21.01,
      feels_like: 20.24,
      temp_min: 21.01,
      temp_max: 21.01,
      pressure: 1019,
      sea_level: 1019,
      grnd_level: 1000,
      humidity: 41,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    clouds: {
      all: 0,
    },
    wind: {
      speed: 2.64,
      deg: 53,
      gust: 2.4,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-30 09:00:00",
  },
  {
    dt: 1685448000,
    main: {
      temp: 22.86,
      feels_like: 22.12,
      temp_min: 22.86,
      temp_max: 22.86,
      pressure: 1017,
      sea_level: 1017,
      grnd_level: 998,
      humidity: 35,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    clouds: {
      all: 2,
    },
    wind: {
      speed: 2.47,
      deg: 34,
      gust: 2.33,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-30 12:00:00",
  },
  {
    dt: 1685458800,
    main: {
      temp: 22.65,
      feels_like: 21.88,
      temp_min: 22.65,
      temp_max: 22.65,
      pressure: 1016,
      sea_level: 1016,
      grnd_level: 997,
      humidity: 35,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    clouds: {
      all: 9,
    },
    wind: {
      speed: 1.69,
      deg: 60,
      gust: 2.33,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-30 15:00:00",
  },
  {
    dt: 1685469600,
    main: {
      temp: 18.16,
      feels_like: 17.57,
      temp_min: 18.16,
      temp_max: 18.16,
      pressure: 1016,
      sea_level: 1016,
      grnd_level: 997,
      humidity: 59,
      temp_kf: 0,
    },
    weather: [
      {
        id: 801,
        main: "Clouds",
        description: "few clouds",
        icon: "02n",
      },
    ],
    clouds: {
      all: 23,
    },
    wind: {
      speed: 2.53,
      deg: 168,
      gust: 4.53,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "n",
    },
    dt_txt: "2023-05-30 18:00:00",
  },
  {
    dt: 1685480400,
    main: {
      temp: 17.35,
      feels_like: 16.68,
      temp_min: 17.35,
      temp_max: 17.35,
      pressure: 1015,
      sea_level: 1015,
      grnd_level: 996,
      humidity: 59,
      temp_kf: 0,
    },
    weather: [
      {
        id: 804,
        main: "Clouds",
        description: "overcast clouds",
        icon: "04n",
      },
    ],
    clouds: {
      all: 86,
    },
    wind: {
      speed: 2.31,
      deg: 210,
      gust: 4.18,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "n",
    },
    dt_txt: "2023-05-30 21:00:00",
  },
  {
    dt: 1685491200,
    main: {
      temp: 16.59,
      feels_like: 15.82,
      temp_min: 16.59,
      temp_max: 16.59,
      pressure: 1014,
      sea_level: 1014,
      grnd_level: 995,
      humidity: 58,
      temp_kf: 0,
    },
    weather: [
      {
        id: 804,
        main: "Clouds",
        description: "overcast clouds",
        icon: "04n",
      },
    ],
    clouds: {
      all: 91,
    },
    wind: {
      speed: 2.45,
      deg: 280,
      gust: 4.73,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "n",
    },
    dt_txt: "2023-05-31 00:00:00",
  },
  {
    dt: 1685502000,
    main: {
      temp: 14.46,
      feels_like: 13.84,
      temp_min: 14.46,
      temp_max: 14.46,
      pressure: 1015,
      sea_level: 1015,
      grnd_level: 995,
      humidity: 72,
      temp_kf: 0,
    },
    weather: [
      {
        id: 803,
        main: "Clouds",
        description: "broken clouds",
        icon: "04d",
      },
    ],
    clouds: {
      all: 53,
    },
    wind: {
      speed: 3.04,
      deg: 334,
      gust: 6.43,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-31 03:00:00",
  },
  {
    dt: 1685512800,
    main: {
      temp: 16.6,
      feels_like: 16.07,
      temp_min: 16.6,
      temp_max: 16.6,
      pressure: 1015,
      sea_level: 1015,
      grnd_level: 996,
      humidity: 67,
      temp_kf: 0,
    },
    weather: [
      {
        id: 803,
        main: "Clouds",
        description: "broken clouds",
        icon: "04d",
      },
    ],
    clouds: {
      all: 68,
    },
    wind: {
      speed: 3.5,
      deg: 320,
      gust: 4.74,
    },
    visibility: 10000,
    pop: 0.03,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-31 06:00:00",
  },
  {
    dt: 1685523600,
    main: {
      temp: 20.05,
      feels_like: 19.29,
      temp_min: 20.05,
      temp_max: 20.05,
      pressure: 1015,
      sea_level: 1015,
      grnd_level: 996,
      humidity: 45,
      temp_kf: 0,
    },
    weather: [
      {
        id: 802,
        main: "Clouds",
        description: "scattered clouds",
        icon: "03d",
      },
    ],
    clouds: {
      all: 26,
    },
    wind: {
      speed: 4.39,
      deg: 321,
      gust: 4.92,
    },
    visibility: 10000,
    pop: 0.43,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-31 09:00:00",
  },
  {
    dt: 1685534400,
    main: {
      temp: 20.41,
      feels_like: 19.5,
      temp_min: 20.41,
      temp_max: 20.41,
      pressure: 1015,
      sea_level: 1015,
      grnd_level: 996,
      humidity: 38,
      temp_kf: 0,
    },
    weather: [
      {
        id: 803,
        main: "Clouds",
        description: "broken clouds",
        icon: "04d",
      },
    ],
    clouds: {
      all: 56,
    },
    wind: {
      speed: 3.27,
      deg: 325,
      gust: 4.23,
    },
    visibility: 10000,
    pop: 0.44,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-31 12:00:00",
  },
  {
    dt: 1685545200,
    main: {
      temp: 19.64,
      feels_like: 18.65,
      temp_min: 19.64,
      temp_max: 19.64,
      pressure: 1015,
      sea_level: 1015,
      grnd_level: 996,
      humidity: 38,
      temp_kf: 0,
    },
    weather: [
      {
        id: 804,
        main: "Clouds",
        description: "overcast clouds",
        icon: "04d",
      },
    ],
    clouds: {
      all: 99,
    },
    wind: {
      speed: 2.05,
      deg: 320,
      gust: 3.15,
    },
    visibility: 10000,
    pop: 0.01,
    sys: {
      pod: "d",
    },
    dt_txt: "2023-05-31 15:00:00",
  },
  {
    dt: 1685556000,
    main: {
      temp: 16.84,
      feels_like: 15.75,
      temp_min: 16.84,
      temp_max: 16.84,
      pressure: 1017,
      sea_level: 1017,
      grnd_level: 997,
      humidity: 45,
      temp_kf: 0,
    },
    weather: [
      {
        id: 804,
        main: "Clouds",
        description: "overcast clouds",
        icon: "04n",
      },
    ],
    clouds: {
      all: 99,
    },
    wind: {
      speed: 4.05,
      deg: 329,
      gust: 7.29,
    },
    visibility: 10000,
    pop: 0.01,
    sys: {
      pod: "n",
    },
    dt_txt: "2023-05-31 18:00:00",
  },
];

const useHourlyForecastData = (latitude: number, longitude: number) => {
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    axios
      .get(
        `${WEATHER_API_BASE_URL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
      )
      .then(({ data: { list } }) => {
        setData(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!data) {
      fetchData();
    }
  }, [data]);

  useEffect(() => {
    fetchData();
  }, [latitude, longitude]);

  const refresh = () => {
    setLoading(true);
    // setData(null);

    fetchData();
  };

  return {
    hourlyForecastData: data,
    forecastIsLoading: loading,
    refreshForecastData: refresh,
  };
};

export default useHourlyForecastData;
