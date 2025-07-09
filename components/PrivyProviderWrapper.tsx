"use client";
import React, { type ReactNode, StrictMode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";

function PrivyProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <StrictMode>
      <PrivyProvider
        appId={
          process.env.NEXT_PUBLIC_PRIVY_APP_ID!
        }
        config={{
          appearance: {
            theme: "dark",
            walletChainType: "solana-only", // Solana only
            showWalletLoginFirst: true,
          },
          solanaClusters: [
            { name: "devnet", rpcUrl: "https://api.devnet.solana.com" },
            { name: "mainnet-beta", rpcUrl: "https://api.mainnet-beta.solana.com" },
            { name: "testnet", rpcUrl: "https://api.testnet.solana.com" },
          ],
          loginMethods: ["google", "passkey", "wallet", "twitter", "email"],
          embeddedWallets: {
            solana: {
              createOnLogin: "users-without-wallets",
            },
          },
          externalWallets: {
            solana: {
              connectors: toSolanaWalletConnectors(),
            },
          },
        }}
      >
        {children}
      </PrivyProvider>
    </StrictMode>
  );
}

export default PrivyProviderWrapper;
