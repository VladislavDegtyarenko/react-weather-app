/**
 * Function that accepts a weather condition id from Weather API
 * and returns an icon name to use in WeatherIcon.tsx component
 * @param {number} id - weather condition id (usually from weather[0].id).
 * @returns {string} Corresponding React icon name.
 */

const ICONS = {
  CLEAR: {
    DAY: "clear",
    NIGHT: "clear-night",
  },
  CLOUDS: {
    LOW: {
      DAY: "clouds-few",
      NIGHT: "clouds-few-night",
    },
    MID: {
      DAY: "clouds-scattered",
      NIGHT: "clouds-scattered-night",
    },
    HIGH: {
      DAY: "cloudy",
      NIGHT: "cloudy",
    },
  },
  FOG: {
    DAY: "fog",
    NIGHT: "fog",
  },
  SNOW: {
    DAY: "snow",
    NIGHT: "snow",
  },
  SLEET: {
    DAY: "sleet",
    NIGHT: "sleet",
  },
  RAIN: {
    DAY: "rain",
    NIGHT: "rain-night",
  },
  DRIZZLE: {
    DAY: "drizzle",
    NIGHT: "drizzle-night",
  },
  THUNDERSTORM: {
    NORMAL: {
      DAY: "thunderstorm",
      NIGHT: "thunderstorm",
    },
    WITH_RAIN: {
      DAY: "thunderstorm-and-rain",
      NIGHT: "thunderstorm-and-rain",
    },
  },
};

const getWeatherIconById = (id: number, isNight?: boolean) => {
  const colored = true;
  // isNight = true;

  const nightProp = isNight ? "NIGHT" : "DAY";
  const colorSuffix = colored ? "-color" : "";

  let iconName;

  if (id === 800) iconName = ICONS.CLEAR;
  else if (id === 801) iconName = ICONS.CLOUDS.LOW;
  else if (id === 802) iconName = ICONS.CLOUDS.MID;
  else if (id === 803) iconName = ICONS.CLOUDS.HIGH;
  else if (id >= 700) iconName = ICONS.FOG;
  else if ((id >= 600 && id <= 610) || id >= 615) iconName = ICONS.SNOW;
  else if (id >= 611 && id <= 613) iconName = ICONS.SLEET;
  else if (id >= 500) iconName = ICONS.RAIN;
  else if (id >= 300) iconName = ICONS.DRIZZLE;
  else if ((id >= 200 && id <= 202) || (id >= 230 && id <= 232))
    iconName = ICONS.THUNDERSTORM.WITH_RAIN;
  else if (id >= 210 && id <= 221) iconName = ICONS.THUNDERSTORM.NORMAL;

  if (!iconName) {
    // throw new Error("No Icon Name fond");
    return;
  }

  return iconName[nightProp] + colorSuffix;
};

export default getWeatherIconById;
