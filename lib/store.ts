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
import { accountApi } from "./api/accountApi";
import { addressesApi } from "./api/addressesApi";
import { couponsApi } from "./api/couponsApi";
import { newsletterApi } from "./api/newsletterApi";
import { contactApi } from "./api/contactApi";
import { subscribersApi } from "./api/subscribersApi";
import { customersApi } from "./api/customersApi";
import { settingsApi } from "./api/settingsApi";
import { ordersApi } from "./api/ordersApi";
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
    [accountApi.reducerPath]: accountApi.reducer,
    [addressesApi.reducerPath]: addressesApi.reducer,
    [couponsApi.reducerPath]: couponsApi.reducer,
    [newsletterApi.reducerPath]: newsletterApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [subscribersApi.reducerPath]: subscribersApi.reducer,
    [customersApi.reducerPath]: customersApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
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
      searchApi.middleware,
      accountApi.middleware,
      addressesApi.middleware,
      couponsApi.middleware,
      newsletterApi.middleware,
      contactApi.middleware,
      subscribersApi.middleware,
      customersApi.middleware,
      settingsApi.middleware,
      ordersApi.middleware
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
