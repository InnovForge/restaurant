import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SocketProvider } from "@/context/socket";

export const AppProvider = ({ children }) => {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner size="xl" />
        </div>
      }
    >
      <SocketProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster />

          {children}
        </QueryClientProvider>
      </SocketProvider>
    </React.Suspense>
  );
};
