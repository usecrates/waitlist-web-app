"use client";
import { createContext, use, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLogin, useLogout, usePrivy } from "@privy-io/react-auth";
import { api } from "@/config";
import { useRouter } from "next/navigation";
import { useEnrichedUser } from "@/hooks/user-hooks";
import { toast } from "sonner";
import { EnrichedUser } from "@/lib/interfaces";
interface AuthContextValue {
  address: string;
  user: any;
  authenticated: boolean;
  customizeLogin: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  userData: EnrichedUser | undefined;
}
const PrivyAuthContext = createContext<AuthContextValue | undefined>(undefined);
export const PrivyAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { login } = useLogin();
  const { logout } = useLogout();
  const { user, authenticated } = usePrivy();
  const [address, setAddress] = useState("");
  const { data: userData } = useEnrichedUser(address, authenticated);
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
      (account) => account.type === "wallet" && (account.walletClientType === "privy" || account.walletClientType === "metamask") && account.chainType==="ethereum" 
    );
    setAddress((wallet as any)?.address || "");
  }, [user]);
  
  const value = useMemo(
    () => ({
      user,
      userData,
      address,
      authenticated,
      customizeLogin,
      logout,
    }),
    [user,userData, address, authenticated, customizeLogin, logout]
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
