"use client";

import { usePrivyAuth } from "@/context/PrivyAuthContext";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { switchChain } from "@wagmi/core";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useChainId } from "wagmi";
import { config } from "./PrivyProviderWrapper";
const REQUIRED_CHAIN_ID = 11155111; // Sepolia

export default function LoginButton() {
  const { customizeLogin, logout, address, authenticated, loading } = usePrivyAuth();
  const shortAddress = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "";

  const chainId = useChainId();

  const copyToClipboard = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      toast("Address Copied!", { className: "font-ropa", duration: 5000 });
    }
  };

  const handleSwitchChain = async () => {
    try {
      await switchChain(config,{chainId:REQUIRED_CHAIN_ID});
      toast.success("Switched to Sepolia!");
    } catch (err) {
      toast.error("Failed to switch network");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {authenticated && address ? (
        <div className="flex gap-2 text-black">
          {chainId !== REQUIRED_CHAIN_ID ? (
            <Button
              onClick={handleSwitchChain}
              className="text-white font-medium px-4 py-2"
            >
              Switch Network
            </Button>
          ) : (
            <button
              onClick={copyToClipboard}
              className="bg-[#0e0e0e] dark:bg-white font-ropa flex text-white px-4 py-2 font-medium text-md"
            >
              <span>{shortAddress}</span>
              <Copy className="h-4 w-4 mx-2 mt-1" />
            </button>
          )}
          <button
            onClick={logout}
            className="bg-[#0e0e0e] dark:bg-white font-ropa text-white px-4 py-2 font-medium text-md"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={customizeLogin}
          disabled={loading}
          className="bg-white font-ropa text-black font-chakra px-4 py-2 font-medium text-md"
        >
          {loading ? "Logging in..." : "Connect Wallet"}
        </button>
      )}
    </div>
  );
}
