import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Box sx={{ bgcolor: "primary.dark", paddingY: 2, boxShadow: 4 }}>
      <Link to="/">
        <Typography
          variant="h4"
          component="h1"
          align="center"
          fontWeight="bold"
          color="primary.contrastText"
        >
          Weather
        </Typography>
      </Link>
    </Box>
  );
};

export default Header;
