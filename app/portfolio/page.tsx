"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState("Crates");
  
  // Mock data for stats and crates
  const stats = {
    currentValue: "$1,235.90",
    currentValueChange: "+12.67%",
    totalInvested: "$780.56",
  };
  
  const crates = [
    {
      avatar: "https://t3.ftcdn.net/jpg/06/99/46/60/360_F_699466075_DaPTBNlNQTOwwjkOiFEoOvzDV0ByXR9E.jpg",
      name: "John Hickenlooper",
      party: "Democrat/Senate/Colorado",
      partyColor: "blue",
      currentValue: "$400.56",
      invested: "$249.01",
      returns: "+12.45%",
      month: "+4.90%",
      notification: true,
    },
    {
      avatar: "https://t3.ftcdn.net/jpg/06/99/46/60/360_F_699466075_DaPTBNlNQTOwwjkOiFEoOvzDV0ByXR9E.jpg",
      name: "Marjorie Taylor Greene",
      party: "Republican/House/Georgia",
      partyColor: "red",
      currentValue: "$400.56",
      invested: "$529.45",
      returns: "+9.15%",
      month: "+5.50%",
      notification: false,
    },
    {
      avatar: "https://t3.ftcdn.net/jpg/06/99/46/60/360_F_699466075_DaPTBNlNQTOwwjkOiFEoOvzDV0ByXR9E.jpg",
      name: "Marjorie Taylor Greene",
      party: "Republican/House/Georgia",
      partyColor: "red",
      currentValue: "$400.56",
      invested: "$529.45",
      returns: "+9.15%",
      month: "+5.50%",
      notification: false,
    },
  ];

  return (
    <div className="min-h-screen pt-32 flex flex-col bg-[#0e0e0e] text-white font-chakra">
      <main className="flex-1 flex flex-col items-center pb-16">
        <section className="max-w-6xl mx-auto px-6 w-full">
          {/* Main Grid - Tabs and Profile Card at same level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8"
          >
            {/* Left Side - Tabs and Content */}
            <div>
              {/* Tabs */}
              <div className="flex gap-8 border-t pt-3 border-b border-[#232323] mb-0">
                <button
                  className={`px-2 pb-2 text-base border-b-2 transition-all ${
                    activeTab === "Crates" 
                      ? "border-white text-white" 
                      : "border-transparent text-gray-400"
                  }`}
                  onClick={() => setActiveTab("Crates")}
                >
                  Crates
                </button>
                <button
                  className={`px-2 pb-2 text-base border-b-2 transition-all ${
                    activeTab === "Stocks" 
                      ? "border-white text-white" 
                      : "border-transparent text-gray-400"
                  }`}
                  onClick={() => setActiveTab("Stocks")}
                >
                  Stocks
                </button>
              </div>

              {/* Stats Bar */}
              <div className="flex border-b border-[#232323] py-3 mb-6">
                <div className="flex w-full">
                  {/* Current Value */}
                  <div className="w-1/2 flex flex-col items-start justify-center px-4">
                    <div className="text-2xl font-bold flex items-end gap-2">
                      $835.90 <span className="text-green-400 text-base font-normal">12.67%</span>
                    </div>
                    <div className="text-gray-400 text-sm mt-1">Current Value</div>
                  </div>
                  {/* Divider */}
                  <div className="w-px bg-[#232323] h-20 self-center" />
                  {/* Total Invested */}
                  <div className="w-1/2 flex flex-col items-start justify-center px-4">
                    <div className="text-2xl font-bold">$501.29</div>
                    <div className="text-gray-400 text-sm mt-1">Total Invested</div>
                  </div>
                </div>
              </div>

              {/* Crate Cards */}
              <div>
                {crates.map((crate, i) => (
                  <motion.div
                    key={i}
                    className="relative flex items-center py-6 mb-0 border-b border-[#232323] last:border-b-0 bg-transparent rounded-none shadow-none"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    {/* Avatar with blue shadow and border, square */}
                    <div className="relative mr-8 flex-shrink-0" style={{ width: 48, height: 48 }}>
                      {/* Blue radial glow, larger than the image */}
                      <div
                        className="absolute left-1/2 top-1/2"
                        style={{
                          width: 64, // larger than image
                          height: 64,
                          transform: "translate(-50%, -50%)",
                          background: "radial-gradient(circle, #2563eb 60%, transparent 100%)",
                          filter: "blur(6px)",
                          opacity: 0.8,
                          zIndex: 0,
                          borderRadius: "16px",
                        }}
                      />
                      {/* Avatar image */}
                      <img
                        src={crate.avatar}
                        alt="avatar"
                        className="w-12 h-12 object-cover rounded-xl border-2 border-white relative z-10"
                        style={{ display: "block" }}
                      />
                    </div>
                    {/* Info and Button */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 mb-0.5">
                        <span className="font-semibold text-base truncate">{crate.name}</span>
                        {crate.notification && (
                          <span className="ml-2 w-2 h-2 rounded-full bg-orange-400 inline-block" title="Needs rebalance" />
                        )}
                        <button className="ml-4 bg-transparent border border-gray-500 text-white px-4 py-1 rounded text-xs font-medium hover:bg-gray-800 transition">
                          Rebalance
                        </button>
                      </div>
                      <div className="text-gray-400 text-xs mb-1 truncate">{crate.party}</div>
                      <div className="flex gap-20 text-sm">
                        <div>
                          <div className="font-semibold">{crate.currentValue}</div>
                          <div className="text-gray-400 text-xs">Current Value</div>
                        </div>
                        <div>
                          <div className="font-semibold">{crate.invested}</div>
                          <div className="text-gray-400 text-xs">Total Invested</div>
                        </div>
                        <div>
                          <div className="text-green-400 font-semibold">{crate.returns}</div>
                          <div className="text-gray-400 text-xs">Total Returns</div>
                        </div>
                        <div>
                          <div className="text-green-400 font-semibold">{crate.month}</div>
                          <div className="text-gray-400 text-xs">This month</div>
                        </div>
                      </div>
                    </div>
                    {/* Three-dot menu */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer text-lg">
                      &#8942;
                    </div>
                  </motion.div>
                ))}
                
                <div className="mt-8">
                  <button className="border border-gray-600 px-6 py-2 rounded text-gray-300 hover:bg-gray-800 transition">
                    Discover more crates
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Profile Card */}
            <motion.div
              className="lg:pt-[52px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="bg-transparent rounded-lg p-8 flex flex-col items-center border border-[#232323] shadow-none">
                <img 
                  src="https://t3.ftcdn.net/jpg/06/99/46/60/360_F_699466075_DaPTBNlNQTOwwjkOiFEoOvzDV0ByXR9E.jpg" 
                  className="w-20 h-20 rounded-full border-2 border-black mb-2" 
                  alt="main avatar" 
                />
                <div className="bg-[#232323] text-white text-xs px-3 py-1 rounded-full mb-2">
                  XsHt...vULr7
                </div>
                <div className="text-gray-400 text-center text-xs mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </div>
                <div className="flex gap-8 mb-2">
                  <div className="text-center">
                    <div className="text-green-400 font-bold text-base">+12.45%</div>
                    <div className="text-xs text-gray-400">Total Returns</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 font-bold text-base">+4.90%</div>
                    <div className="text-xs text-gray-400">This month</div>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div className="text-center">
                    <div className="font-bold text-base">3,490</div>
                    <div className="text-xs text-gray-400">Subscribers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-base">34</div>
                    <div className="text-xs text-gray-400">Stocks</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}