"use client"
import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import { Copy } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../../components/ui/popover';
import { ChevronDown } from 'lucide-react';
import { Search, Bug } from 'lucide-react';
import Image from 'next/image';
import { useEnrichedUser, useUserOrders } from '../../hooks/user-hooks';
import { usePrivyAuth } from '../../context/PrivyAuthContext';
import toast from 'react-hot-toast';



const statusBadge = (status: string) => {
  if (status === 'FILLED')
    return <div className="bg-green-900/60 text-green-400 px-2 py-1 w-fit rounded text-xs font-medium flex items-center gap-2">
      <Image src="/assets/crate_filled.svg" alt="Completed" width={16} height={16} />
      Completed</div>;
  if (status === 'REJECTED' || status === 'ERROR')
    return <div className="bg-red-900/60 text-red-400 px-2 py-1 rounded text-xs font-medium w-fit flex items-center gap-2">
      <Image src="/assets/crate_failed.svg" alt="Failed" width={16} height={16} />
      Failed</div>;
  if (status === 'CANCELLED')
    return <div className="bg-orange-900/60 text-orange-400 px-2 py-1 rounded text-xs font-medium w-fit flex items-center gap-2">
      <Image src="/assets/crate_failed.svg" alt="Cancelled" width={16} height={16} />
      Cancelled</div>;
  return <div className="bg-gray-800/60 text-gray-300 px-2 py-1 rounded text-xs font-medium w-fit flex items-center gap-2">
    <Image src="/assets/progress.svg" alt="In Progress" width={16} height={16} />
    {status}</div>;
};

const typeBadge = (type: string) => {
  if (type === 'buy')
    return <span className="bg-[#2D2D2D] text-green-400 px-2 py-1 rounded text-xs font-medium">Buy</span>;
  if (type === 'sell')
    return <span className="bg-[#2D2D2D] text-orange-400 px-2 py-1 rounded text-xs font-medium">Sell</span>;
  return <span className="bg-[#2D2D2D] text-blue-300 px-2 py-1 rounded text-xs font-medium">{type}</span>;
};

const transactionTypeOptions = [
  { label: 'Buy', value: 'buy' },
  { label: 'Sell', value: 'sell' },
];
const crateTypeOptions = [
  { label: 'All', value: 'all' },
  { label: 'AI', value: 'ai' },
  { label: 'Politician', value: 'politician' },
  { label: 'Crypto', value: 'crypto' },
  { label: 'Military', value: 'military' },
  { label: 'Others', value: 'others' },
];

