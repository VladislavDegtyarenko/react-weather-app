// Material UI
import {
  Menu,
  MenuItem,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Grow,
} from "@mui/material";

// React
import React, { useState, useEffect } from "react";

// Router
import { Link } from "react-router-dom";

// Main Components
import CardTitle from "./Card/CardTitle";
import CardImg from "./Card/CardImg";
import CardTemp from "./Card/CardTemp";
import CardDescr from "./Card/CardDescr";

// Redux
import { useAppDispatch } from "../hooks/hooks";
import { removeCity } from "../store/weatherSlice";

// API
import axios from "axios";
import { WEATHER_API_KEY, WEATHER_API_BASE_URL } from "../api/weather";

// Types
import { City, WeatherData } from "../types/types";

const WeatherCard = ({ id, city, country, latitude, longitude }: City) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (weatherData) return;

    axios
      .get(
        `${WEATHER_API_BASE_URL}/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
      )
      .then(({ data }) => {
        setWeatherData(data);
      })
      .catch((err) => console.error(err));
  }, [weatherData]);

  // Context Menu
  const dispatch = useAppDispatch();

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };

  useEffect(() => {
    const handleClick = () => {
      if (contextMenu !== null) {
        setContextMenu(null);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [contextMenu]);

  const handleRefresh = (e: React.MouseEvent) => {
    setWeatherData(null);
    handleClose(e);
  };

  const handleDelete = (e: React.MouseEvent) => {
    dispatch(removeCity(id));
    handleClose(e);
  };

  const handleClose = (e: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setContextMenu(null);
  };

  return (
    <Grow appear={true} in={true} mountOnEnter unmountOnExit>
      <Link to={`/${id}`}>
        <Card sx={{ borderRadius: 4, boxShadow: 1 }} onContextMenu={handleContextMenu}>
          <CardActionArea sx={{ padding: 1 }} component="div">
            <CardContent
              sx={{
                display: "grid",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  gap: 1,
                }}
              >
                <CardTemp temp={weatherData?.main.temp} />
                <CardImg imgCode={weatherData?.weather[0].icon} />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "end",
                  gap: 1,
                }}
              >
                <CardTitle city={city} country={country} />

                <CardDescr descr={weatherData?.weather[0].description} />
              </Box>
            </CardContent>
          </CardActionArea>

          <Menu
            open={contextMenu !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
          >
            <MenuItem onClick={handleRefresh}>Refresh</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu>
        </Card>
      </Link>
    </Grow>
  );
};

export default WeatherCard;
