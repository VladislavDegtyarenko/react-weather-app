import { Typography } from "@mui/material";

const CardDescr = ({ descr }: { descr: string | undefined }) => {
  const capitalize = (text: string) => {
    return text[0].toUpperCase() + text.slice(1);
  };

  return (
    <Typography variant="body1" textAlign="end" color="text.secondary">
      {descr ? capitalize(descr) : "loading..."}
    </Typography>
  );
};

export default CardDescr;
