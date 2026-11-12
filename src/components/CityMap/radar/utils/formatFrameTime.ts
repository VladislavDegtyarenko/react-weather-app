const FRAME_TIME_FORMAT = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

/** Formats a Unix timestamp in seconds as the radar observation time in UTC. */
export function formatFrameTime(timestamp: number) {
  return `${FRAME_TIME_FORMAT.format(timestamp * 1_000)} UTC`;
}
