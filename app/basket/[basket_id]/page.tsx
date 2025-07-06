import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function SingleCrate() {
  return (
    <div className="max-w-7xl mx-auto bg-transparent font-ropa px-6 py-24 text-white">
      <button className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white">
        <ArrowLeft size={18} />
        Back
      </button>

    
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="flex gap-6">
          <Image
            src="/assets/image.png"
            width={80}
            height={80}
            alt="Nancy Pelosi"
            className="rounded"
          />
          <div>
            <h2 className="text-2xl font-bold">Nancy Pelosi</h2>
            <p className="text-sm text-gray-400">Democrat / House / California</p>
            <p className="text-sm mt-1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>
        <div className="flex gap-6 items-center text-sm">
          <div>
            <p className="text-green-400 font-semibold text-lg">+12.45%</p>
            <p>Total Returns</p>
          </div>
          <div>
            <p className="text-green-400 font-semibold text-lg">+2.45%</p>
            <p>This Month</p>
          </div>
          <span className="bg-red-500/20 text-red-500 px-2 py-1 rounded text-xs">
            High Volatility
          </span>
        </div>
      </div>

    
      <div className="flex gap-6 mb-8 border-b border-gray-700 pb-2">
        <button className="text-white border-b-2 border-white font-medium pb-1">
          Overview
        </button>
        <button className="text-gray-400 hover:text-white pb-1">Stocks & ETFs</button>
      </div>


      <div className="grid md:grid-cols-3 gap-8">
 
        <div className="md:col-span-2 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">About this crate</h3>
            <p className="text-sm text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-white">2023–2026</p>
              <p className="text-sm text-gray-400">
                <span className="font-semibold text-white">US Constitution Representative</span> - Lorem ipsum dolor sit amet...
              </p>
            </div>
            <div>
              <p className="text-sm text-white">2024–2025</p>
              <p className="text-sm text-gray-400">
                <span className="font-semibold text-white">Lorem ipsum dolor sit amet</span> - sed do eiusmod tempor...
              </p>
            </div>
            <div>
              <p className="text-sm text-white">2019–2024</p>
              <p className="text-sm text-gray-400">
                <span className="font-semibold text-white">Lorem ipsum dolor sit amet</span> - consectetur adipiscing elit...
              </p>
            </div>
          </div>

       
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-4">
              Live Performance vs <span className="text-[#F97316]">Equity Smallcap</span>
            </h3>
            <div className="h-72 bg-gray-800 rounded-lg flex items-center justify-center text-sm text-gray-400">
             
              Chart Placeholder (e.g., Recharts)
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Current value of $100 invested on Feb 5, 2024 would be...
            </p>
          </div>
        </div>


        <div className="bg-[#111] border border-gray-700 rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-bold">$5.4/Month</h4>
            <span className="text-green-500 border border-green-500 px-2 py-1 rounded text-sm">
              Free
            </span>
          </div>
          <p className="text-sm text-gray-400">1245+ Subscribers</p>
          <p className="text-sm text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
          </p>
          <Button className="w-full bg-white text-black font-ropa">Subscribe</Button>

       
          <div className="flex items-center gap-4 pt-4">
            <span className="text-gray-400 text-sm">Share on</span>
            <div className="flex gap-2">
              <img src="/icons/twitter.svg" className="w-5" />
              <img src="/icons/telegram.svg" className="w-5" />
              <img src="/icons/discord.svg" className="w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
