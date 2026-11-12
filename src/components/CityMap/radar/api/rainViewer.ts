import axios from "axios";

const RADAR_CATALOG_URL = "https://api.rainviewer.com/public/weather-maps.json";
const TILE_HOST = "https://tilecache.rainviewer.com";
const CACHE_DURATION_MS = 5 * 60_000;
const REQUEST_TIMEOUT_MS = 10_000;
const RADAR_WINDOW_SECONDS = 2 * 60 * 60;
const MAX_DATE_SECONDS = 8_640_000_000_000;

export const RADAR_TILE_SIZE = 512;
export const RADAR_MAX_ZOOM = 7;

export type RadarFrame = {
  time: number;
  tiles: string;
};

let cachedCatalog: { frames: RadarFrame[]; expiresAt: number } | undefined;
let pendingCatalog: Promise<RadarFrame[]> | undefined;

/** Converts RainViewer's catalog into a chronological list of observed radar tiles. */
function readRadarCatalog(data: unknown): RadarFrame[] {
  if (
    typeof data !== "object" || data === null || !("host" in data) || data.host !== TILE_HOST ||
    !("radar" in data) || typeof data.radar !== "object" || data.radar === null ||
    !("past" in data.radar) || !Array.isArray(data.radar.past)
  ) {
    throw new Error("Invalid RainViewer catalog");
  }

  const FRAMES_BY_TIME = new Map<number, RadarFrame>();

  for (const item of data.radar.past as unknown[]) {
    if (
      typeof item !== "object" || item === null || !("time" in item) ||
      typeof item.time !== "number" || !Number.isSafeInteger(item.time) || item.time <= 0 ||
      item.time > MAX_DATE_SECONDS || !("path" in item) || typeof item.path !== "string" ||
      !/^\/v2\/radar\/[a-z\d]+$/i.test(item.path) // Accepts the provider's radar path and frame ID only.
    ) {
      continue;
    }

    FRAMES_BY_TIME.set(item.time, {
      time: item.time,
      tiles: `${TILE_HOST}${item.path}/${RADAR_TILE_SIZE}/{z}/{x}/{y}/2/1_1.png`,
    });
  }

  const FRAMES = [...FRAMES_BY_TIME.values()].sort((first, second) => first.time - second.time);
  const LATEST = FRAMES[FRAMES.length - 1];
  return LATEST ? FRAMES.filter((frame) => frame.time >= LATEST.time - RADAR_WINDOW_SECONDS) : FRAMES;
}

/** Shares recent catalog data and in-flight requests across city pages. */
export function getRadarFrames(): Promise<RadarFrame[]> {
  if (cachedCatalog && cachedCatalog.expiresAt > Date.now()) {
    return Promise.resolve(cachedCatalog.frames);
  }

  if (!pendingCatalog) {
    pendingCatalog = axios.get<unknown>(RADAR_CATALOG_URL, { timeout: REQUEST_TIMEOUT_MS })
      .then(({ data }) => {
        const FRAMES = readRadarCatalog(data);
        if (FRAMES.length) {
          cachedCatalog = { frames: FRAMES, expiresAt: Date.now() + CACHE_DURATION_MS };
        }
        return FRAMES;
      })
      .finally(() => {
        pendingCatalog = undefined;
      });
  }

  return pendingCatalog;
}
