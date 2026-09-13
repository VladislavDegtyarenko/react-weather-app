import { Box, Typography, IconButton } from "@mui/material";
import { useTheme } from "@mui/system";
import { City } from "../../types/types";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { removeCity } from "../../store/weatherSlice";
import { useNavigate } from "react-router-dom";

interface HeadingProps {
  id: number;
  city: City["city"];
  country: City["country"];
}

const Heading = ({ id, city, country }: HeadingProps) => {
  const formatCountry = (country: City["country"]) => {
    if (country === "United States of America") return "USA";

    return country;
  };

  country = formatCountry(country);

  const { palette } = useTheme();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const handleRemoveCity = (id: City["id"]) => {
    navigate("/", { replace: true });
    dispatch(removeCity(id));
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography component="h2" variant="h6" fontWeight={700}>
        {city && country ? `${city}, ${country}` : "--"}
      </Typography>

      <IconButton
        color={palette.text.secondary}
        sx={{ width: "1.5em", height: "1.5em" }}
        onClick={() => handleRemoveCity(id)}
      >
        &times;
      </IconButton>
    </Box>
  );
};

export default Heading;
