import { Grow, Box, Typography, Button } from "@mui/material";

import { useState, useEffect } from "react";

import { useAppSelector } from "../hooks/hooks";
import { useParams } from "react-router-dom";

import { Link } from "react-router-dom";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  BarController,
  LineElement,
  PointElement,
  LinearScale,
  Filler,
  Title,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  BarController,
  CategoryScale,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  ChartDataLabels,
  Filler
);

import CardTitle from "../components/Card/CardTitle";

import axios from "axios";
import { WEATHER_API_BASE_URL, WEATHER_API_KEY } from "./../api/weather";

// Types
import { City, WeatherDetails } from "../types/types";
import type { ChartData, ChartOptions } from "chart.js";

interface LineProps {
  options: ChartOptions<"line">;
  data: ChartData<"line">;
}

/* const DUMMY_DATA = {
  cod: "200",
  message: 0,
  cnt: 8,
  list: [
    {
      dt: 1683244800,
      main: {
        temp: 16.51,
        feels_like: 15.84,
        temp_min: 16.22,
        temp_max: 16.51,
        pressure: 1015,
        sea_level: 1015,
        grnd_level: 1005,
        humidity: 62,
        temp_kf: 0.29,
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
        all: 78,
      },
      wind: {
        speed: 4.97,
        deg: 221,
        gust: 4.75,
      },
      visibility: 10000,
      pop: 0.12,
      sys: {
        pod: "d",
      },
      dt_txt: "2023-05-05 00:00:00",
    },
    {
      dt: 1683255600,
      main: {
        temp: 15.19,
        feels_like: 14.41,
        temp_min: 14.46,
        temp_max: 15.19,
        pressure: 1015,
        sea_level: 1015,
        grnd_level: 1006,
        humidity: 63,
        temp_kf: 0.73,
      },
      weather: [
        {
          id: 500,
          main: "Rain",
          description: "light rain",
          icon: "10n",
        },
      ],
      clouds: {
        all: 88,
      },
      wind: {
        speed: 3.39,
        deg: 224,
        gust: 3.47,
      },
      visibility: 10000,
      pop: 0.2,
      rain: {
        "3h": 0.12,
      },
      sys: {
        pod: "n",
      },
      dt_txt: "2023-05-05 03:00:00",
    },
  ],
  city: {
    id: 5368361,
    name: "Los Angeles",
    coord: {
      lat: 34.0474,
      lon: -118.2717,
    },
    country: "US",
    population: 3792621,
    timezone: -25200,
    sunrise: 1683205257,
    sunset: 1683254321,
  },
}; */

const DetailsPage = () => {
  const { id } = useParams();

  const currentCity: City | undefined = useAppSelector((state) =>
    state.weather.cities.find((city) => String(city.id) === id)
  );

  const city = currentCity?.city || "";
  const country = currentCity?.country || "";
  const latitude = currentCity?.latitude || 0;
  const longitude = currentCity?.longitude || 0;

  const [forecastData, setForecastData] = useState<WeatherDetails | null>(null);

  useEffect(() => {
    if (forecastData) return;

    axios
      .get(
        `${WEATHER_API_BASE_URL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=8&units=metric&appid=${WEATHER_API_KEY}`
      )
      .then(({ data }) => {
        setForecastData(data);
      })
      .catch((err) => console.error(err));
  }, [forecastData]);

  const timeString = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const timeString = `${hours}h`;

    return timeString;
  };

  const labels = forecastData?.list.map((item) => timeString(item.dt));
  const temperatureData = forecastData
    ? forecastData?.list.map((item) => Math.round(item.main.temp))
    : [];

  const temperatureDataset = {
    labels,
    data: temperatureData,
    backgroundColor: "rgba(66, 165, 245, .1)",
    borderColor: "rgba(66, 165, 245, .7)",
    borderWidth: 2,
    tension: 0.34,
    fill: true,
    datalabels: {
      formatter: function (value: string) {
        return value + "°";
      },
    },
  };

  const data = {
    datasets: [temperatureDataset],
  };

  const options: ChartOptions<"line"> = {
    scales: {
      x: {
        type: "category",
        labels,
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Temperature",
        },
        ticks: {
          display: false,
        },
        min: Math.min(...temperatureData) - 6,
        max: Math.max(...temperatureData) + 6,
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Today Weather Forecast",
      },
      datalabels: {
        align: "top",
        color: "rgba(66, 165, 245, 1)",
        labels: {
          title: {
            font: {
              weight: 400,
            },
          },
        },
      },
    },
    layout: {
      padding: {
        top: 0,
        bottom: 0,
        left: 32,
        right: 32,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };

  return (
    <Grow appear={true} in={true}>
      <Box
        color="text.primary"
        display="flex"
        paddingY={4}
        gap={2}
        flexDirection="column"
        alignItems="center"
      >
        <CardTitle city={city} country={country}></CardTitle>

        {forecastData ? <Line data={data} options={options} /> : "Loading..."}

        <Link to="/">
          <Button variant="outlined">Back</Button>
        </Link>
      </Box>
    </Grow>
  );
};

export default DetailsPage;
