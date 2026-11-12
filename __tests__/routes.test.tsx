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

jest.mock("../src/components/CityPage/CityLocationMap", () => ({
  __esModule: true,
  default: ({ longitude, latitude }: { longitude: number; latitude: number }) => (
    <div data-testid="city-pin">{longitude},{latitude}</div>
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

  it("places the current city's pin below the forecast and updates it when changing tabs", async () => {
    const ORIGINAL_TOKEN = process.env.VITE_MAPBOX_ACCESS_TOKEN;
    process.env.VITE_MAPBOX_ACCESS_TOKEN = "test-token";

    try {
      const KYIV = { ...cityWithData(10, "Kyiv", "Ukraine"), latitude: 50.45, longitude: 30.52 };
      const SYDNEY = { ...cityWithData(11, "Sydney", "Australia"), latitude: -33.87, longitude: 151.21 };
      const CITIES = [KYIV, SYDNEY];

      renderWithState(CITIES, `/${getCityRouteSlug(KYIV, CITIES)}`);

      const FORECAST = screen.getByText("24-hour forecast");
      const MAP = screen.getByRole("region", { name: "Map of Kyiv, Ukraine" });
      expect(FORECAST.compareDocumentPosition(MAP) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect((await screen.findByTestId("city-pin")).textContent).toBe("30.52,50.45");

      fireEvent.click(screen.getByRole("tab", { name: "Sydney" }));

      expect(screen.getByRole("region", { name: "Map of Sydney, Australia" })).toBeTruthy();
      expect((await screen.findByTestId("city-pin")).textContent).toBe("151.21,-33.87");
    } finally {
      if (ORIGINAL_TOKEN === undefined) {
        delete process.env.VITE_MAPBOX_ACCESS_TOKEN;
      } else {
        process.env.VITE_MAPBOX_ACCESS_TOKEN = ORIGINAL_TOKEN;
      }
    }
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
