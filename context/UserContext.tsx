"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { backendUrl } from "@/utils/client";

interface UserContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState(null);
  const { user: privyUser, ready, authenticated } = usePrivy();

  const fetchUser = async () => {
    try {
      if (!ready || !authenticated || !privyUser?.wallet?.address) return;

      const wallet = privyUser.wallet.address;
      const res = await axios.get(
        `${backendUrl}/waitlist/check?wallet=${wallet}`
      );
      setUser(res.data?.data);

      if (res.data?.data?.isVerified) {
        localStorage.setItem("isVerified", "true");
      }
    } catch (err) {
      console.error("Failed to fetch waitlist user:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [ready, authenticated, privyUser]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
