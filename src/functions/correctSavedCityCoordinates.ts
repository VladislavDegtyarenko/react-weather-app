import { type City } from "../types/types";

/** Moves the legacy Ubud point to the GeoNames populated-place location and invalidates its cached weather. */
export function correctSavedCityCoordinates(city: City): City {
  const IS_LEGACY_UBUD =
    city.id === 51185 &&
    city.city === "Ubud" &&
    city.country === "Indonesia" &&
    city.latitude === -8.389712542019078 &&
    city.longitude === 115.17302126836792;

  if (!IS_LEGACY_UBUD) {
    return city;
  }

  // GeoNames populated place Ubud: https://www.geonames.org/1622846/ubud.html
  return {
    ...city,
    latitude: -8.5098,
    longitude: 115.2654,
    weatherData: undefined,
    forecastData: undefined,
  };
}
