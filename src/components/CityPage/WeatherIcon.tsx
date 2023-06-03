import { Box } from "@mui/material";
import getIconNameById from "../../functions/getIconNameById";

interface WeatherIconProps {
  id: number;
  isNight?: boolean;
  size?: "large" | "normal" | "small";
}

const WeatherIcon = ({ id, isNight, size = "small" }: WeatherIconProps) => {
  const name = getIconNameById(id, isNight);


  const src = `/assets/weatherConditionIcons/${name}.svg`;

  let iconSize;

  switch (size) {
    case "large":
      iconSize = "3em";
      break;

    case "normal":
      iconSize = "2em";
      break;

    default:
      iconSize = "1em";
      break;
  }

  if (!name) {
    return (
      <Box width={iconSize} height={iconSize} mr={2}>
        No Icon
      </Box>
    );
  }
  return (
    <Box
      component="img"
      src={src}
      alt="weather icon"
      width={iconSize}
      height={iconSize}
      mr={2}
    ></Box>
  );
};

export default WeatherIcon;
