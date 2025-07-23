import { EnrichedUser, RegisterUserInput } from "@/lib/interfaces";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/config";
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from "react";
interface LinkWalletPayload {
    wallet: string;
    nonceResp: any;
    signature: any;
}
export function useHasMounted() {
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);
    return hasMounted;
}


const linkWallet = async (payload: LinkWalletPayload) => {
    const res = await api.post('/user/link-wallet', payload);
    return res.data;
};
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
    console.log(input, "hello");
    const res = await api.post('/user/register', input);
    return res.data;
};

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
        onError: (error) => {
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

export const useLinkWallet = () => {
    return useMutation({
        mutationFn: linkWallet,
    });
};