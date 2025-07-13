import { configureStore } from "@reduxjs/toolkit";
import { documentApi } from "./api/document";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { loginApi } from "./api/login";
import authSlice from "./authSlice";
import appSlice from "./appSlice";

import { contentApi } from "./api/content";

import { categoryApi } from "./api/category";
import { blogApi } from "./api/blog";
import { imagesApi } from "./api/image";
import { productApi } from "./api/produc";
import { orderApi } from "./api/order";
import { productRateApi } from "./api/productRate";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    app: appSlice,
    [documentApi.reducerPath]: documentApi.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [contentApi.reducerPath]: contentApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [imagesApi.reducerPath]: imagesApi.reducer,
    [productRateApi.reducerPath]: productRateApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(documentApi.middleware)
      .concat(productRateApi.middleware)
      .concat(loginApi.middleware)
      .concat(orderApi.middleware)
      .concat(productApi.middleware)
      .concat(contentApi.middleware)
      .concat(categoryApi.middleware)
      .concat(blogApi.middleware)
      .concat(imagesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);

export const resetAllState = () => {
  store.dispatch(documentApi.util.resetApiState());
  store.dispatch(loginApi.util.resetApiState());
  store.dispatch(contentApi.util.resetApiState());
  store.dispatch(categoryApi.util.resetApiState());
  store.dispatch(blogApi.util.resetApiState());
  store.dispatch(imagesApi.util.resetApiState());
};
