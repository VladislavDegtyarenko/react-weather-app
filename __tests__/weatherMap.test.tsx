import { correctSavedCityCoordinates } from "../src/functions/correctSavedCityCoordinates";
import { type City } from "../src/types/types";

const SYDNEY: City = { id: 2, city: "Sydney", country: "Australia", latitude: -33.87, longitude: 151.21 };
const LEGACY_UBUD: City = {
  id: 51185,
  city: "Ubud",
  country: "Indonesia",
  latitude: -8.389712542019078,
  longitude: 115.17302126836792,
  forecastData: [],
};

it("corrects legacy Ubud records without retaining weather fetched for the old location", () => {
  const UBUD = correctSavedCityCoordinates(LEGACY_UBUD);

  expect(UBUD).toMatchObject({ id: 51185, latitude: -8.5098, longitude: 115.2654 });
  expect(UBUD.forecastData).toBeUndefined();
  expect(correctSavedCityCoordinates(UBUD)).toBe(UBUD);
  expect(correctSavedCityCoordinates(SYDNEY)).toBe(SYDNEY);
});
