import { EnrichedUser } from "@/lib/interfaces";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/config";

export const fetchUserByWallet = async (wallet: string): Promise<EnrichedUser> => {
    const res = await api.get(`/user/${wallet}`);
    return res.data.data;
};

export const useEnrichedUser = (wallet: string, enabled: boolean) => {
    return useQuery({
        queryKey: ["user", wallet],
        queryFn: () => fetchUserByWallet(wallet),
        enabled: enabled && !!wallet, // only run if wallet is available
    });
};
