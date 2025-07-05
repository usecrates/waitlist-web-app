"use client";
import React, { type ReactNode } from 'react'
import { PrivyProvider } from "@privy-io/react-auth";
import { monadTestnet } from "viem/chains";
import { StrictMode } from "react";

function PrivyProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <StrictMode>
      <PrivyProvider
        appId={
          process.env.NEXT_PUBLIC_PRIVY_APP_ID!
        }
        config={{
          appearance: {
            theme: "light",
            walletChainType: "ethereum-only",
          },
          defaultChain: monadTestnet,
          supportedChains: [monadTestnet],
          loginMethods: ["google", "passkey", "wallet","twitter"],
          embeddedWallets: {
            ethereum: { createOnLogin: "all-users" },
          },
        }}
      >
        {children}
      </PrivyProvider>
    </StrictMode>
  );
}

export default PrivyProviderWrapper;