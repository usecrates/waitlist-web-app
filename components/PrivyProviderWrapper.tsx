"use client";
import { sepolia } from "viem/chains";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { PrivyProvider } from "@privy-io/react-auth";

import { ReactNode, StrictMode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function PrivyProviderWrapper({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
   const wagmiConfig = createConfig({
    chains: [sepolia],
    transports: {
      [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL!),
    },
  })
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
          <WagmiProvider config={wagmiConfig}>
              {children}
            </WagmiProvider>
        </PrivyProvider>
      </QueryClientProvider>

    </StrictMode>
  );
}
