import { Button, Slider, Stack, Typography } from "@mui/material";
import { type Map } from "mapbox-gl";

import { type RadarFrame } from "./api/rainViewer";
import { useRadarPlayback } from "./useRadarPlayback";
import { formatFrameTime } from "./utils/formatFrameTime";

type Props = { map: Map; frames: RadarFrame[] };

export default function RadarTimeline({ map, frames }: Props) {
  const {
    selectedIndex,
    displayedIndex,
    isPlaying,
    hasFrameError,
    isLoading,
    togglePlayback,
    selectFrame,
    retryFrame,
  } = useRadarPlayback({ map, frames });
  const LAST_INDEX = frames.length - 1;
  const SELECTED_FRAME = frames[selectedIndex];

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={togglePlayback}
          disabled={LAST_INDEX === 0 || hasFrameError}
          sx={{ minWidth: 80, minHeight: 40 }}
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Slider
          size="small"
          aria-label="Radar frame time"
          getAriaValueText={(index) => formatFrameTime((frames[index] ?? SELECTED_FRAME).time)}
          value={selectedIndex}
          min={0}
          max={Math.max(1, LAST_INDEX)}
          step={1}
          disabled={LAST_INDEX === 0}
          onChange={(_, value) => {
            if (typeof value === "number") {
              selectFrame(value);
            }
          }}
          sx={{ color: "#bde4ff", mx: 0.5 }}
        />
        <Typography component="time" dateTime={new Date(SELECTED_FRAME.time * 1_000).toISOString()}
          variant="body2" sx={{ flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>
          {formatFrameTime(SELECTED_FRAME.time)}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ minHeight: 26, flexWrap: "wrap", marginTop: 1 }}>
        <Typography variant="caption" role="status" aria-live={isPlaying ? "off" : "polite"}>
          {hasFrameError ? "This radar frame couldn’t load." : isLoading ? "Loading radar frame…" :
            `Observed radar · ${formatFrameTime(frames[0].time)} to ${formatFrameTime(frames[LAST_INDEX].time)}`}
          {displayedIndex !== undefined && displayedIndex !== selectedIndex &&
            ` Showing ${formatFrameTime(frames[displayedIndex].time)}.`}
        </Typography>
        {hasFrameError && <Button size="small" color="inherit" onClick={retryFrame}>Retry</Button>}
      </Stack>
    </>
  );
}
