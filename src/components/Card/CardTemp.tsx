import { Typography } from "@mui/material";

const CardTemp = ({ temp }: { temp?: number }) => {
  return (
    <Typography variant="h3" component="div">
      {temp ? Math.round(temp) : "--"}
      <small>°</small>
    </Typography>
  );
};

export default CardTemp;
