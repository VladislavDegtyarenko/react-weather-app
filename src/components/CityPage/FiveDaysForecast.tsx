import { Box, Typography } from "@mui/material";
import DayForecastBadge from "./DayForecastBadge";

import { ForecastData } from "./../../types/types";

interface FiveDaysForecastProps {
  hourlyForecastData: ForecastData;
}

const FiveDaysForecast = ({ hourlyForecastData }: FiveDaysForecastProps) => {
  // console.log("hourlyForecastData: ", hourlyForecastData);
  const dataWithDates = hourlyForecastData.map((t) => ({
    ...t,
    dt: new Date(t.dt * 1000),
  }));
  // console.log("dataWithDates: ", dataWithDates);

  const groupedDates = dataWithDates.reduce(
    (groups: { [key: string]: any[] }, timestamp) => {
      const day = new Date(timestamp.dt)
        .toLocaleDateString("en-US", {
          weekday: "short",
          day: "2-digit",
        })
        .split(" ")
        .reverse()
        .join(" ");

      if (!(day in groups)) {
        groups[day] = [];
      }
      groups[day].push(timestamp);
      return groups;
    },
    {}
  );

  return (
    <Box flexDirection="column" display="flex" gap={2}>
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{ textTransform: "uppercase" }}
      >
        5 day weather forecast
      </Typography>

      <Box
        display="flex"
        gap={1}
        flexDirection={{
          xs: "column",
          sm: "column",
          md: "row",
        }}
      >
        {Object.entries(groupedDates).map((date) => (
          <DayForecastBadge date={date} key={date[0]} />
        ))}
      </Box>
    </Box>
  );
};

export default FiveDaysForecast;
