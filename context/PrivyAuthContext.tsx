"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLogin, useLogout, usePrivy } from "@privy-io/react-auth";
import { useFundWallet } from "@/hooks/user-hooks";
import toast from "react-hot-toast";
interface AuthContextValue {
  address: string;
  user: any;
  authenticated: boolean;
  customizeLogin: () => Promise<void>;
  logout: () => Promise<void>;
}
const PrivyAuthContext = createContext<AuthContextValue | undefined>(undefined);
export const PrivyAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { login } = useLogin();
  const { mutate: fundWallet, isPending: fundingWallet } = useFundWallet();
  const { logout } = useLogout();
  const { user, authenticated } = usePrivy();
  const [address, setAddress] = useState("");
  const handleFundWallet = (useraddress :`0x${string}`) => {
      if (!useraddress) return toast.error("Wallet not connected");
      fundWallet(
        { wallet: useraddress as `0x${string}` , chain_id: 84532 },
        {
          onSuccess: () => {
            toast.success("Wallet funded successfully!");
          },
          onError: () => toast.error("Failed to fund wallet"),
        }
      );
    };
  const customizeLogin = useCallback(async () => {
    try {
      await login();
    } catch (error) {
      return undefined;
    }
  }, [login, address])


  useEffect(() => {
    if (!user) return setAddress("");
    const wallet = user.linkedAccounts.find(
      (account) => account.type === "wallet" && (account.walletClientType === "privy" || account.walletClientType === "metamask") && account.chainType === "ethereum"
    );
    setAddress((wallet as any)?.address || "");
    handleFundWallet((wallet as any)?.address as `0x${string}`);
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      address,
      authenticated,
      customizeLogin,
      logout,
    }),
    [user, address, authenticated, customizeLogin, logout]
  );

  return (
    <PrivyAuthContext.Provider value={value}>
      {children}
    </PrivyAuthContext.Provider>
  );
};

export const usePrivyAuth = () => {
  const ctx = useContext(PrivyAuthContext);
  if (!ctx) throw new Error("usePrivyAuth must be used within PrivyAuthProvider");
  return ctx;
};
