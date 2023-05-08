import { Typography } from "@mui/material";
import { City } from "./../../types/types";

interface CardTitleProps {
  city?: City["city"];
  country?: City["country"];
}

const CardTitle = ({ city, country }: CardTitleProps) => {
  const formatCountry = (country?: City["country"]) => {
    if (country === "United States of America") return "USA";

    return country;
  };

  country = formatCountry(country);

  if (!city || !country) {
    return (
      <Typography variant="body1" fontWeight={700}>
        --
      </Typography>
    );
  }

  return (
    <Typography variant="body1" fontWeight={700}>
      {city}, {country}
    </Typography>
  );
};

export default CardTitle;
