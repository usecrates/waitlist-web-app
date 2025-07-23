"use client"
import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import { Copy } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../../components/ui/popover';
import { ChevronDown } from 'lucide-react';
import { Search } from 'lucide-react';
import Image from 'next/image';

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
  if (status === 'Completed')
    return  <div className="bg-green-900/60 text-green-400 px-2 py-1 w-fit rounded text-xs font-medium flex items-center gap-2">
      <Image src="/assets/crate_filled.svg" alt="Completed" width={16} height={16} />
      Completed</div>;
  if (status === 'Failed')
    return  <div className="bg-red-900/60 text-red-400 px-2 py-1 rounded text-xs font-medium w-fit flex items-center gap-2">
      <Image src="/assets/crate_failed.svg" alt="Failed" width={16} height={16} />
      Failed</div>;
  return <div className="bg-gray-800/60 text-gray-300 px-2 py-1 rounded text-xs font-medium w-fit flex items-center gap-2">
    <Image src="/assets/progress.svg" alt="In Progress" width={16} height={16} />
    In Progress</div>;
};

const typeBadge = (type: string) => {
  if (type === 'Buy')
    return <span className="bg-[#2D2D2D] text-green-400 px-2 py-1 rounded text-xs font-medium">Buy</span>;
  if (type === 'Exit')
    return <span className="bg-[#2D2D2D] text-orange-400 px-2 py-1 rounded text-xs font-medium">Exit</span>;
  return <span className="bg-[#2D2D2D] text-blue-300 px-2 py-1 rounded text-xs font-medium">Rebalance</span>;
};

const transactionTypeOptions = [
  { label: 'Buy', value: 'buy' },
  { label: 'Exit', value: 'exit' },
  { label: 'Rebalance', value: 'rebalance' },
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
  const hasTransactions = mockData.length > 0;

  return (
    <div className="p-8 min-h-screen pt-24 bg-[#0E0E0E] text-white">
      <h1 className="text-2xl font-semibold mb-8">Transactions</h1>
      {hasTransactions ? (
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
          <div className="overflow-x-auto  ">
            <table className="min-w-full text-sm">
              <thead className="bg-[#171717]">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Transaction type</th>
                  <th className="px-4 py-3 text-left font-medium">Crate</th>
                  <th className="px-4 py-3 text-left font-medium">Transaction ID</th>
                  <th className="px-4 py-3 text-left font-medium">Amount</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockData.map((row, i) => (
                  <tr key={i} className="  transition">
                    <td className="px-4 py-3 whitespace-nowrap text-[#A1A1A1]">{row.date}</td>
                    <td className="px-4 py-3">{typeBadge(row.type)}</td>
                    <td className="px-4 py-3">
                      <a href={row.crateLink} className="text-white underline hover:text-blue-300">{row.crate}</a>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <span>{row.txId}</span>
                      <button className="hover:text-blue-400" onClick={() => navigator.clipboard.writeText(row.txId)}>
                        <Image src="/assets/copy.svg" alt="Copy" width={16} height={16} />
                      </button>
                    </td>
                    <td className={`px-4 py-3 font-medium ${row.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>${row.amount}</td>
                    <td className="px-4 py-3">{statusBadge(row.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Image src="/assets/txn.svg" alt="No transactions" width={220} height={120} />
          <div className="mt-10 text-2xl font-chakra text-center">Hey, go buy crates to see<br/>your transactions here!</div>
          <a href="/discover" className="mt-8">
            <button className="border border-[#444] rounded px-6 py-3 text-white font-chakra text-lg hover:bg-[#181818] transition">Discover more crates</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default page;