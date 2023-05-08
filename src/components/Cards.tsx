import React from "react";
import { useAppSelector } from "../hooks/hooks";

import { Typography } from "@mui/material";
import WeatherCard from "./Card";

const Cards = () => {
  const cities = useAppSelector((state) => state.weather.cities);

  if (!cities || cities.length === 0) {
    return (
      <Typography variant="body1" align="center" color="text.secondary">
        No city cards. Start by adding some
      </Typography>
    );
  }

  return (
    <>
      {cities.map((city) => (
        <WeatherCard key={city.id} {...city} />
      ))}
    </>
  );
};

export default Cards;
