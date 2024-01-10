"use client";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 1800000,
          },
        },
      })
  );
  return (
    <CacheProvider>
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <SessionProvider
            refetchOnWindowFocus={true}
            refetchWhenOffline={false}
            refetchInterval={30 * 60 * 60}
            baseUrl={process.env.NEXT_PUBLIC_BASE_URL}
          >
            {children}
          </SessionProvider>
          <ReactQueryDevtools initialIsOpen={true} />
        </QueryClientProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
