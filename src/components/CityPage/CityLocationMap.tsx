import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Map, Marker, NavigationControl } from "mapbox-gl";

import CityRadar from "./CityRadar";
import "mapbox-gl/dist/mapbox-gl.css";

const CITY_ZOOM = 7;
const MAP_HEIGHT = { xs: 256, sm: 320 };
const PIN_COLOR = "#24619d";

type MapView = { status: "loading" | "error" } | { status: "ready"; map: Map };

type Props = {
  token: string;
  latitude: number;
  longitude: number;
};

export default function CityLocationMap({ token, latitude, longitude }: Props) {
  const CONTAINER = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<MapView>({ status: "loading" });

  useEffect(() => {
    if (!CONTAINER.current) {
      return;
    }

    const COORDINATES: [number, number] = [longitude, latitude];
    let map: Map;

    try {
      map = new Map({
        container: CONTAINER.current,
        accessToken: token,
        style: "mapbox://styles/mapbox/light-v11",
        center: COORDINATES,
        zoom: CITY_ZOOM,
        projection: "mercator",
        cooperativeGestures: true,
        scrollZoom: false,
        dragRotate: false,
      });
    } catch {
      setView({ status: "error" });
      return;
    }

    let hasLoaded = false;

    map.addControl(new NavigationControl({ showCompass: false }), "top-right");
    const PIN = new Marker({ color: PIN_COLOR }).setLngLat(COORDINATES).addTo(map);
    PIN.getElement().setAttribute("aria-hidden", "true");

    map.once("load", () => {
      hasLoaded = true;
      setView({ status: "ready", map });
    });
    map.on("error", () => {
      if (!hasLoaded) {
        setView({ status: "error" });
      }
    });

    return () => {
      PIN.remove();
      map.remove();
    };
  }, [token, latitude, longitude]);

  return (
    <>
      <Box sx={{ position: "relative", height: MAP_HEIGHT }}>
        <Box ref={CONTAINER} sx={{ width: "100%", height: "100%" }} />
        {view.status !== "ready" && (
          <Typography
            role="status"
            sx={{ position: "absolute", top: 0, left: 0, p: 2, bgcolor: "#243f60", pointerEvents: "none" }}
          >
            {view.status === "error" ? "The city map couldn’t load." : "Loading map…"}
          </Typography>
        )}
      </Box>
      {view.status === "ready" && <CityRadar map={view.map} />}
    </>
  );
}
