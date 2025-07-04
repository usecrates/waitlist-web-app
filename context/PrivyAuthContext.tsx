"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLogin, useLogout, usePrivy } from "@privy-io/react-auth";

interface AuthContextValue {
  address: string;
  user: any;
  authenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const PrivyAuthContext = createContext<AuthContextValue | undefined>(undefined);

export const PrivyAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { login } = useLogin();
  const { logout } = useLogout();
  const { user, authenticated } = usePrivy();

  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return setAddress("");
    const wallet = user.linkedAccounts.find(
      (account) => account.type === "wallet" && account.walletClientType === "privy"
    );
    setAddress((wallet as any)?.address || "");
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      address,
      authenticated,
      login: async () => {
        setLoading(true);
        try {
          await login();
        } finally {
          setLoading(false);
        }
      },
      logout,
      loading,
    }),
    [user, address, authenticated, login, logout, loading]
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
