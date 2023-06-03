import { IconButton, Tabs, Tab, AppBar, Container, Box } from "@mui/material";
import { Link } from "react-router-dom";
import useRouteMatch from "../functions/useRouteMatch";

import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";
import { openModal } from "../store/modalReducer";

const Header = () => {
  const dispatch = useAppDispatch();
  const cities = useAppSelector((state) => state.weather.cities);

  const cityIds = cities.map(({ id }) => String(id));

  const routes = [...cityIds];

  const routeMatch = useRouteMatch(routes);
  const currentTab = routeMatch?.pattern ? String(routeMatch.pattern.path) : routes[0];

  return (
    <AppBar>
      <Container>
        <Box sx={{ display: "flex", alignItems: "center", minHeight: "3em" }}>
          {cities && cities.length > 0 ? (
            <Tabs value={currentTab} variant="scrollable" scrollButtons={false}>
              {cities.map(({ city, id }) => (
                <Tab
                  label={city}
                  value={String(id)}
                  to={String(id)}
                  component={Link}
                  key={id}
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
