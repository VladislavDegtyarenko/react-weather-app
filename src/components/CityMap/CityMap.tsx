import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

const MapboxCityMap = lazy(() => import("./MapboxCityMap"));
const LOAD_AHEAD = "160px";

type Props = {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
};

export default function CityMap({ city, country, latitude, longitude }: Props) {
  const PANEL = useRef<HTMLDivElement>(null);
  const TOKEN = process.env.VITE_MAPBOX_ACCESS_TOKEN?.trim();
  const [isNearViewport, setIsNearViewport] = useState(false);

  const HAS_COORDINATES =
    Number.isFinite(latitude) &&
    Math.abs(latitude) <= 90 &&
    Number.isFinite(longitude) &&
    Math.abs(longitude) <= 180;
  const CAN_LOAD_MAP = Boolean(TOKEN && HAS_COORDINATES);

  useEffect(() => {
    if (!CAN_LOAD_MAP || isNearViewport || !PANEL.current) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsNearViewport(true);
      return;
    }

    const OBSERVER = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsNearViewport(true);
        OBSERVER.disconnect();
      }
    }, { rootMargin: LOAD_AHEAD });

    OBSERVER.observe(PANEL.current);

    return () => OBSERVER.disconnect();
  }, [CAN_LOAD_MAP, isNearViewport]);

  return (
    <Box component="section" aria-labelledby="city-location-heading" sx={{ mb: 4 }}>
      <Typography
        id="city-location-heading"
        component="h2"
        variant="subtitle1"
        fontWeight={700}
        sx={{ textTransform: "uppercase", mb: 2 }}
      >
        Precipitation radar
      </Typography>

      {TOKEN && HAS_COORDINATES ? (
        <Box
          ref={PANEL}
          role="region"
          aria-label={`Map of ${city}, ${country}`}
          sx={{ minHeight: { xs: 256, sm: 320 }, borderRadius: 1, overflow: "hidden", bgcolor: "card.inactive" }}
        >
          {isNearViewport && (
            <Suspense fallback={<Typography role="status" sx={{ p: 2 }}>Loading map…</Typography>}>
              <MapboxCityMap
                key={`${latitude},${longitude}`}
                token={TOKEN}
                latitude={latitude}
                longitude={longitude}
              />
            </Suspense>
          )}
        </Box>
      ) : (
        <Typography variant="body2">
          {HAS_COORDINATES
            ? "The city map is unavailable until a Mapbox token is configured."
            : "Location coordinates are unavailable for this city."}
        </Typography>
      )}
    </Box>
  );
}
