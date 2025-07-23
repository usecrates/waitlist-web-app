import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { X } from "lucide-react";

interface ExitCrateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  crate?: {
    name?: string;
    meta?: string;
    image?: string;
  };
}

export function ExitCrateModal({ open, onOpenChange, crate }: ExitCrateModalProps) {
  const [step, setStep] = useState<'input' | 'review' | 'status' | 'success'>('input');
  const [units, setUnits] = useState(0);
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [successButtonActive, setSuccessButtonActive] = useState(false);
  // Add order status and batch states
  const [orderStatus, setOrderStatus] = useState<'waiting' | 'completed' | 'error'>('waiting');
  const [batchFilled, setBatchFilled] = useState(0);
  const [batchTotal] = useState(4);

  // Simulate price and percentage
  const price = units === 0 ? 0 : 1045; // Example
  const percent = units === 0 ? 0 : 75; // Example
  const currentValue = 200;

  // Mock review data
  const reviewRows = [
    { stock: 'AAPL', units: '0.12', price: '$353', value: '0.08 $30' },
    { stock: 'AVGO', units: '0.12', price: '$353', value: '0.08 $30' },
    { stock: 'JPM', units: '0.12', price: '$353', value: '0.08 $30' },
    { stock: 'AMZN', units: '0.12', price: '$353', value: '0.08 $30' },
    { stock: 'GOOG', units: '0.12', price: '$353', value: '0.08 $30' },
    { stock: 'MSFT', units: '0.12', price: '$353', value: '0.08 $30' },
  ];
  const subtotal = 950;
  const slippage = 0.8;
  const priceImpact = '<0.1%';
  const totalReceivable = 955;

  // Success button activation timer
  useEffect(() => {
    if (step === 'success') {
      setSuccessButtonActive(false);
      const timer = setTimeout(() => setSuccessButtonActive(true), 3500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Simulate waiting status like BuyCrateModal
  useEffect(() => {
    if (step === 'status') {
      setBatchFilled(0);
      setOrderStatus('waiting');
      let filled = 0;
      const interval = setInterval(() => {
        filled += 1;
        setBatchFilled(filled);
        if (filled === batchTotal) {
          clearInterval(interval);
          setTimeout(() => setOrderStatus('completed'), 50000);
        }
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [step, batchTotal]);

  useEffect(() => {
    if (step === 'status' && orderStatus === 'completed') {
      const timer = setTimeout(() => setStep('success'), 1200);
      return () => clearTimeout(timer);
    }
  }, [step, orderStatus]);

  // Reset state on close
  useEffect(() => {
    if (!open) {
      setStep('input');
      setUnits(0);
      setSelectedToken('USDC');
      setSuccessButtonActive(false);
      setBatchFilled(0);
      setOrderStatus('waiting');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md text-white w-full bg-[#181818] p-0 rounded-2xl font-chakra">
        <div className="p-3">
          <div className="flex bg-[#121212] justify-between items-center p-2 ">
            <div className="text-2xl text-white font-bold">Exit crate</div>
            <button className="text-gray-400 hover:text-white" onClick={() => onOpenChange(false)}>
              <X className="text-white" size={20} />
            </button>
          </div>
      
          {step !== 'success' && (
            <>
            <div className="text-[#C9C9C9] my-4 text-sm">
            This will only sell stocks attributed to this Crate. Your other holdings will remain unaffected.
          </div>
            <div className="flex items-center border gap-4 border-[#484848] bg-[#232323] rounded-md p-3 mb-4">
              <div className="p-[2px] rounded-lg" style={{ background: "linear-gradient(180deg, #8B8B8B 0%, #E9E9E9 50%, #8B8B8B 100%)" }}>
                <img src={crate?.image} className="w-12 h-12 rounded-lg object-cover" alt="crate" />
              </div>
              <div>
                <div className="text-lg font-semibold">{crate?.name}</div>
                <div className="text-xs text-[#A1A1A1]">{crate?.meta}</div>
              </div>
            </div>
            </>
          )}
          {step === 'input' && (
            <>
              <div className="text-center mb-2">Select Token to receive with</div>
              <div className="flex justify-center mb-4">
                <Select value={selectedToken} onValueChange={setSelectedToken}>
                  <SelectTrigger className="w-32 bg-[#181818] border border-[#232323] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#232323] text-white">
                    <SelectItem value="USDC">
                      <span className="flex items-center gap-2">
                        <img src="/assets/usdc.svg" alt="usdc" className="w-5 h-5" /> USDC
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-center text-base font-medium my-6">How Much do you want to sell?</div>
              <div className="flex w-3/4 mx-auto justify-between mb-1">
                <span className="text-left text-[#898989] text-xs font-medium">Units</span>
                
              </div>
              <div className="flex items-center w-3/4 mx-auto gap-2 mb-6">
                <span className="text-right text-white text-lg font-ch">{units}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={units}
                  onChange={e => setUnits(Number(e.target.value))}
                  className="flex-1 h-[5px] accent-[#E9E9E9] bg-[#444] rounded-lg"
                  style={{ minWidth: 0 }}
                />
                <span className="text-left text-white text-lg font-chakra">100</span>
              </div>
              <div className="flex w-3/4 mx-auto mb-1">
                <span className="text-left text-[#898989] w-full text-xs">Price</span>
              </div>
              <div className="flex items-center bg-[#232323] w-3/4 mx-auto rounded px-4 py-2 mb-2">
                <span className="text-2xl font-bold">${price.toLocaleString()}</span>
                <span className="ml-auto text-white/25">{percent}%</span>
              </div>
              <div className="text-center text-[#A1A1A1] mb-4">Current Value: ${currentValue}</div>
              <button
                className={`w-full font-bold py-3 rounded text-lg ${units === 0 ? 'cursor-not-allowed' : ''}`}
                style={units === 0 ? {
                  background: "linear-gradient(180deg, #444 0%, #888 100%)",
                  color: "#222",
                  boxShadow: "0 2px 8px 0 #00000040, 0 1.5px 0 #222 inset",
                  opacity: 0.7
                } : {
                  background: "linear-gradient(180deg, #7B7B7B 0%, #EBEBEB 27.19%, #999999 72.17%)",
                  backgroundBlendMode: "normal, normal",
                  color: "#000"
                }}
                onClick={() => setStep('review')}
                disabled={units === 0}
              >
                Preview
              </button>
            </>
          )}
          {step === 'review' && (
            <>
              <div className="text-lg font-semibold mb-4">Review order</div>
              <div className="overflow-x-auto h-48 overflow-y-auto rounded-lg">
                <table className="w-full text-left text-white">
                  <thead>
                    <tr className="text-[#A1A1A1] text-sm">
                      <th className="py-2 px-2 font-medium">Stock</th>
                      <th className="py-2 px-2 font-medium">Units</th>
                      <th className="py-2 px-2 font-medium">Price</th>
                      <th className="py-2 px-2 font-medium">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewRows.map((row, i) => (
                      <tr key={i} className="border-t border-[#232323] text-base">
                        <td className="py-2 px-2">{row.stock}</td>
                        <td className="py-2 px-2">{row.units}</td>
                        <td className="py-2 px-2">{row.price}</td>
                        <td className="py-2 px-2">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 border-t border-[#232323] pt-4 space-y-2 text-base">
                <div className="flex justify-between">
                  <span className="text-[#A1A1A1]">Subtotal Spend</span>
                  <span className="font-bold">${subtotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#A1A1A1]">Slippage</span>
                  <div>
                    <span className="font-bold">{slippage}</span>
                    <span className="ml-2 text-xs bg-[#232323] px-2 py-1 rounded text-[#A1A1A1]">Custom</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A1A1]">Price Impact</span>
                  <span className="font-bold">{priceImpact}</span>
                </div>
                <div className="flex items-center text-lg mt-2 justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[#A1A1A1]">Total Receivable:</span>
                    <span className="font-bold text-white">${totalReceivable}</span>
                  </div>
                  <button
                    className={`w-1/2 mt-4 font-bold py-3 rounded text-lg${units === 0 ? ' cursor-not-allowed' : ''}`}
                    style={units === 0 ? {
                      background: "linear-gradient(180deg, #444 0%, #888 100%)",
                      color: "#222",
                      boxShadow: "0 2px 8px 0 #00000040, 0 1.5px 0 #222 inset",
                      opacity: 0.7
                    } : {
                      background: "linear-gradient(180deg, #7B7B7B 0%, #EBEBEB 27.19%, #999999 72.17%)",
                      backgroundBlendMode: "normal, normal",
                      color: "#000"
                    }}
                    onClick={() => setStep('status')}
                    disabled={units === 0}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </>
          )}
          {step === 'status' && (
            <>
              {orderStatus === 'completed' && (
                <div className="flex items-center gap-2 text-green-400 text-xl font-semibold mb-2">
                  <span className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center">
                    <svg width="18" height="18" fill="none"><path d="M5 9l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  All orders filled
                </div>
              )}
              {orderStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-400 text-xl font-semibold mb-2">
                  <span className="w-6 h-6 rounded-full bg-red-400 flex items-center justify-center">
                    <svg width="18" height="18" fill="none"><circle cx="9" cy="9" r="8" stroke="#fff" strokeWidth="2"/><path d="M9 5v4m0 4h.01" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
                  </span>
                  Uh-oh, your order couldn't be placed
                </div>
              )}
              {orderStatus === 'waiting' && (
                <div className="flex items-center gap-2 text-white text-xl font-medium mb-2">
                  <span className="w-4 h-4 rounded-full bg-[#313131] flex items-center justify-center"></span>
                  Waiting for order status
                </div>
              )}
              <div className="flex justify-between mb-2">
                <div>
                  <div className="text-xs text-gray-400">Batch</div>
                  <div className="text-base">Sell</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Status</div>
                  <div className="text-base">
                    {orderStatus === 'completed' ? 'Completed' : orderStatus === 'error' ? 'Unplaced' : 'Waiting'}
                  </div>
                </div>
              </div>
              <div className="mb-4 text-xs">{batchFilled} of {batchTotal} filled</div>
              <div className="w-full h-6 bg-[#232323]  mb-6">
                <div
                  className={`h-6 rounded transition-all duration-500 ${orderStatus === 'completed' ? 'bg-green-400' : orderStatus === 'error' ? 'bg-gray-500' : 'bg-green-400'}`}
                  style={{
                    width: orderStatus === 'error'
                      ? '0%'
                      : `${(batchFilled / batchTotal) * 100}%`
                  }}
                />
              </div>
              <div className="flex gap-4">
                <button className="flex-1 bg-[#232323] text-white py-3 rounded">View Portfolio</button>
                <button
                  className={`flex-1 font-bold py-3 rounded text-lg${units === 0 ? ' cursor-not-allowed' : ''}`}
                  style={units === 0 ? {
                    background: "linear-gradient(180deg, #444 0%, #888 100%)",
                    color: "#222",
                    boxShadow: "0 2px 8px 0 #00000040, 0 1.5px 0 #222 inset",
                    opacity: 0.7
                  } : {
                    background: "linear-gradient(180deg, #7B7B7B 0%, #EBEBEB 27.19%, #999999 72.17%)",
                    backgroundBlendMode: "normal, normal",
                    color: "#000"
                  }}
                >
                  Invest More
                </button>
              
              </div>
            </>
          )}
          {step === 'success' && (
            <>
              <div className="flex flex-col items-center my-4">
                <img src="/assets/buy_tick.svg" alt="Success" className="w-14 h-14 mb-2" />
                <div className="text-lg w-3/4 font-semibold text-center mb-2">
                  Your selected holdings have been sold successfully.
                </div>
              </div>
              <div className="border-[#484848] border-t p-3 mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#A1A1A1]">Crate name</span>
                  <span className="font-bold">Pelosi Crate</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#A1A1A1]">Amount sold</span>
                  <span className="font-bold">$123.60</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#A1A1A1]">Remaining</span>
                  <span className="font-bold">$76.40</span>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-[#232323] rounded-md p-3 mb-4 border border-[#484848]">
                <div className="p-[2px] rounded-lg" style={{ background: "linear-gradient(180deg, #8B8B8B 0%, #E9E9E9 50%, #8B8B8B 100%)" }}>
                  <img src={crate?.image} className="w-12 h-12 rounded-lg object-cover" alt="crate" />
                </div>
                <div>
                  <div className="text-lg font-semibold">{crate?.name}</div>
                  <div className="text-xs text-[#A1A1A1]">{crate?.meta}</div>
                </div>
              </div>
              <div className="overflow-x-auto h-44 overflow-y-auto rounded-lg mb-4">
                <table className="w-full text-left text-white">
                  <thead>
                    <tr className="text-[#A1A1A1] text-sm">
                      <th className="py-2 px-2 font-medium">Stock</th>
                      <th className="py-2 px-2 font-medium">Units</th>
                      <th className="py-2 px-2 font-medium">Price</th>
                      <th className="py-2 px-2 font-medium">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewRows.map((row, i) => (
                      <tr key={i} className="border-t border-[#232323] text-base">
                        <td className="py-2 px-2">{row.stock}</td>
                        <td className="py-2 px-2">{row.units}</td>
                        <td className="py-2 px-2">{row.price}</td>
                        <td className="py-2 px-2">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  className="flex-1 font-bold py-3 bg-[#232323] text-white rounded text-lg"
                
                >
                  View Portfolio
                </button>
                <button
                  className="flex-1 font-bold py-3 rounded text-lg"
                  style={{
                    background: "linear-gradient(180deg, #7B7B7B 0%, #EBEBEB 27.19%, #999999 72.17%)",
                    backgroundBlendMode: "normal, normal",
                    color: "#000"
                  }}
                >
                  Discover Crates
                </button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 