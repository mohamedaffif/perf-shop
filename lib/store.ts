import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { uploadApi } from "./api/uploadApi";
import { productsApi } from "./api/productsApi";
import { brandsApi } from "./api/brandsApi";
import { categoriesApi } from "./api/categoriesApi";
import { searchApi } from "./api/searchApi";
import cartReducer from "@/redux/slices/cartSlice";

const persistedCartReducer = persistReducer({ key: "cart", storage }, cartReducer);

export const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [brandsApi.reducerPath]: brandsApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE],
      },
    }).concat(
      uploadApi.middleware,
      productsApi.middleware,
      brandsApi.middleware,
      categoriesApi.middleware,
      searchApi.middleware
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
