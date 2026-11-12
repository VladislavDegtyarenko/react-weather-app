import { Box, Stack, Typography } from "@mui/material";

const RAIN_INTENSITY_COLORS = "linear-gradient(90deg, #88ddee, #005588, #ffee00, #ff4400, #c10000)";

export default function RadarLegend() {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography variant="caption">Lighter rain</Typography>
      <Box aria-hidden="true" sx={{ width: 68, height: 6, borderRadius: 1, background: RAIN_INTENSITY_COLORS }} />
      <Typography variant="caption">Heavier rain</Typography>
    </Stack>
  );
}
