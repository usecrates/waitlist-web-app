"use client";
import React, { type ReactNode, StrictMode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { sepolia } from "viem/chains";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, http, WagmiProvider } from 'wagmi'
const queryClient = new QueryClient()

// 1. Get projectId from https://cloud.reown.com
function PrivyProviderWrapper({ children }: { children: ReactNode }) {
  const wagmiConfig = createConfig({
    chains: [sepolia],
    transports: {
      [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL!),
    },
  })
  return (
    <StrictMode>
      <PrivyProvider
        appId={
          process.env.NEXT_PUBLIC_PRIVY_APP_ID!
        }
        config={{
          appearance: {
            theme: "dark",
            walletChainType: "ethereum-only", // EVM only
            showWalletLoginFirst: true,
          },
          loginMethods: ["google", "passkey", "wallet", "twitter", "email"],
          embeddedWallets: {
            ethereum: {
              createOnLogin: "users-without-wallets",
            },
          },
          defaultChain:sepolia,
          supportedChains:[sepolia],

          // externalWallets removed for linter compliance
        }}
      >
          <QueryClientProvider client={queryClient}>
            <WagmiProvider config={wagmiConfig}>
              {children}
            </WagmiProvider>
          </QueryClientProvider>
      </PrivyProvider>
    </StrictMode>
  );
}

export default PrivyProviderWrapper;
