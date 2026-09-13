import { City } from "../src/types/types";
import { findCityByRouteSlug, getCityRouteSlug } from "../src/functions/cityRoute";

const mkCity = (id: number, city: string, country: string): City => ({
  id,
  city,
  country,
  latitude: 0,
  longitude: 0,
});

describe("cityRoute", () => {
  it("builds readable route from city and country", () => {
    const city = mkCity(1, "Los Angeles", "USA");

    expect(getCityRouteSlug(city, [city])).toBe("los-angeles-usa");
  });

  it("replaces spaces and punctuation with hyphens", () => {
    const city = mkCity(2, "St. John's", "United States");

    expect(getCityRouteSlug(city, [city])).toBe("st-john-s-united-states");
  });

  it("removes latin diacritic characters", () => {
    const city = mkCity(3, "Kraków", "Côte d'Ivoire");

    expect(getCityRouteSlug(city, [city])).toBe("krakow-cote-d-ivoire");
  });

  it("keeps non-latin symbols encoded in URL-safe format", () => {
    const city = mkCity(4, "Москва", "Россия");
    const slug = getCityRouteSlug(city, [city]);

    expect(decodeURIComponent(slug)).toBe("москва-россия");
    expect(slug).toContain("%");
  });

  it("adds city id when city+country pair is duplicated", () => {
    const city1 = mkCity(5, "Springfield", "USA");
    const city2 = mkCity(6, "Springfield", "USA");
    const cities = [city1, city2];

    expect(getCityRouteSlug(city1, cities)).toBe("springfield-usa-5");
    expect(getCityRouteSlug(city2, cities)).toBe("springfield-usa-6");
  });

  it("finds city by readable or id route", () => {
    const city1 = mkCity(5, "Springfield", "USA");
    const city2 = mkCity(6, "Springfield", "USA");
    const cities = [city1, city2];

    expect(findCityByRouteSlug(cities, "springfield-usa-5")).toEqual(city1);
    expect(findCityByRouteSlug(cities, "springfield-usa-6")).toEqual(city2);
    expect(findCityByRouteSlug(cities, "123")).toBeUndefined();
  });

  it("returns undefined for malformed percent-encoded slugs", () => {
    const cities = [mkCity(1, "Springfield", "USA")];

    expect(findCityByRouteSlug(cities, "%")).toBeUndefined();
    expect(findCityByRouteSlug(cities, "%E0%A4%A")).toBeUndefined();
  });
});
