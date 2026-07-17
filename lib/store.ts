import { configureStore } from "@reduxjs/toolkit";
import { uploadApi } from "./api/uploadApi";
import { productsApi } from "./api/productsApi";
import { brandsApi } from "./api/brandsApi";
import { categoriesApi } from "./api/categoriesApi";

export const store = configureStore({
  reducer: {
    [uploadApi.reducerPath]: uploadApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [brandsApi.reducerPath]: brandsApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      uploadApi.middleware,
      productsApi.middleware,
      brandsApi.middleware,
      categoriesApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
