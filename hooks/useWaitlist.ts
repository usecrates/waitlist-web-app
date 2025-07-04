
import { api } from "@/config";
import { toast } from "sonner";

export function useWaitlist() {
  const joinWaitlist = async (wallet: string, email: string) => {
    const promise = api.post("/waitlist/join", {
      wallet,
      email,
    });

    toast.promise(promise, {
      loading: "Joining the waitlist...",
      success: (res) => {
        return res?.data?.message || "Successfully joined!";
      },
      error: (err) => {
        return err?.response?.data?.message || "Something went wrong";
      },
    });

    try {
      await promise;
    } catch (err: any) {
    } finally {
    }
  };

  return { joinWaitlist };
}
