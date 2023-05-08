import { Box } from "@mui/material";

const CardImg = ({ imgCode }: { imgCode?: string }) => {
  return imgCode ? (
    <Box
      component="img"
      src={`http://openweathermap.org/img/w/${imgCode}.png`}
      alt=""
      width="5em"
      height="5em"
      mr={1}
    ></Box>
  ) : (
    <Box width="5em" height="5em" mr={1}></Box>
  );
};

export default CardImg;
