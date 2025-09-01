import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { usePrivyAuth } from "@/context/PrivyAuthContext";
import { useCreateKYCLink, useEnrichedUser, useRegisterUser } from "@/hooks/user-hooks";
import Dinari from "@dinari/api-sdk";
import { useSignMessage } from "wagmi";
import { api } from "@/config";
import toast from "react-hot-toast";

interface KycModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  crate?: {
    name?: string;
    meta?: string;
    image?: string;
    subscriptionAmount?: number;
  };
}

export function KycModal({ open, onOpenChange, crate }: KycModalProps) {
  const hasPaymentStep = !!crate?.subscriptionAmount && crate.subscriptionAmount > 0;
  const steps = ["Register", "KYC", "Link Wallet"].concat(hasPaymentStep ? ["Payment"] : []);
  const [step, setStep] = useState(0);
  const [duration, setDuration] = useState("3 Months");
  const total = crate?.subscriptionAmount || 15;
  const nextRenewal = "18th Oct 2025";

  // Onboarding state
  const { address, authenticated } = usePrivyAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { data: userData, isLoading, refetch: refetchUser } = useEnrichedUser(address, authenticated);
  const { mutate: registerUser, isPending: isRegistering } = useRegisterUser();
  const { mutate: kycMutate, isPending: kycPending, isSuccess: kycSuccess, isError, error: kycError, data: kycData } = useCreateKYCLink();
  const { signMessageAsync } = useSignMessage();
  const [walletLinking, setWalletLinking] = useState(false);
  const [walletLinked, setWalletLinked] = useState(false);
  const [kycLink,setKycLink] = useState();
  // Step completion logic
  const hasRegistered = !!(userData as import("@/lib/interfaces").EnrichedUser)?.entity_id;
  const hasStartedKYC = !!(userData as import("@/lib/interfaces").EnrichedUser)?.is_kyc_complete;
  const hasLinkedWallet = !!(userData as import("@/lib/interfaces").EnrichedUser)?.is_dinari_wallet_link || walletLinked;

  React.useEffect(() => {
    if (!open) setStep(0);
  }, [open]);

  // Register handler
  const handleRegister = React.useCallback(() => {
    if (!address) return toast.error("Please connect your wallet.");
    if (!name) return toast.error("Please enter your name.");
    if (!email) return toast.error("Please enter your email.");
    registerUser({ wallet: address, name, email: email || "" },{
      onSuccess: () => {
        refetchUser();
      }
    });
  }, [address, name, email, registerUser]);

  // // Refetch user after registration
  React.useEffect(() => {
    if (!isRegistering && hasRegistered) {
      refetchUser();
    }
  }, [isRegistering, hasRegistered, refetchUser]);

  // KYC handler with refetch
  
  const handleKYC = () => {
    const enriched = userData as import("@/lib/interfaces").EnrichedUser;
    if (!enriched?.entity_id) return toast.error("Please register first.");
  
    console.log(enriched.entity_id, "enriched");
  
    kycMutate(enriched.entity_id, {
      onSuccess: (data) => {
        console.log("✅ KYC Data:", data); 
        setKycLink(data.data.kyc_res.embed_url);
        console.log(kycLink);
        // refetchUser();
      },
      onError: (err: any) => {
        toast.error(err.message || "KYC failed");
      }
    });
  };

  // Refetch user after KYC success
  React.useEffect(() => {
    if (kycSuccess) {
      refetchUser();
    }
  }, [kycSuccess, refetchUser]);

  // Wallet link handler
  const handleLinkWallet = async () => {
    setWalletLinking(true);
    try {
      const client = new Dinari({
        apiKeyID: process.env.NEXT_PUBLIC_DINARI_API_KEY_ID,
        apiSecretKey: process.env.NEXT_PUBLIC_DINARI_API_SECRET_KEY,
        environment: "sandbox",
      });
      const enriched = userData as import("@/lib/interfaces").EnrichedUser;
      // if (!enriched?.dinari_account_id) return toast.error("Please create an Entity ID first.");
      const nonceResp = await client.v2.accounts.wallet.external.getNonce(enriched.dinari_account_id, {
        wallet_address: address,
        chain_id: "eip155:0",
      });
      const signature = await signMessageAsync({ message: nonceResp.message });
      const linkWallet = await client.v2.accounts.wallet.external.connect(enriched.dinari_account_id, {
        chain_id: "eip155:0",
        nonce: nonceResp.nonce,
        signature,
        wallet_address: address,
      });
      if (linkWallet.address) {
        const res = await api.post('/user/link-wallet', {
          wallet: address,
          flag: true
        });
        if (res.data.success) {
          setWalletLinked(true);
          toast.success("Wallet linked successfully!");
          refetchUser();
        } else {
          toast.error(`Failed to link wallet: ${res.data.message}`);
        }
      } else {
        toast.error("Failed to link wallet. Please try again.");
      }
    } finally {
      setWalletLinking(false);
    }
  };

  // Auto-advance logic
  React.useEffect(() => {
    if (step === 0 && hasRegistered) setStep(1);
    if (step === 1 && hasStartedKYC) setStep(2);
    if (step === 2 && hasLinkedWallet) {
      if (hasPaymentStep) setStep(3);
      else onOpenChange(false);
    }
  }, [step, hasRegistered, hasStartedKYC, hasLinkedWallet, hasPaymentStep, onOpenChange]);

  // React.useEffect(() => {
  //   if (kycSuccess && kycLink) {
  //     window.open(kycLink, "_blank");
  //   }
  // }, [kycSuccess, kycLink]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md text-white w-full bg-[#181818] p-0 rounded-2xl font-chakra">
        <DialogTitle>{crate?.name ? `KYC for ${crate.name}` : 'KYC Onboarding'}</DialogTitle>
        <div className="p-3">
          <div className="flex bg-[#121212] justify-between items-center p-2 ">
            <div className="text-2xl text-white font-bold">Onboarding</div>
            <button className="text-gray-400 hover:text-white" onClick={() => onOpenChange(false)}>
              <X className="text-white" size={20} />
            </button>
          </div>
         
          {/* Step Content */}
          {step === 0 && (
            <>
              <div className="text-lg font-semibold mt-4 mb-4">Register your account</div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full mb-3 px-3 py-2 rounded bg-[#2a2a2a] border border-gray-500 text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={hasRegistered}
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full mb-3 px-3 py-2 rounded bg-[#2a2a2a] border border-gray-500 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={hasRegistered}
              />
              <input
                type="text"
                placeholder="Wallet Address"
                className="w-full mb-4 px-3 py-2 rounded bg-[#2a2a2a] border border-gray-500 text-white"
                value={address || ""}
                disabled
              />
              <button
                className="w-full font-bold py-3 rounded text-lg mt-2"
                style={{
                  background: "linear-gradient(180deg, #7B7B7B 0%, #EBEBEB 27.19%, #999999 72.17%)",
                  backgroundBlendMode: "normal, normal",
                  color: "#000"
                }}
                onClick={handleRegister}
                disabled={hasRegistered || isRegistering}
              >
                {isRegistering ? "Creating..." : hasRegistered ? "Registered" : "Create Entity ID"}
              </button>
            </>
          )}
          {step === 1 && (
            <>
              <div className="text-lg font-semibold mt-4 mb-4">KYC Verification</div>
              <button
                onClick={handleKYC}
                className="w-full font-bold py-3 rounded text-lg mt-2"
                style={{
                  background: "linear-gradient(180deg, #7B7B7B 0%, #EBEBEB 27.19%, #999999 72.17%)",
                  backgroundBlendMode: "normal, normal",
                  color: "#000"
                }}
                disabled={!hasRegistered || hasStartedKYC || kycPending}
              >
                {kycPending ? "Loading..." : hasStartedKYC ? "KYC Complete" : "Start KYC"}
              </button>
              {kycLink && (
                <a
                  href={kycLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline text-sm block mt-2"
                >
                  View KYC Portal
                </a>
              )}
            </>
          )}
          {step === 2 && (
            <>
              <div className="text-lg font-semibold mt-4 mb-4">Link Wallet</div>
              <button
                onClick={handleLinkWallet}
                className="w-full font-bold py-3 rounded text-lg mt-2"
                style={{
                  background: "linear-gradient(180deg, #7B7B7B 0%, #EBEBEB 27.19%, #999999 72.17%)",
                  backgroundBlendMode: "normal, normal",
                  color: "#000"
                }}
                disabled={!hasStartedKYC || hasLinkedWallet || walletLinking}
              >
                {walletLinking ? "Linking..." : hasLinkedWallet ? "Wallet Linked" : "Link to Dinari"}
              </button>
            </>
          )}
          {step === 3 && hasPaymentStep && (
            <>
              <div className="text-lg font-semibold mt-4 mb-4">Complete Payment for {crate?.name || 'Nancy Pelosi'} Crate</div>
              <div className="flex items-center border gap-4 border-[#484848] bg-[#232323] rounded-md p-3 mb-4 mt-2 relative">
                <div className="p-[2px] rounded-lg" style={{ background: "linear-gradient(180deg, #8B8B8B 0%, #E9E9E9 50%, #8B8B8B 100%)" }}>
                  <img src={crate?.image} className="w-12 h-12 rounded-lg object-cover" alt="crate" />
                </div>
                <div>
                  <div className="text-lg font-semibold">{crate?.name || 'Nancy Pelosi'}</div>
                  <div className="text-xs text-[#A1A1A1]">{crate?.meta || 'Democrat/House/California'}</div>
                </div>
              </div>
              <div className="mb-2 mt-2 text-base font-medium">Select Duration</div>
              <div className="mb-4">
                <select
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  className="w-full bg-[#232323] border border-[#484848] text-white rounded px-4 py-3 text-base font-chakra focus:outline-none"
                >
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="12 Months">12 Months</option>
                </select>
              </div>
              <div className="flex justify-between text-base mb-1">
                <span className="text-[#A1A1A1]">Total</span>
                <span className="font-bold">${total}</span>
              </div>
              <div className="flex justify-between text-base mb-6">
                <span className="text-[#A1A1A1]">Next Renewal</span>
                <span className="font-bold">{nextRenewal}</span>
              </div>
              <button
                className="w-full font-bold py-3 rounded text-lg mt-2"
                style={{
                  background: "linear-gradient(180deg, #7B7B7B 0%, #EBEBEB 27.19%, #999999 72.17%)",
                  backgroundBlendMode: "normal, normal",
                  color: "#000"
                }}
                onClick={() => onOpenChange(false)}
              >
                Pay & Subscribe
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 