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
import { useUserOrders } from '../../hooks/user-hooks';
import { usePrivyAuth } from '../../context/PrivyAuthContext';
import toast from 'react-hot-toast';


const mockData = [
  {
    date: '12 Dec 2024 14:01',
    type: 'Buy',
    crate: 'Nancy Policy',
    crateLink: '#',
    txId: 'XsHt...vULr7',
    amount: 549,
    status: 'In Progress',
  },
  {
    date: '12 Dec 2024 14:01',
    type: 'Exit',
    crate: 'John Hicken looper',
    crateLink: '#',
    txId: 'XsHt...vULr7',
    amount: 80,
    status: 'In Progress',
  },
  {
    date: '12 Dec 2024 14:01',
    type: 'Exit',
    crate: 'Nancy Policy',
    crateLink: '#',
    txId: 'XsHt...vULr7',
    amount: 139,
    status: 'In Progress',
  },
  {
    date: '12 Dec 2024 14:01',
    type: 'Exit',
    crate: 'Nancy Policy',
    crateLink: '#',
    txId: 'XsHt...vULr7',
    amount: 922,
    status: 'Completed',
  },
  {
    date: '12 Dec 2024 14:01',
    type: 'Rebalance',
    crate: 'Nancy Policy',
    crateLink: '#',
    txId: 'XsHt...vULr7',
    amount: 609,
    status: 'Completed',
  },
  {
    date: '12 Dec 2024 14:01',
    type: 'Buy',
    crate: 'Nancy Policy',
    crateLink: '#',
    txId: 'XsHt...vULr7',
    amount: 702,
    status: 'Failed',
  },
  {
    date: '12 Dec 2024 14:01',
    type: 'Buy',
    crate: 'Nancy Policy',
    crateLink: '#',
    txId: 'XsHt...vULr7',
    amount: 153,
    status: 'Completed',
  },
  {
    date: '12 Dec 2024 14:01',
    type: 'Rebalance',
    crate: 'Nancy Policy',
    crateLink: '#',
    txId: 'XsHt...vULr7',
    amount: 319,
    status: 'Completed',
  },
  {
    date: '12 Dec 2024 14:01',
    type: 'Rebalance',
    crate: 'Nancy Policy',
    crateLink: '#',
    txId: 'XsHt...vULr7',
    amount: 599,
    status: 'Failed',
  },
  {
    date: '12 Dec 2024 14:01',
    type: 'Buy',
    crate: 'Nancy Policy',
    crateLink: '#',
    txId: 'XsHt...vULr7',
    amount: 697,
    status: 'Completed',
  },
  {
    date: '12 Dec 2024 14:01',
    type: 'Buy',
    crate: 'Nancy Policy',
    crateLink: '#',
    txId: 'XsHt...vULr7',
    amount: 757,
    status: 'In Progress',
  },
  {
    date: '12 Dec 2024 14:01',
    type: 'Buy',
    crate: 'Nancy Policy',
    crateLink: '#',
    txId: 'XsHt...vULr7',
    amount: 242,
    status: 'In Progress',
  },
];

const statusBadge = (status: string) => {
  if (status === 'FILLED')
    return  <div className="bg-green-900/60 text-green-400 px-2 py-1 w-fit rounded text-xs font-medium flex items-center gap-2">
      <Image src="/assets/crate_filled.svg" alt="Completed" width={16} height={16} />
      Completed</div>;
  if (status === 'REJECTED' || status === 'ERROR')
    return  <div className="bg-red-900/60 text-red-400 px-2 py-1 rounded text-xs font-medium w-fit flex items-center gap-2">
      <Image src="/assets/crate_failed.svg" alt="Failed" width={16} height={16} />
      Failed</div>;
  if (status === 'CANCELLED')
    return  <div className="bg-orange-900/60 text-orange-400 px-2 py-1 rounded text-xs font-medium w-fit flex items-center gap-2">
      <Image src="/assets/crate_failed.svg" alt="Cancelled" width={16} height={16} />
      Cancelled</div>;
  return <div className="bg-gray-800/60 text-gray-300 px-2 py-1 rounded text-xs font-medium w-fit flex items-center gap-2">
    <Image src="/assets/progress.svg" alt="In Progress" width={16} height={16} />
    {status}</div>;
};

const typeBadge = (type: string) => {
  if (type === 'BUY')
    return <span className="bg-[#2D2D2D] text-green-400 px-2 py-1 rounded text-xs font-medium">Buy</span>;
  if (type === 'SELL')
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
  const { data: userOrders, isLoading, error } = useUserOrders(address, authenticated);
  
  // Use real data if available, otherwise fall back to mock data
  const ordersData = userOrders?.orders || mockData;
  
  // Filter orders based on transaction type
  const filteredOrders = ordersData.filter((order: any) => {
    if (transactionType && order.order_side) {
      return order.order_side.toLowerCase() === transactionType.toLowerCase();
    }
    return true;
  });
  
  const hasTransactions = filteredOrders.length > 0;

  console.log({userOrders});

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
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[#171717]">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-left font-medium">Transaction type</th>
                    <th className="px-4 py-3 text-left font-medium">Stock Name</th>
                    <th className="px-4 py-3 text-left font-medium">Transaction ID</th>
                    <th className="px-4 py-3 text-left font-medium">Amount</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order: any, i: number) => {
                    // Format the date
                    const orderDate = new Date(order.created_dt).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    });
                    
                    // Format transaction hash
                    const txHash = order.order_transaction_hash || order.cancel_transaction_hash || '';
                    const shortTxHash = txHash ? `${txHash.slice(0, 6)}...${txHash.slice(-4)}` : '';
                    
                    // Format amount
                    const amount = parseFloat(order.payment_token_quantity || '0');
                    
                    return (
                      <tr key={order.id || i} className="transition">
                        <td className="px-4 py-3 whitespace-nowrap text-[#A1A1A1]">{orderDate}</td>
                        <td className="px-4 py-3">{typeBadge(order.order_side)}</td>
                        <td className="px-4 py-3">
                          <span className="text-white">{order.stockDetails?.name}</span>
                        </td>
                        <td className="px-4 py-3 flex items-center gap-2">
                          <span>{shortTxHash}</span>
                          {txHash && (
                            <button 
                              className="hover:text-blue-400 transition-colors" 
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(txHash);
                                  toast.success("Transaction hash copied!");
                                } catch (err) {
                                  console.error('Failed to copy transaction hash:', err);
                                  toast.error("Failed to copy transaction hash to clipboard.");
                                }
                              }}
                              title="Copy transaction hash"
                            >
                              <Image src="/assets/copy.svg" alt="Copy" width={16} height={16} />
                            </button>
                          )}
                        </td>
                        <td className={`px-4 py-3 font-medium ${amount > 0 ? 'text-green-400' : 'text-red-400'}`}>${amount.toFixed(2)}</td>
                        <td className="px-4 py-3">{statusBadge(order.status)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <Image src="/assets/txn.svg" alt="No transactions" width={220} height={120} />
              <div className="mt-10 text-2xl font-chakra text-center">Hey, go buy crates to see<br/>your transactions here!</div>
              <a href="/discover" className="mt-8">
                <button className="border border-[#444] rounded px-6 py-3 text-white font-chakra text-lg hover:bg-[#181818] transition">Discover more crates</button>
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default page;