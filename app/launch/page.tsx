"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LaunchPage() {
  const [search, setSearch] = useState("");
  const crates = [
    {
      name: "John Hickenlooper",
      party: "Democrat/Senate/Colorado",
      image: "/assets/image.png",
      returns: "+12.45%",
      thisMonth: "+4.90%",
      subscribers: "3,490",
      stocks: "34",
    },
    {
      name: "Brandon Gill",
      party: "Republican/House/Texas",
      image: "/assets/image.png",
      returns: "+12.45%",
      thisMonth: "+4.90%",
      subscribers: "3,490",
      stocks: "12",
    },
    {
      name: "Marjorie Taylor Greene",
      party: "Republican/House/Georgia",
      image: "/assets/image.png",
      returns: "+12.45%",
      thisMonth: "+4.90%",
      subscribers: "3,490",
      stocks: "15",
    },
  ];

  return (
 
     <> <section className="max-w-6xl mx-auto pt-32 px-4">
     <div className="flex md:flex-row justify-between gap-10">
     
       <div className="w-1/2 flex flex-col justify-center">
         <h1 className="text-6xl md:text-7xl font-chakra font-bold leading-tight mb-2">
           Special Crate <br />
           <span className="text-white/70">Offers</span>
         </h1>
         <p className="text-gray-400 text-xl mt-4 max-w-md">
           Discover expertly curated stock collections in beautiful crates. Click to open and explore what's inside.
         </p>
       </div>

      
       <motion.div
         className="rounded-xl bg-[#1a1a1a] py-3 px-4 relative overflow-hidden md:w-[40%]"
         style={{
           borderWidth: '3px',
           borderStyle: 'solid',
           borderImage: 'linear-gradient(180deg, #2B00FF 0%, #FFFFFF 7.09%, #2B00FF 16.02%, #FF4C4C 29.77%, #FFFFFF 42.52%, #FF4C4C 54.15%, #FFFFFF 64.67%) 1',
         }}
         initial={{ opacity: 0, x: 60 }}
         animate={{ opacity: 1, x: 0 }}
       >
         <div className="flex items-center gap-4 mb-4">
           <img src="/assets/image.png" className="w-10 h-10 rounded" />
           <div>
             <h2 className="text-lg font-semibold">Nancy Pelosi</h2>
             <p className="text-sm text-gray-400">
               Democrat/House/California
             </p>
           </div>
           <span className="ml-auto px-2 py-0.5 border rounded text-sm">
             super
           </span>
         </div>

         <p className="text-sm text-gray-400 mb-4">
           Nancy Pelosi's stock trades have sparked controversy and memes,
           with many retail investors tracking her portfolio like it's a
           cheat code for Wall Street.
         </p>

         <div className="flex flex-row gap-8 text-sm mb-4 font-chakra">
           <div>
             <p className="text-green-400 font-semibold">+12.45%</p>
             <p>Total Returns</p>
           </div>
           <div>
             <p className="text-green-400 font-semibold">+4.90%</p>
             <p>This month</p>
           </div>
           <div>
             <p className="font-semibold">3,490</p>
             <p>Subscribers</p>
           </div>
           <div>
             <p className="font-semibold">34</p>
             <p>Stocks</p>
           </div>
         </div>

         <div className="flex gap-3">
      <Button
        className="flex-1 text-white font-bold rounded-lg py-3 px-0 border-none shadow-none"
        style={{
          background: 'linear-gradient(0deg, #232323, #232323), linear-gradient(180deg, #7B7B7B 0%, #EBEBEB 27.19%, #999999 72.17%)',
          backgroundBlendMode: 'normal, normal',
        }}
      >
        View details
      </Button>
      <Button 
        className="flex-1 text-black font-bold rounded-lg py-3 px-0 border-none shadow-none"
        style={{
          background: 'linear-gradient(180deg, #7B7B7B 0%, #EBEBEB 27.19%, #999999 72.17%)',
          backgroundBlendMode: 'normal, normal',
        }}
      >
    

        Subscribe
      </Button>
    </div>
       </motion.div>
     </div>
   </section>
   <section className="max-w-6xl mx-auto mt-16 px-4">
     <h2 className="text-3xl font-chakra font-bold mb-8">Top Trending crates</h2>
     {/* <div className="flex items-center gap-4 mb-8">
       <Button className="text-black" variant="outline">
         Sort
       </Button>
       <Button className="text-black" variant="outline">
         Date
       </Button>
       <Button className="text-black" variant="outline">
         Politics
       </Button>
       <Input
         value={search}
         onChange={(e) => setSearch(e.target.value)}
         placeholder="Search crates"
         className="ml-auto w-64 bg-[#0e0e0e] border border-gray-700 text-white"
       />
     </div> */}

     <div className="grid md:grid-cols-3 gap-6">
     {crates.map((crate, i) => (
  <motion.div
    key={i}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.1 }}
    className="border border-[#272727] rounded-md bg-[#1a1a1a] py-3 px-4 relative overflow-hidden"
  >
    {/* Header with image, name, and bookmark */}
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img 
            src={crate.image} 
            className="w-14 h-14 rounded-xl object-cover" 
            alt={crate.name}
          />
          {/* Optional flag overlay for political figures */}
          
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg leading-tight">
            {crate.name}
          </h3>
          <p className="text-gray-400 text-sm font-medium">
            {crate.party}
          </p>
        </div>
      </div>
      
      {/* Bookmark icon */}
      <div className="w-6 h-6 border border-gray-600 rounded flex items-center justify-center">
        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v18l7-5 7 5V3z" />
        </svg>
      </div>
    </div>

    {/* Stats grid */}
    <div className="grid grid-cols-2 font-chakra gap-x-8 gap-y-1 mb-6">
      <div>
        <p className="text-green-400 font-semibold text-xl">
          {crate.returns}
        </p>
        <p className="text-gray-400 text-sm font-medium">Total Returns</p>
      </div>
      <div>
        <p className="text-green-400 font-semibold text-xl">
          {crate.thisMonth}
        </p>
        <p className="text-gray-400 text-sm font-medium">This month</p>
      </div>
      <div>
        <p className="text-white font-semibold text-2xl">
          {crate.subscribers}
        </p>
        <p className="text-gray-400 text-sm font-medium">Subscribers</p>
      </div>
      <div>
        <p className="text-white font-semibold text-2xl">
          {crate.stocks}
        </p>
        <p className="text-gray-400 text-sm font-medium">Stocks</p>
      </div>
    </div>

    {/* Action buttons */}
    <div className="flex gap-3">
      <Button
        className="flex-1 text-white font-bold rounded-lg py-3 px-0 border-none shadow-none"
        style={{
          background: 'linear-gradient(0deg, #232323, #232323), linear-gradient(180deg, #7B7B7B 0%, #EBEBEB 27.19%, #999999 72.17%)',
          backgroundBlendMode: 'normal, normal',
        }}
      >
        View details
      </Button>
      <Button 
        className="flex-1 text-black font-bold rounded-lg py-3 px-0 border-none shadow-none"
        style={{
          background: 'linear-gradient(180deg, #7B7B7B 0%, #EBEBEB 27.19%, #999999 72.17%)',
          backgroundBlendMode: 'normal, normal',
        }}
      >
    

        Subscribe
      </Button>
    </div>
  </motion.div>
))}
     </div>

     <div className="text-center mt-20 mb-10">
       <h3 className="text-lg font-ropa text-white">
         More Crates Coming Soon
       </h3>
       <p className="text-sm text-gray-400">
         We're crafting more expert-curated stock crates <br /> from top
         investors and influencers
       </p>
     </div>
     
   </section>
   <section className="max-w-6xl mx-auto mt-16 px-4 mb-20">
     <div className="bg-[#181818] rounded-xl p-8 flex flex-col md:flex-row items-center justify-between">
       <div>
         <h2 className="text-2xl font-chakra font-bold mb-2">Investors favourites</h2>
         <p className="text-gray-400 max-w-md">
           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
         </p>
       </div>
       <Button className="mt-6 md:mt-0 px-8 py-3 text-lg font-ropa bg-white text-black rounded-xl shadow">
         Explore now
       </Button>
     </div>
   </section></>
     
  );
}
