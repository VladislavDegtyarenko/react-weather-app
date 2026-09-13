import { City } from "../types/types";

const DIACRITIC_REGEXP = /\p{M}/gu;
const NON_SLUG_CHARACTERS = /[\s\p{P}\p{S}]+/gu;
const MULTIPLE_HYPHENS = /-+/g;
const EDGE_HYPHENS = /^-+|-+$/g;

/**
 * Returns a stable key for duplicate detection using lower-cased city and country.
 */
const normalizePair = (city: Pick<City, "city" | "country">): string =>
  `${city.city.trim().toLowerCase()}|${city.country.trim().toLowerCase()}`;

/**
 * Converts a raw city/country fragment into a URL slug segment.
 */
const sanitizeToSlugPart = (value: string): string => {
  const noDiacritics = value
    .normalize("NFD")
    .replace(DIACRITIC_REGEXP, "")
    .toLowerCase();

  const slugLike = noDiacritics
    .replace(NON_SLUG_CHARACTERS, "-")
    .replace(MULTIPLE_HYPHENS, "-")
    .replace(EDGE_HYPHENS, "");

  return encodeURIComponent(slugLike);
};

/**
 * Decodes a route slug and normalizes it for safe comparison.
 */
const normalizeRouteSlug = (citySlug: string): string =>
  (() => {
    try {
      return decodeURIComponent(citySlug).trim().toLowerCase();
    } catch {
      return "__invalid_city_route__";
    }
  })();

/**
 * Builds a readable route slug for a city and appends id when duplicates exist.
 */
export const getCityRouteSlug = (
  city: City,
  allCities: readonly City[]
): string => {
  const slug = sanitizeToSlugPart(`${city.city} ${city.country}`);
  const samePairCount = allCities.filter(
    (item) => normalizePair(item) === normalizePair(city)
  ).length;

  return samePairCount > 1 ? `${slug}-${city.id}` : slug;
};

/**
 * Finds a city that matches the readable route slug, including duplicate-id variants.
 */
export const findCityByRouteSlug = (
  cities: readonly City[],
  citySlug: string
): City | undefined => {
  const normalizedSlug = normalizeRouteSlug(citySlug);

  return cities.find(
    (city) => normalizeRouteSlug(getCityRouteSlug(city, cities)) === normalizedSlug
  );
};
