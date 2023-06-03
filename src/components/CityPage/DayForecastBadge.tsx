import { Box, Typography, Button, Container } from "@mui/material";
import CardWrapper from "../../ui/CardWrapper";
import WeatherIcon from "./WeatherIcon";
import { ForecastData } from "./../../types/types";

interface DayForecastBadgeProps {
  date: [string, ForecastData];
}

const DayForecastBadge = ({ date }: DayForecastBadgeProps) => {
  const [dateLabel, timestamps] = date;

  const maxTemp = Math.round(Math.max(...timestamps.map((t) => t.main.temp_max)));
  const minTemp = Math.round(Math.min(...timestamps.map((t) => t.main.temp_min)));

  // Determine the weather id for the current day
  // by finding what weather[0].id has maximum occurencies in the timestamp array

  const weatherIdCodes = timestamps.map((t) => t.weather[0].id);

  const countMap = weatherIdCodes.reduce((map: { [key: number]: number }, id) => {
    if (!(id in map)) {
      map[id] = 0;
    }
    map[id]++;
    return map;
  }, {});

  let maxCount = 0;
  let weatherIdWithMaxOccurencies = null;

  for (const id in countMap) {
    if (countMap[id] > maxCount) {
      maxCount = countMap[id];
      weatherIdWithMaxOccurencies = Number(id);
    }
  }

  return (
    <CardWrapper
      sx={{
        flexGrow: 1,
        display: {
          xs: "flex",
          md: "block",
        },
        justifyContent: {
          xs: "space-between",
          md: "",
        },
        alignItems: {
          xs: "center",
          md: "",
        },
      }}
      inactive
    >
      <Typography variant="subtitle1" color="text.secondary">
        {dateLabel}
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
        <WeatherIcon id={weatherIdWithMaxOccurencies!} size="normal" />
        <Box>
          <Typography variant="h6" component="p">
            {maxTemp}°
          </Typography>
          <Typography variant="h6" component="p" fontWeight={300}>
            {minTemp}°
          </Typography>
        </Box>
      </Box>
    </CardWrapper>
  );
};

export default DayForecastBadge;
