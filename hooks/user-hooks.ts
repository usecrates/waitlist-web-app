import { EnrichedUser, RegisterUserInput } from "@/lib/interfaces";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/config";
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
type SubscribeCrateParams = {
    wallet: string;
    crateId: string;
};
export function useHasMounted() {
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);
    return hasMounted;
}
const createKYCLink = async (entity_id: string) => {
    try {
        const res = await api.get(`/user/kyc/${entity_id}`);

        if (!res.data.success) {
            throw new Error(res.data.message || "Failed to fetch user");
        }
        return res.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || error.message || "Unknown error");
    }
};

const fetchUserByWallet = async (wallet: string): Promise<EnrichedUser> => {
    try {
        const res = await api.get(`/user/${wallet}`);
        if (!res.data.success) {
            throw new Error(res.data.message || "Failed to fetch user");
        }
        return res.data.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || error.message || "Unknown error");
    }
};
const registerUser = async (input: RegisterUserInput) => {
    const res = await api.post('/user/register', input);
    return res.data;
};

const fetchAllCrates = async () => {
    try {
        const res = await api.get('/crates');
        if (!res.data.success) {
            throw new Error(res.data.message || "Failed to fetch crates");
        }
        return res.data.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || error.message || "Unknown error");
    }
}

const getCrateById = async (crateId: string) => {
    try {
        const res = await api.get(`/crates/${crateId}`);
        if (!res.data.success) {
            throw new Error(res.data.message || "Failed to fetch crate");
        }
        return res.data.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || error.message || "Unknown error");
    }
}

export const useRegisterUser = () => {
    return useMutation({
        mutationFn: registerUser,
    });
};
export const useEnrichedUser = (wallet: string, enabled: boolean) => {
    return useQuery<EnrichedUser | null>({
        queryKey: ["user", wallet],
        queryFn: () => fetchUserByWallet(wallet),
        enabled: enabled && !!wallet,
        retry: false, // prevent auto retries for "User not found"
        onError: (error: Error) => {
            console.error("Failed to fetch user:", error);
        },
        // You can transform error into null result if you want the consumer to not break
        // select: (data) => data || null,
    });
};

export const useCreateKYCLink = () => {
    return useMutation({
        mutationFn: (entity_id: string) => createKYCLink(entity_id),
    });
};

export const useGetAllCrates = () => {
    return useQuery({
        queryKey: ["crates"],
        queryFn: fetchAllCrates,
        retry: false, // prevent auto retries for "User not found"
        onError: (error: Error) => {
            console.error("Failed to fetch crates:", error);
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export const useGetCrateById = (crateId: string) => {
    return useQuery({
        queryKey: ["crate", crateId],
        queryFn: () => getCrateById(crateId),
        enabled: !!crateId,
        retry: false, // prevent auto retries for "User not found"
        onError: (error: Error) => {
            console.error("Failed to fetch crate:", error);
        },
        staleTime: 1000 * 60 * 5 // 5 minutes
    });
}

export const useSubscribeCrate = () => {
    return useMutation({
        mutationFn: async ({ wallet, crateId }: SubscribeCrateParams) => {
            let id = toast.loading("Subscribing to crate...");
            try {
                //todo if not free take money in admin wallet
                const response = await api.post(`/user/${wallet}/subscribe`, {
                    crateId,
                });
                toast.success(response.data.message, {
                    id,
                });
                return response.data;
            } catch (error) {
                toast.error("Failed to subscribe to crate", {
                    id,
                });
            }
        },
    });
};