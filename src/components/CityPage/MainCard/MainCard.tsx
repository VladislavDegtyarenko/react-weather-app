import { Box, Typography } from "@mui/material";

import getTimeString from "../../../functions/getTimeString";

import CardWrapper from "../../../ui/CardWrapper";

import WeatherIcon from "../WeatherIcon";
import MainTemp from "./MainTemp";
import MainDescr from "./MainDescr";
import DetailsBadge from "./DetailsBadge";

// Types
import { WeatherData } from "../../../types/types";

interface MainCardProps {
  weatherData: WeatherData;
  currentTime: Date;
  isDaytime: boolean;
}

const MainCard = ({ weatherData, currentTime, isDaytime }: MainCardProps) => {
  const updatedAt = getTimeString(currentTime);

  const tempMax = Math.round(weatherData.main["temp_max"]);
  const feelsLike = Math.round(weatherData.main["feels_like"]);

  const wind = Math.round(weatherData.wind.speed * 10) / 10;
  const visibility = Math.round(weatherData.visibility / 100) / 10;
  const humidity = weatherData.main.humidity;
  const pressure = weatherData.main.pressure;

  const dewPoint = (function () {
    const temperature = weatherData.main.temp;

    const svp = 6.112 * Math.exp((17.67 * temperature) / (temperature + 243.5));
    const avp = (humidity / 100) * svp;
    const dPoint = (243.5 * Math.log(avp / 6.112)) / (17.67 - Math.log(avp / 6.112));

    return Math.round(dPoint);
  })();

  const feelsLikeStr = `Feels like\u00A0\u00A0${feelsLike}°`;

  const windStr = `${wind} m/s`;
  const visibilityStr = `${visibility}km`;
  const pressureStr = `${pressure}hPa`;
  const humidityStr = `${humidity}%`;
  const dewPointStr = `${dewPoint}°`;

  return (
    <CardWrapper sx={{ flexGrow: 1 }}>
      <Typography variant="body1" fontWeight="Medium">
        Current weather
      </Typography>
      <Typography variant="body2" fontWeight="Light">
        {updatedAt}
      </Typography>

      <Box
        mt={2}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <WeatherIcon id={weatherData.weather[0].id} size="large" isNight={!isDaytime} />
        <MainTemp temp={weatherData.main.temp} />

        <Box marginLeft={4}>
          <MainDescr descr={weatherData.weather[0].description} />
          <Typography>{feelsLikeStr}</Typography>
        </Box>
      </Box>

      <Typography mt={2}>
        There mostly will be {weatherData.weather[0].description}. The high will be{" "}
        {tempMax}°
      </Typography>

      <Box mt={4} display="grid" gap={1} gridAutoFlow="column">
        <DetailsBadge heading="Wind" value={windStr} />
        <DetailsBadge heading="Humidity" value={humidityStr} />
        <DetailsBadge heading="Visibility" value={visibilityStr} />
        <DetailsBadge heading="Pressure" value={pressureStr} />
        <DetailsBadge heading="Dew point" value={dewPointStr} />
      </Box>
    </CardWrapper>
  );
};

export default MainCard;
