import axios from "axios";
import { useState, useEffect } from "react";

import { WEATHER_API_BASE_URL, WEATHER_API_KEY } from "./../api/weather";
import { WeatherData } from "../types/types";

/**
 * Custom hook for retrieving a current weather data from the Weather API
 * based on latitude and longitude coordinates.
 *
 * @param latitude - The latitude coordinate.
 * @param longitude - The longitude coordinate.
 * @returns An object containing weatherData, weatherIsLoading, and refreshWeatherData.
 *  - weatherData: The weather data.
 *  - weatherIsLoading: A boolean indicating whether the weather data is being loaded.
 *  - refreshWeatherData: A function to re-request the weather data.
 *
 * @example
 * const { weatherData, weatherIsLoading, refreshWeatherData } = useWeatherData(latitude, longitude);
 */

const MOCK_DATA = {
  coord: {
    lon: 30.5234,
    lat: 50.4501,
  },
  weather: [
    {
      id: 802,
      main: "Clouds",
      description: "scattered clouds",
      icon: "03n",
    },
  ],
  base: "stations",
  main: {
    temp: 17.3,
    feels_like: 17.15,
    temp_min: 15.66,
    temp_max: 19.6,
    pressure: 1004,
    humidity: 79,
  },
  visibility: 10000,
  wind: {
    speed: 1.7,
    deg: 34,
    gust: 3.28,
  },
  clouds: {
    all: 50,
  },
  dt: 1685130970,
  sys: {
    type: 2,
    id: 2003742,
    country: "UA",
    sunrise: 1685066252,
    sunset: 1685123555,
  },
  timezone: 10800,
  id: 696050,
  name: "Pushcha-Vodytsya",
  cod: 200,
};

const useWeatherData = (latitude: number, longitude: number) => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    axios
      .get(
        `${WEATHER_API_BASE_URL}/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
      )
      .then(({ data }) => {
        setData(data);
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

  const refreshWeatherData = () => {
    setLoading(true);
    // setWeatherData(null);

    fetchData();
  };

  return { weatherData: data, weatherIsLoading: loading, refreshWeatherData };
};

export default useWeatherData;
