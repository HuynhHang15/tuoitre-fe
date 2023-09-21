import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "./slices/todosSlice";

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
