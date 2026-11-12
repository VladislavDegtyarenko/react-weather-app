import { useEffect, useState } from "react";
import { Box, Button, Link, Stack, Typography } from "@mui/material";
import { type Map } from "mapbox-gl";

import { getRadarFrames, type RadarFrame } from "./api/rainViewer";
import RadarLegend from "./RadarLegend";
import RadarTimeline from "./RadarTimeline";

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
          <RadarLegend />
        )}
      </Stack>
    </Box>
  );
}
