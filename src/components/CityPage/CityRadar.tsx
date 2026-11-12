import { useEffect, useRef, useState } from "react";
import { Box, Button, Link, Slider, Stack, Typography } from "@mui/material";
import { type Map } from "mapbox-gl";

import { getRadarFrames, type RadarFrame } from "../../api/radar";
import { stageRadarFrame } from "./radarLayer";

const FRAME_DURATION_MS = 700;
const RAIN_INTENSITY_COLORS = "linear-gradient(90deg, #88ddee, #005588, #ffee00, #ff4400, #c10000)";
const FRAME_TIME_FORMAT = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

/** Formats a radar timestamp consistently across cities and browsers. */
function formatFrameTime(frame: RadarFrame) {
  return `${FRAME_TIME_FORMAT.format(frame.time * 1_000)} UTC`;
}

type TimelineProps = { map: Map; frames: RadarFrame[] };

function RadarTimeline({ map, frames }: TimelineProps) {
  const ACTIVE_LAYER = useRef<string>();
  const LAST_INDEX = frames.length - 1;
  const [selectedIndex, setSelectedIndex] = useState(LAST_INDEX);
  const [displayedIndex, setDisplayedIndex] = useState<number>();
  const [failedIndex, setFailedIndex] = useState<number>();
  const [retryCount, setRetryCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const SELECTED_FRAME = frames[selectedIndex];
  const HAS_FRAME_ERROR = failedIndex === selectedIndex;
  const IS_LOADING = !HAS_FRAME_ERROR && displayedIndex !== selectedIndex;

  useEffect(() => {
    if (displayedIndex === selectedIndex) {
      return;
    }

    return stageRadarFrame({
      map,
      frame: SELECTED_FRAME,
      previousLayer: ACTIVE_LAYER.current,
      onReady: (layer) => {
        ACTIVE_LAYER.current = layer;
        setDisplayedIndex(selectedIndex);
      },
      onError: () => {
        setFailedIndex(selectedIndex);
        setIsPlaying(false);
      },
    });
  }, [map, SELECTED_FRAME, selectedIndex, displayedIndex, retryCount]);

  useEffect(() => {
    if (!isPlaying || IS_LOADING || HAS_FRAME_ERROR) {
      return;
    }

    const TIMER = window.setTimeout(() => {
      if (selectedIndex === LAST_INDEX) {
        setIsPlaying(false);
      } else {
        setSelectedIndex(selectedIndex + 1);
      }
    }, FRAME_DURATION_MS);

    return () => window.clearTimeout(TIMER);
  }, [isPlaying, IS_LOADING, HAS_FRAME_ERROR, selectedIndex, LAST_INDEX]);

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    if (selectedIndex === LAST_INDEX) {
      setSelectedIndex(0);
    }
    setFailedIndex(undefined);
    setIsPlaying(true);
  };

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={togglePlayback}
          disabled={LAST_INDEX === 0 || HAS_FRAME_ERROR}
          sx={{ minWidth: 80, minHeight: 40 }}
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Slider
          size="small"
          aria-label="Radar frame time"
          getAriaValueText={(index) => formatFrameTime(frames[index] ?? SELECTED_FRAME)}
          value={selectedIndex}
          min={0}
          max={Math.max(1, LAST_INDEX)}
          step={1}
          disabled={LAST_INDEX === 0}
          onChange={(_, value) => {
            if (typeof value === "number") {
              setIsPlaying(false);
              setFailedIndex(undefined);
              setSelectedIndex(value);
            }
          }}
          sx={{ color: "#bde4ff", mx: 0.5 }}
        />
        <Typography component="time" dateTime={new Date(SELECTED_FRAME.time * 1_000).toISOString()}
          variant="body2" sx={{ flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>
          {formatFrameTime(SELECTED_FRAME)}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ minHeight: 26, flexWrap: "wrap", marginTop: 1 }}>
        <Typography variant="caption" role="status" aria-live={isPlaying ? "off" : "polite"}>
          {HAS_FRAME_ERROR ? "This radar frame couldn’t load." : IS_LOADING ? "Loading radar frame…" :
            `Observed radar · ${formatFrameTime(frames[0])} to ${formatFrameTime(frames[LAST_INDEX])}`}
          {displayedIndex !== undefined && displayedIndex !== selectedIndex &&
            ` Showing ${formatFrameTime(frames[displayedIndex])}.`}
        </Typography>
        {HAS_FRAME_ERROR && <Button size="small" color="inherit" onClick={() => {
          setFailedIndex(undefined);
          setRetryCount((count) => count + 1);
        }}>Retry</Button>}
      </Stack>
    </>
  );
}

type Props = { map: Map };

export default function CityRadar({ map }: Props) {
  const [frames, setFrames] = useState<RadarFrame[] | undefined>();
  const [hasFailed, setHasFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    getRadarFrames().then((result) => {
      if (isCurrent) {
        setFrames(result);
      }
    }).catch(() => {
      if (isCurrent) {
        setHasFailed(true);
      }
    });

    return () => { isCurrent = false; };
  }, [attempt]);

  const CAN_RETRY = hasFailed || frames?.length === 0;

  return (
    <Box sx={{ px: 2, py: 1.5 }}>
      {frames?.length ? (
        <RadarTimeline map={map} frames={frames} />
      ) : (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ minHeight: 66 }}>
          <Typography role="status" variant="body2">
            {CAN_RETRY ? "Radar data is temporarily unavailable." : "Loading radar observations…"}
          </Typography>
          {CAN_RETRY && <Button size="small" color="inherit" onClick={() => {
            setHasFailed(false);
            setFrames(undefined);
            setAttempt((count) => count + 1);
          }}>Retry</Button>}
        </Stack>
      )}
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} flexWrap="wrap">
        <Typography variant="caption" color="text.secondary">
          <Link href="https://www.rainviewer.com/" color="inherit" target="_blank" rel="noreferrer">
            Weather data by RainViewer
          </Link>
          {" · Coverage varies by region"}
        </Typography>
        {Boolean(frames?.length) && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="caption">Lighter rain</Typography>
            <Box aria-hidden="true" sx={{ width: 68, height: 6, borderRadius: 1, background: RAIN_INTENSITY_COLORS }} />
            <Typography variant="caption">Heavier rain</Typography>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
