import { api } from "@/config";
import { toast } from "sonner";

export function useCheckWaitlist() {
  const checkWaitlist = async (wallet: string, inviteCode: string) => {
    const promise = api.get(`/waitlist/check?wallet=${wallet}&inviteCode=${inviteCode}`);
    toast.promise(promise, {
      loading: "Verifying invite code...",
      success: (res) => {
        return res?.data?.message || "Invite code verified successfully!";
      },
      error: (err) => {
        return err?.response?.data?.message || "Failed to verify invite code";
      },
    });

    try {
      const response = await promise;
      console.log("Check waitlist response:", response);
      return response?.data;
    } catch (err) {
      return null;
    }
  };

  return { checkWaitlist };
}
