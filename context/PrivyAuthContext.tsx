"use client";
import { createContext, use, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLogin, useLogout, usePrivy } from "@privy-io/react-auth";
import { api } from "@/config";
import { useRouter } from "next/navigation";
import { useEnrichedUser } from "@/hooks/user-hooks";
import { toast } from "sonner";
interface AuthContextValue {
  address: string;
  user: any;
  authenticated: boolean;
  customizeLogin: () => Promise<void>;
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
  const router = useRouter();
  console.log(address,"useraddress");
  const { data: userData } = useEnrichedUser(address, authenticated);
  console.log(userData, "userData");
  const customizeLogin = useCallback(async () => {
    try {
      setLoading(true);
      if (address) {
        const response = await api.get(
          `/waitlist/check?wallet=${address}`
        );
        const isVerified = response?.data?.data?.isVerified;
        console.log(isVerified, "isVerified");
        if (isVerified) {
          localStorage.setItem("isVerified", "true");
          toast.dismiss();
          toast.success("You are verified user !!!");
          router.push("/launch");
        }
      } else {
        await login();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
      address,
      authenticated,
      customizeLogin,
      logout,
      loading,
    }),
    [user, address, authenticated, customizeLogin, logout, loading]
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
