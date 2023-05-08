import { Box } from "@mui/material";

import AddCityForm from "../components/AddCityForm";
import Cards from "../components/Cards";

const Main = () => {
  return (
    <Box py={4}>
      <Box display="grid" gap={2}>
        <AddCityForm />
        <Cards />
      </Box>
    </Box>
  );
};

export default Main;
