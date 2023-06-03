import { Typography } from "@mui/material";
import capitalize from "../../../functions/capitalize";

const MainDescr = ({ descr }: { descr: string | undefined }) => {
  return (
    <Typography variant="h6" component="p">
      {descr ? capitalize(descr) : "--"}
    </Typography>
  );
};

export default MainDescr;
