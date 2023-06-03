import { Typography } from "@mui/material";

const MainTemp = ({ temp }: { temp?: number }) => {
  return (
    <Typography
      variant="h2"
      component="h3"
      fontWeight="Normal"
      sx={{ display: "flex", alignItems: "start" }}
    >
      {temp ? Math.round(temp) : "--"}
      <Typography variant="h2" component="span" fontSize="0.5em" lineHeight="2">
        °C
      </Typography>
    </Typography>
  );
};

export default MainTemp;
