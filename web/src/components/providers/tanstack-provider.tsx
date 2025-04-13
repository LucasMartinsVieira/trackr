"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UseQueryClientProvider = ({ children }: any) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