const page = () => {
  const [activeOnly, setActiveOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [transactionType, setTransactionType] = useState<string>('');
  const [crateType, setCrateType] = useState<string>('');
  const { address, authenticated } = usePrivyAuth();
  const { data: userData,isLoading } = useEnrichedUser(address, authenticated);
  console.log(userData)
  const ordersData = userData?.transactions;
  console.log(userData?.transactions);

  // Filter orders based on transaction type
  const filteredOrders = ordersData?.length && ordersData?.filter((order: any) => {
    if (transactionType && order.type) {
      return order.type.toLowerCase() === transactionType.toLowerCase();
    }
    return true;
  });

  const hasTransactions = filteredOrders?.length > 0;



  return (
    <div className=" min-h-screen pt-24 max-w-6xl w-full mx-auto  text-white">
      <h1 className="text-2xl font-semibold mb-4">Transactions</h1>
      {!address ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Bug className="w-16 h-16 text-gray-400 mb-4" />
          <div className="text-2xl font-chakra text-center">Connect your wallet</div>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-2xl font-chakra text-center">Loading transactions...</div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 items-center mb-6">
            {/* Transaction Type Dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-40 bg-[#232323] border-none text-white font-chakra justify-between flex items-center"
                  type="button"
                >
                  <span>{transactionType ? transactionTypeOptions.find(o => o.value === transactionType)?.label : 'Transaction type'}</span>
                  <ChevronDown className="ml-2 w-4 h-4 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="bg-[#232323] mt-2 text-white font-chakra w-44 p-2">
                {transactionTypeOptions.map(opt => (
                  <button
                    key={opt.value}
                    className={`w-full text-left px-3 py-2 rounded hover:bg-[#181818] ${transactionType === opt.value ? 'bg-[#181818]' : ''}`}
                    onClick={() => setTransactionType(opt.value)}
                    type="button"
                  >
                    {opt.label}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
            {/* Crate Type Dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-36 bg-[#232323] border-none text-white font-chakra justify-between flex items-center"
                  type="button"
                >
                  <span>{crateType ? crateTypeOptions.find(o => o.value === crateType)?.label : 'Crate type'}</span>
                  <ChevronDown className="ml-2 w-4 h-4 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="bg-[#232323] mt-2 text-white font-chakra w-44 p-2">
                {crateTypeOptions.map(opt => (
                  <button
                    key={opt.value}
                    className={`w-full text-left px-3 py-2 rounded hover:bg-[#181818] ${crateType === opt.value ? 'bg-[#181818]' : ''}`}
                    onClick={() => setCrateType(opt.value)}
                    type="button"
                  >
                    {opt.label}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm">Active Crates only</span>
              <input type="checkbox" checked={activeOnly} onChange={() => setActiveOnly(!activeOnly)} className="accent-green-500" />
            </label>
            <div className="flex-1" />
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#727272] w-4 h-4 pointer-events-none" />
              <Input
                className="bg-[#181818] border-none text-white font-chakra placeholder:text-[#727272] h-12 pl-10"
                placeholder="Search crates, creators and..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          {hasTransactions ? (
            <div className="overflow-x-auto rounded-xl border border-[#2A2A2A] shadow-lg">
              <table className="min-w-full text-sm font-chakra">
                <thead className="bg-[#1E1E1E] text-[#A1A1A1] uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    {/* <th className="px-4 py-3 text-left">Crate / Stock</th> */}
                    <th className="px-4 py-3 text-left">Tx Hash</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {filteredOrders?.map((order: any, i: number) => {
                    // Date formatting
                    const orderDate = new Date(order.createdAt).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    // Tx hash formatting
                    const txHash = order.txHash || "";
                    const shortTxHash = txHash ? `${txHash.slice(0, 6)}...${txHash.slice(-4)}` : "";

                    // Amount formatting
                    const amount = order.totalAmountInvested || 0;
                    const formattedAmount = `$${amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`;

                    return (
                      <tr
                        key={order._id || i}
                        className="hover:bg-[#121212] transition-colors"
                      >
                        <td className="px-4 py-3 text-[#A1A1A1]">{orderDate}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${order.type === "buy"
                                ? "bg-green-900/40 text-green-400"
                                : "bg-red-900/40 text-red-400"
                              }`}
                          >
                            {order.type.toUpperCase()}
                          </span>
                        </td>
                        {/* <td className="px-4 py-3 text-white">
                          {order.crateId?.name || order.stockDetails?.name || "—"}
                        </td> */}
                        <td className="px-4 py-3 flex items-center gap-2">
                          <span className="text-blue-400">{shortTxHash}</span>
                          {txHash && (
                            <button
                              className="hover:text-blue-500 transition-colors"
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(txHash);
                                  toast.success("Tx hash copied!");
                                } catch (err) {
                                  toast.error("Failed to copy tx hash.");
                                }
                              }}
                              title="Copy full hash"
                            >
                              <Image
                                src="/assets/copy.svg"
                                alt="Copy"
                                width={16}
                                height={16}
                              />
                            </button>
                          )}
                        </td>
                        <td
                          className={`px-4 py-3 font-medium ${order.type === "buy" ? "text-green-400" : "text-red-400"
                            }`}
                        >
                          {formattedAmount}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-md text-xs ${order.status === "success"
                                ? "bg-green-900/40 text-green-400"
                                : order.status === "pending"
                                  ? "bg-yellow-900/40 text-yellow-400"
                                  : "bg-red-900/40 text-red-400"
                              }`}
                          >
                            {order.status ? order.status.toUpperCase() : "PENDING"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <Image
                src="/assets/txn.svg"
                alt="No transactions"
                width={220}
                height={120}
              />
              <div className="mt-8 text-xl font-chakra text-gray-300">
                No transactions yet.
                <br />
                Start by buying your first crate!
              </div>
              <a href="/discover" className="mt-8">
                <button className="border border-[#444] rounded-lg px-6 py-3 text-white font-chakra text-lg hover:bg-[#181818] transition">
                  Discover More Crates
                </button>
              </a>
            </div>
          )}

        </>
      )}
    </div>
  );
};

export default page;