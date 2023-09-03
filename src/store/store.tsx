import { configureStore, isAnyOf } from "@reduxjs/toolkit";
import weatherReducer from "./weatherSlice";
import modalReducer from "./modalReducer";
import { listenerMiddleware, startAppListening } from "../utils/listenerMiddleware";

import { addCity, removeCity } from "./weatherSlice";

// Listen to city list changes
// and save them to localStorage
startAppListening({
  matcher: isAnyOf(addCity, removeCity),
  effect: async (action, listenerApi) => {
    const cities = listenerApi.getState().weather.cities;

    const citiesToSave = cities.map(
      ({ id, city, country, latitude, longitude, ...rest }) => ({
        id,
        city,
        country,
        latitude,
        longitude,
      })
    );

    localStorage.setItem("weatherState", JSON.stringify({ cities: citiesToSave }));
  },
});

const store = configureStore({
  reducer: {
    weather: weatherReducer,
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
