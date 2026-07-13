"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { store } from "./store";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({
  children,
}: ProvidersProps) {
  useEffect(() => {
    return setupListeners(store.dispatch);
  }, []);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}