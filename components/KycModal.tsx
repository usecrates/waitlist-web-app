import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface KycModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  crate?: {
    name?: string;
    meta?: string;
    image?: string;
  };
}

export function KycModal({ open, onOpenChange, crate }: KycModalProps) {
  const [duration, setDuration] = useState("3 Months");
  const [step, setStep] = useState<'form' | 'success'>('form');
  const total = 15;
  const nextRenewal = "18th Oct 2025";
  const avatars = [
    "/assets/placeholder-user.jpg",
    "/assets/placeholder-user.jpg"
  ];

  const handleConfirm = () => {
    setStep('success');
  };

  // Reset step when modal closes
  React.useEffect(() => {
    if (!open) setStep('form');
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md text-white w-full bg-[#181818] p-0 rounded-2xl font-chakra">
        <div className="p-3">
          <div className="flex bg-[#121212] justify-between items-center p-2 ">
            <div className="text-2xl text-white font-bold">{step === 'form' ? 'KYC' : 'Subscribe crate'}</div>
            <button className="text-gray-400 hover:text-white" onClick={() => onOpenChange(false)}>
              <X className="text-white" size={20} />
            </button>
          </div>
          {step === 'form' ? (
            <>
              <div className="text-lg font-semibold mt-4 mb-4">Do you confirm to subscribe to the {crate?.name || 'Nancy Pelosi'} CRATE</div>
              {/* Crate Info with avatars */}
              <div className="flex items-center border gap-4 border-[#484848] bg-[#232323] rounded-md p-3 mb-4 mt-2 relative">
                <div className="p-[2px] rounded-lg" style={{ background: "linear-gradient(180deg, #8B8B8B 0%, #E9E9E9 50%, #8B8B8B 100%)" }}>
                  <img src={crate?.image} className="w-12 h-12 rounded-lg object-cover" alt="crate" />
                </div>
                <div>
                  <div className="text-lg font-semibold">{crate?.name || 'Nancy Pelosi'}</div>
                  <div className="text-xs text-[#A1A1A1]">{crate?.meta || 'Democrat/House/California'}</div>
                </div>
                
              </div>
              {/* Select Token and Asset */}
              <div className="mb-2 mt-2 text-base font-medium">Select Token and Asset</div>
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
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center my-6">
                <img src="/assets/buy_tick.svg" alt="Success" className="w-14 h-14 mb-2" />
                <div className="text-lg w-full font-semibold text-center mb-2">
                  Congrats, You've subscribed to {crate?.name || 'Nancy Pelosi'} Crate for {duration}!
                </div>
              </div>
              <div className="flex items-center border gap-4 border-[#484848] bg-[#232323] rounded-md p-3 mb-8 mt-2">
                <div className="p-[2px] rounded-lg" style={{ background: "linear-gradient(180deg, #8B8B8B 0%, #E9E9E9 50%, #8B8B8B 100%)" }}>
                  <img src={crate?.image} className="w-12 h-12 rounded-lg object-cover" alt="crate" />
                </div>
                <div>
                  <div className="text-lg font-semibold">{crate?.name || 'Nancy Pelosi'}</div>
                  <div className="text-xs text-[#A1A1A1]">{crate?.meta || 'Democrat/House/California'}</div>
                </div>
              </div>
              <button
                className="w-full font-bold py-3 rounded text-lg mt-2 border-2 border-[#A259FF]"
                style={{
                  background: "linear-gradient(180deg, #7B7B7B 0%, #EBEBEB 27.19%, #999999 72.17%)",
                  backgroundBlendMode: "normal, normal",
                  color: "#000"
                }}
              >
                Invest
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 