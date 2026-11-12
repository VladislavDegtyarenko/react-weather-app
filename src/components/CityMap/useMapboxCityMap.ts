import { useEffect, useRef, useState } from "react";
import { Map, Marker, NavigationControl } from "mapbox-gl";

const CITY_ZOOM = 7;
const PIN_COLOR = "#24619d";

type MapView = { status: "loading" | "error" } | { status: "ready"; map: Map };

type MapOptions = {
  token: string;
  latitude: number;
  longitude: number;
};

export function useMapboxCityMap({ token, latitude, longitude }: MapOptions) {
  const CONTAINER_REF = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<MapView>({ status: "loading" });

  useEffect(() => {
    if (!CONTAINER_REF.current) {
      return;
    }

    const COORDINATES: [number, number] = [longitude, latitude];
    let map: Map;

    try {
      map = new Map({
        container: CONTAINER_REF.current,
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

  return { containerRef: CONTAINER_REF, view };
}
