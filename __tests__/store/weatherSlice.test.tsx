import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { configureStore, Store } from "@reduxjs/toolkit";

import weatherReducer, { addCity, removeCity } from "./../../src/store/weatherSlice";
import { InitialState, City } from "./../../src/types/types";

describe("weatherSlice", () => {
  let store: Store;

  beforeEach(() => {
    store = configureStore({ reducer: { weather: weatherReducer } });
  });

  // Add City
  it("should add a city to the state", () => {
    const city = {
      id: 123,
      city: "Test City",
      country: "Test Country",
      latitude: 0,
      longitude: 0,
    };
    store.dispatch(addCity(city));
    const state = store.getState().weather;
    expect(state.cities).toContain(city);
  });

  test("addCity should not modify state when called with falsy payload", () => {
    const state: InitialState = { cities: [] };
    const action = { type: "weather/addCity", payload: null };
    const result = weatherReducer(state, action);
    expect(result).toEqual({ cities: [] });

    const action2 = { type: "weather/addCity", payload: undefined };
    const result2 = weatherReducer(state, action2);
    expect(result2).toEqual({ cities: [] });

    const action3 = { type: "weather/addCity", payload: "" };
    const result3 = weatherReducer(state, action3);
    expect(result3).toEqual({ cities: [] });
  });

  // Remove City
  it("should remove a city object from the state by id", () => {
    const city: City = {
      id: 123,
      city: "Test City",
      country: "Test Country",
      latitude: 0,
      longitude: 0,
    };
    store.dispatch(addCity(city));
    const cities1 = store.getState().weather.cities;
    expect(cities1).toContain(city);

    const cityId = 123;
    store.dispatch(removeCity(cityId));
    const cities2: City[] = store.getState().weather.cities;
    expect(cities2.some((city) => city.id === cityId)).toBe(false);
  });
});
