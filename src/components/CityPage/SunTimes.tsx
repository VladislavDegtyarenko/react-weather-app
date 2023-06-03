import { Box, Typography, useTheme } from "@mui/material";
import CardWrapper from "../../ui/CardWrapper";

import sunriseIcon from "/assets/sunrise.svg";

import getTimeString from "../../functions/getTimeString";

interface SunTimesProps {
  sunriseTime: Date;
  sunsetTime: Date;
  currentTime: Date;
}

const SunTimes = ({ sunriseTime, sunsetTime, currentTime }: SunTimesProps) => {
  const theme = useTheme();

  // Calculate the progress of the current time between sunrise and sunset
  const totalMinutes =
    sunsetTime.getHours() * 60 +
    sunsetTime.getMinutes() -
    (sunriseTime.getHours() * 60 + sunriseTime.getMinutes());
  const currentMinutes =
    currentTime.getHours() * 60 +
    currentTime.getMinutes() -
    (sunriseTime.getHours() * 60 + sunriseTime.getMinutes());

  let progress = 100 - (currentMinutes / totalMinutes) * 100;

  if (progress > 100) progress = 100;
  if (progress < 0) progress = 0;

  // 🩼
  progress = 50 + progress;

  // progress = 100 - progress;
  // Calculate the end point of the progress bar
  const endX = 100 + 80 * Math.sin((progress * Math.PI) / 100);
  const endY = 100 + 80 * Math.cos((progress * Math.PI) / 100);

  const dayLength = new Date(sunsetTime.getTime() - sunriseTime.getTime());

  return (
    <CardWrapper inactive>
      <Box display="flex" flexDirection="column" height={1}>
        <Typography variant="body1" fontWeight="Medium">
          Sunrise/Sunset
        </Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={1}
          flexGrow="1"
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box
              component="img"
              src={sunriseIcon}
              width="16px"
              height="16px"
              mb={1}
            ></Box>
            <Typography variant="subtitle1" lineHeight={1} color="text.secondary">
              Sunrise
            </Typography>
            <Typography variant="subtitle2" noWrap={true}>
              {getTimeString(sunriseTime)}
            </Typography>
          </Box>

          <Box>
            <svg viewBox="15 40 170 40" width="150px" height="100px">
              {/* Dashed semi-circle overlay */}
              <path
                d="M20,100 A80,80 0 0,1 180,100"
                fill="none"
                stroke={theme.palette.action.disabled}
                strokeWidth="3"
                strokeDasharray="4,6"
              />

              {/* Progress bar */}
              <path
                d={`M20,100 A80,80 0 ${progress > 50 ? "0" : "1"},1 ${endX},${endY}`}
                fill="none"
                stroke="#FEC80A"
                strokeWidth="3"
                strokeDasharray="0,0"
              />

              {/* Dot at the end of the progress bar */}
              <circle cx={endX} cy={endY} r="5" fill={theme.palette.text.primary} />

              <text
                x="100px"
                y="100px"
                width="100%"
                dominantBaseline="bottom"
                textAnchor="middle"
                fontFamily="Roboto"
                fontSize="16px"
                fontWeight="700"
                fill={theme.palette.text.primary}
              >{`${dayLength.getHours()}hr ${dayLength.getMinutes()}min`}</text>
            </svg>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center">
            <Box
              component="img"
              src={sunriseIcon}
              width="16px"
              height="16px"
              mb={1}
              sx={{ transform: "rotate(180deg)" }}
            ></Box>
            <Typography variant="subtitle1" lineHeight={1} color="text.secondary">
              Sunset
            </Typography>
            <Typography variant="subtitle2" noWrap={true}>
              {getTimeString(sunsetTime)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </CardWrapper>
  );
};

export default SunTimes;
