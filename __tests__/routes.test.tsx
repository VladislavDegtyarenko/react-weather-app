import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { Suspense } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";

import App from "../src/App";
import weatherReducer from "../src/store/weatherSlice";
import modalReducer from "../src/store/modalReducer";
import { City } from "../src/types/types";
import { getCityRouteSlug } from "../src/functions/cityRoute";

jest.mock("../src/components/CityPage/MainCard/MainCard.tsx", () => ({
  __esModule: true,
  default: () => <div data-testid="main-card" />,
}));

jest.mock("../src/components/CityPage/FiveDaysForecast", () => ({
  __esModule: true,
  default: () => <div data-testid="five-days" />,
}));

jest.mock("../src/components/CityPage/SunTimes", () => ({
  __esModule: true,
  default: () => <div data-testid="sun-times" />,
}));

jest.mock("../src/components/CityPage/ForecastChart", () => ({
  __esModule: true,
  default: () => <div data-testid="forecast-chart" />,
}));

jest.mock("../src/components/CityPage/Heading", () => ({
  __esModule: true,
  default: ({ city, country }: { city: string; country: string }) => (
    <div data-testid="heading">
      {city}-{country}
    </div>
  ),
}));

const RouteLocation = () => {
  const location = useLocation();
  return <div data-testid="current-path">{location.pathname}</div>;
};

const cityWithData = (id: number, city: string, country: string): City => ({
  id,
  city,
  country,
  latitude: 0,
  longitude: 0,
  weatherData: {
    timezone: 0,
    dt: 0,
    sys: { country: "", sunrise: 0, sunset: 0 },
  } as any,
  forecastData: [] as any,
});

const renderWithState = (cities: City[], pathname: string) => {
  const store = configureStore({
    reducer: {
      weather: weatherReducer,
      modal: modalReducer,
    },
    preloadedState: {
      weather: { cities },
      modal: { isOpened: false },
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[pathname]}>
        <Suspense fallback={null}>
          <RouteLocation />
          <App />
        </Suspense>
      </MemoryRouter>
    </Provider>
  );
};

describe("route checks", () => {
  it("redirects / to first readable city", async () => {
    const city = cityWithData(1, "Los Angeles", "USA");
    renderWithState([city], "/");

    const expectedSlug = getCityRouteSlug(city, [city]);
    expect(await screen.findByTestId("heading")).toBeTruthy();
    expect(screen.getByTestId("current-path").textContent).toBe(`/${expectedSlug}`);
    expect(screen.getByTestId("heading").textContent).toContain("Los Angeles");
  });

  it("opens readable city route", async () => {
    const city = cityWithData(2, "New York", "USA");
    const slug = getCityRouteSlug(city, [city]);

    renderWithState([city], `/${slug}`);
    expect(await screen.findByTestId("heading")).toBeTruthy();
    expect(screen.getByTestId("current-path").textContent).toBe(`/${slug}`);
  });

  it("shows 404 on unknown route", async () => {
    const city = cityWithData(3, "Kyiv", "Ukraine");
    renderWithState([city], "/wrong-city");
    expect(await screen.findByText("404 City not found")).toBeTruthy();
  });

  it("shows 404 on old numeric route", async () => {
    const city = cityWithData(4, "Kyiv", "Ukraine");
    renderWithState([city], "/123");
    expect(await screen.findByText("404 City not found")).toBeTruthy();
  });

  it("shows add-city screen when list is empty", async () => {
    renderWithState([], "/unknown");

    expect(await screen.findByText("No Cities Found")).toBeTruthy();
  });

  it("switches route by city tabs", async () => {
    const cities = [
      cityWithData(10, "Los Angeles", "USA"),
      cityWithData(11, "Kyiv", "Ukraine"),
    ];
    renderWithState(cities, `/${getCityRouteSlug(cities[0], cities)}`);

    const secondCityTab = screen.getByRole("tab", { name: "Kyiv" });
    fireEvent.click(secondCityTab);

    const expectedSlug = getCityRouteSlug(cities[1], cities);
    expect(await screen.findByTestId("heading")).toBeTruthy();
    expect(screen.getByTestId("current-path").textContent).toBe(`/${expectedSlug}`);
  });
});
