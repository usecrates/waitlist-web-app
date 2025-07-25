import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export type Crate = {
  name: string;
  description: string;
  imageUrl: string;
  subscriptionAmount: string;
  totalReturnPercent: string;
  activeSubscribers: string;
  stocks: string;
};

const CrateCard = ({ crate }: { crate: Crate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="border font-chakra border-[#272727] rounded-md bg-[#1a1a1a] py-3 px-4 relative overflow-hidden"
    >
      {/* Header with image, name, and bookmark */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={crate.imageUrl || "https://t3.ftcdn.net/jpg/06/99/46/60/360_F_699466075_DaPTBNlNQTOwwjkOiFEoOvzDV0ByXR9E.jpg"}
              className="w-14 h-14 rounded-xl object-cover"
              alt={crate?.name}
            />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg leading-tight">
              {crate?.name}
            </h3>
            <p className="text-gray-400 text-sm font-medium">
              {crate?.description}
            </p>
          </div>
        </div>
        {/* Bookmark icon */}
        <div className="w-6 h-6  rounded flex items-center justify-center">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v18l7-5 7 5V3z"
            />
          </svg>
        </div>
      </div>
      {/* Stats grid */}
      <div className="grid grid-cols-2 font-chakra gap-x-8 gap-y-1 mb-6">
        <div>
          <p className="text-green-400 font-semibold text-xl">
            {crate.totalReturnPercent}
          </p>
          <p className="text-gray-400 text-sm font-medium">Total Returns</p>
        </div>
        <div>
          <p className="text-green-400 font-semibold text-xl">
            {crate.subscriptionAmount}
          </p>
          <p className="text-gray-400 text-sm font-medium">This month</p>
        </div>
        <div>
          <p className="text-white font-semibold text-2xl">
            {crate.activeSubscribers}
          </p>
          <p className="text-gray-400 text-sm font-medium">Subscribers</p>
        </div>
        <div>
          <p className="text-white font-semibold text-2xl">
            {crate.stocks.length}
          </p>
          <p className="text-gray-400 text-sm font-medium">Stocks</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          href={`/discover/${crate?._id.toString()}`}
          className="flex-1 text-white font-bold rounded-lg py-3 px-0 border-none shadow-none"
          style={{
            background:
              "linear-gradient(0deg, #232323, #232323), linear-gradient(180deg, #7B7B7B 0%, #EBEBEB 27.19%, #999999 72.17%)",
            backgroundBlendMode: "normal, normal",
          }}
        >
          View Details
        </Button>
        <Button
          className="flex-1 text-black font-bold rounded-lg py-3 px-0 border-none shadow-none"
          style={{
            background:
              "linear-gradient(180deg, #7B7B7B 0%, #EBEBEB 27.19%, #999999 72.17%)",
            backgroundBlendMode: "normal, normal",
          }}
        >
          Subscribe
        </Button>
      </div>
    </motion.div>
  );
};

export default CrateCard; 