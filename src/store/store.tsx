import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./weatherSlice";
import modalReducer from "./modalReducer";

const store = configureStore({
  reducer: {
    weather: weatherReducer,
    modal: modalReducer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
