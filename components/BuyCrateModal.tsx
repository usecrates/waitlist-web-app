import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { X } from "lucide-react";

interface BuyCrateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  crate?: {
    name?: string;
    meta?: string;
    image?: string;
  };
}

export function BuyCrateModal({ open, onOpenChange, crate }: BuyCrateModalProps) {
  // crate: { name, meta, image }
  const [step, setStep] = useState<'input' | 'review' | 'status' | 'success'>('input');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [balance] = useState(2498.90);
  const [orderStatus, setOrderStatus] = useState<'waiting' | 'completed' | 'error'>('waiting');
  const [batchFilled, setBatchFilled] = useState(0);
  const [batchTotal] = useState(4);

  // Mock order review data
  const reviewRows = [
    { stock: 'AAPL', units: '0.12 $30', price: '$353', weight: '40%' },
    { stock: 'MSFT', units: '0.10 $30', price: '$281', weight: '35%' },
    { stock: 'AMZN', units: '0.08 $30', price: '$111', weight: '40%' },
    { stock: 'GOOG', units: '0.08 $30', price: '$234', weight: '23%' },
    { stock: 'META', units: '0.08 $30', price: '$231', weight: '12%' },
    { stock: 'AVGO', units: '0.08 $30', price: '$839', weight: '8%' },
    { stock: 'IBM', units: '0.03 $30', price: '$55', weight: '10%' },
  ];
  const subtotal = 950;
  const slippage = 0.8;
  const priceImpact = '<0.1%';
  const totalSpend = 955;

  // Simulate order status to success transition
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
          setTimeout(() => setOrderStatus('completed'), 500);
        }
      }, 600);
      return () => clearInterval(interval);
    }
  }, [step, batchTotal]);

  // When orderStatus is completed, go to success after a short delay
  useEffect(() => {
    if (step === 'status' && orderStatus === 'completed') {
      const timer = setTimeout(() => setStep('success'), 1200);
      return () => clearTimeout(timer);
    }
  }, [step, orderStatus]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setStep('input');
      setAmount('');
      setSelectedToken('USDC');
      setBatchFilled(0);
      setOrderStatus('waiting');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md text-white w-full bg-[#181818] p-0 rounded-2xl font-chakra">
        <div className="p-3">
            <div className="flex bg-[#121212] justify-between items-center p-2 ">
                <div className="text-2xl text-white font-bold">Buy crate</div>
                <button className="text-gray-400 hover:text-white" onClick={() => onOpenChange(false)}>
                    <X className="text-white" size={20} />
                </button>
            </div>
      
          {/* Crate Info */}
          {step !== 'success' && (
            <div className="flex items-center text-white border-[#484848] border bg-[#232323] rounded-md p-3 my-4">
              <img src={crate?.image || "/public/placeholder-user.jpg"} className="w-12 h-12 rounded-lg mr-4 object-cover" alt="crate" />
              <div>
                <div className="text-lg font-semibold">{crate?.name || 'Nancy Pelosi'}</div>
                <div className="text-xs text-[#A1A1A1]">{crate?.meta || 'Democrat/House/California'}</div>
              </div>
            </div>
          )}
          {step === 'input' ? (
            <>
              {/* Token Select */}
              <div className="text-center mb-2 text-lg font-medium">Select Token and Asset</div>
              <div className="flex justify-center mb-2">
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
              <div className="text-center text-gray-400 mb-4">
                Balance: ${balance.toLocaleString()}
              </div>
              {/* Amount Input */}
              <div className="flex justify-center mb-2">
                <input
                  className="text-6xl bg-transparent text-center w-40 outline-none font-chakra"
                  value={amount}
                  onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="0"
                  type="text"
                  style={{ letterSpacing: '0.05em' }}
                />
              </div>
              <div className="text-center text-gray-400 mb-4">
                {amount ? `${parseFloat(amount).toFixed(2)} USD` : '0 USD'} &nbsp; 1 {selectedToken} = 1.00 USD
              </div>
              {/* Quick Select */}
              <div className="flex justify-center gap-4 mb-4">
                <button className="bg-[#2C2C2C] text-white px-6 py-1 rounded" onClick={() => setAmount((balance * 0.25).toFixed(2))}>25%</button>
                <button className="bg-[#2C2C2C] text-white px-6 py-1 rounded" onClick={() => setAmount((balance * 0.5).toFixed(2))}>50%</button>
                <button className="bg-[#3D3D3D] text-white px-6 py-1 rounded" onClick={() => setAmount(balance.toFixed(2))}>Max</button>
              </div>
              <div className="text-center text-[#C9C9C9] mb-2">
                Choose the amount you'd like to invest into the {crate?.name || 'Nancy Pelosi'} crate
              </div>
              <button
                className="w-full bg-gradient-to-b from-[#7B7B7B] to-[#EBEBEB] text-black font-bold py-3 rounded"
                onClick={() => setStep('review')}
                disabled={!amount || parseFloat(amount) <= 0}
              >
                Preview
              </button>
            </>
          ) : step === 'review' ? (
            <>
              <div className="text-lg font-semibold mb-4">Review order</div>
              <div className="overflow-x-auto h-48 overflow-y-auto rounded-lg">
                <table className="w-full text-left text-white">
                  <thead>
                    <tr className="text-[#A1A1A1] text-sm">
                      <th className="py-2 px-2 font-medium">Stock</th>
                      <th className="py-2 px-2 font-medium">Units</th>
                      <th className="py-2 px-2 font-medium">Price</th>
                      <th className="py-2 px-2 font-medium">Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewRows.map((row, i) => (
                      <tr key={i} className="border-t border-[#232323] text-base">
                        <td className="py-2 px-2">{row.stock}</td>
                        <td className="py-2 px-2">{row.units}</td>
                        <td className="py-2 px-2">{row.price}</td>
                        <td className="py-2 px-2">{row.weight}</td>
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
            <span className="text-[#A1A1A1]">Total Spend:</span>
            <span className="font-bold text-white">${totalSpend}</span>
            </div>
                  <button
                className="w-1/2 mt-4 bg-gradient-to-b from-[#7B7B7B] to-[#EBEBEB] text-black font-bold py-3 rounded text-sm"
                onClick={() => setStep('status')}
              >
                Confirm
              </button>
                </div>
              </div>
             
            </>
          ) : step === 'status' ? (
            <>
                <div className="flex items-center text-white border-[#484848] border bg-[#232323] rounded-md p-3 my-4">
                  <img src={crate?.image || "/public/placeholder-user.jpg"} className="w-12 h-12 rounded-lg mr-4 object-cover" alt="crate" />
                  <div>
                    <div className="text-lg font-semibold">{crate?.name || 'Nancy Pelosi'}</div>
                    <div className="text-xs text-[#A1A1A1]">{crate?.meta || 'Democrat/House/California'}</div>
                  </div>
                </div>
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
                  <div className="flex items-center gap-2 text-gray-400 text-xl font-semibold mb-2">
                    <span className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center"></span>
                    Waiting for order status
                  </div>
                )}
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="text-xs text-gray-400">Batch</div>
                    <div className="text-base">Buy</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Status</div>
                    <div className="text-base">
                      {orderStatus === 'completed' ? 'Completed' : orderStatus === 'error' ? 'Unplaced' : 'Waiting'}
                    </div>
                  </div>
                </div>
                <div className="mb-4 text-xs">{batchFilled} of {batchTotal} filled</div>
                <div className="w-full h-6 bg-[#232323] rounded mb-6">
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
                  <button className="flex-1 bg-gradient-to-b from-[#7B7B7B] to-[#EBEBEB] text-black font-bold py-3 rounded">Buy More</button>
                  {/* Demo: Simulate error */}
                  {orderStatus === 'waiting' && (
                    <button className="ml-2 px-4 py-2 bg-red-500 text-white rounded text-xs" onClick={() => setOrderStatus('error')}>Simulate Error</button>
                  )}
                </div>
              </>
            ) : (
            // Success step
            <>
              <div className="flex flex-col items-center my-4">
                <img src="/assets/buy_tick.svg" alt="Success" className="w-14 h-14 mb-2" />
                <div className="text-lg w-3/4 font-semibold text-center mb-2">
                  Your selected holdings have been sold successfully.
                </div>
              </div>
              <div className="border-[#484848] border-t p-3">
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
              <div className="flex items-center text-white border-[#484848] border bg-[#232323] rounded-md p-3 my-2">
                <img src={crate?.image || "/public/placeholder-user.jpg"} className="w-12 h-12 rounded-lg mr-4 object-cover" alt="crate" />
                <div>
                  <div className="text-lg font-semibold">{crate?.name || 'Nancy Pelosi'}</div>
                  <div className="text-xs text-[#A1A1A1]">{crate?.meta || 'Democrat/House/California'}</div>
                </div>
              </div>
              <div className="overflow-x-auto h-40 overflow-y-auto rounded-lg mb-4">
                <table className="w-full text-left text-white">
                  <thead>
                    <tr className="text-[#A1A1A1] text-sm">
                      <th className="py-2 px-2 font-medium">Stock</th>
                      <th className="py-2 px-2 font-medium">Units</th>
                      <th className="py-2 px-2 font-medium">Price</th>
                      <th className="py-2 px-2 font-medium">Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewRows.map((row, i) => (
                      <tr key={i} className="border-t border-[#232323] text-base">
                        <td className="py-2 px-2">{row.stock}</td>
                        <td className="py-2 px-2">{row.units}</td>
                        <td className="py-2 px-2">{row.price}</td>
                        <td className="py-2 px-2">{row.weight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 bg-[#232323] text-white py-3 rounded">View Portfolio</button>
                <button className="flex-1 bg-gradient-to-b from-[#7B7B7B] to-[#EBEBEB] text-black font-bold py-3 rounded">Buy More</button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 