import { IconButton, Tabs, Tab, AppBar, Container, Box } from "@mui/material";
import { Link } from "react-router-dom";
import useRouteMatch from "../functions/useRouteMatch";

import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";
import { openModal } from "../store/modalReducer";
import { getCityRouteSlug } from "../functions/cityRoute";

const Header = () => {
  const dispatch = useAppDispatch();
  const cities = useAppSelector((state) => state.weather.cities);

  const cityRoutes = cities.map((city) => getCityRouteSlug(city, cities));

  const routes = [...cityRoutes];

  const routeMatch = useRouteMatch(routes);
  const currentTab = routeMatch?.pattern ? String(routeMatch.pattern.path) : routes[0];

  return (
    <AppBar>
      <Container>
        <Box sx={{ display: "flex", alignItems: "center", minHeight: "3em" }}>
          {cities && cities.length > 0 ? (
            <Tabs value={currentTab} variant="scrollable" scrollButtons={false}>
              {cities.map((city) => (
                <Tab
                  label={city.city}
                  value={getCityRouteSlug(city, cities)}
                  to={getCityRouteSlug(city, cities)}
                  component={Link}
                  key={city.id}
                />
              ))}
            </Tabs>
          ) : null}
          <IconButton
            size="small"
            sx={{ width: "1.5em", height: "1.5em", marginLeft: "auto", display: "block" }}
            onClick={() => dispatch(openModal())}
          >
            +
          </IconButton>
        </Box>
      </Container>
    </AppBar>
  );
};

export default Header;
