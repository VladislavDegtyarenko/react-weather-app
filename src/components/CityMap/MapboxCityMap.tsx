import { Box, Typography } from "@mui/material";

import CityRadar from "./radar/CityRadar";
import { useMapboxCityMap } from "./useMapboxCityMap";
import "mapbox-gl/dist/mapbox-gl.css";

const MAP_HEIGHT = { xs: 256, sm: 320 };

type Props = {
  token: string;
  latitude: number;
  longitude: number;
};

export default function MapboxCityMap({ token, latitude, longitude }: Props) {
  const { containerRef, view } = useMapboxCityMap({ token, latitude, longitude });

  return (
    <>
      <Box sx={{ position: "relative", height: MAP_HEIGHT }}>
        <Box ref={containerRef} sx={{ width: "100%", height: "100%" }} />
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
