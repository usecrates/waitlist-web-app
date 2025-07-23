"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { ReactNode, StrictMode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function PrivyProviderWrapper({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
          config={{
            appearance: {
              theme: "dark",
              walletChainType: "ethereum-and-solana",
              showWalletLoginFirst: true,
            },
            loginMethods: ["google", "passkey", "wallet", "twitter", "email"],
          }}
        >
          {children}
        </PrivyProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
