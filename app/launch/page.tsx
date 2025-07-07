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
     
       <div className="w-1/2">
         <h1 className="text-7xl font-chakra font-bold leading-tight">
           Open US <span className="text-white/70">Stock Crates</span>
         </h1>
         <p className="text-gray-400 text-xl mt-4">
         Discover expertly curated stock collections in beautiful crates. Click to open and explore what's inside.
         </p>
       </div>

      
       <motion.div
         className="w-full md:max-w-md border border-gray-700 p-6 rounded-xl bg-gradient-to-br from-black to-[#1f1f1f] shadow-lg"
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
           with many retail investors tracking her portfolio like it’s a
           cheat code for Wall Street.
         </p>

         <div className="grid grid-cols-2 gap-3 text-sm mb-4">
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

         <div className="flex gap-2">
           <Button
             variant="outline"
             className="w-full font-ropa text-black border-white"
           >
             View details
           </Button>
           <Button className="w-full font-ropa bg-white text-black">
             Subscribe
           </Button>
         </div>
       </motion.div>
     </div>
   </section>
   <section className="max-w-6xl mx-auto mt-16 px-4">
     <div className="flex items-center gap-4 mb-8">
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
     </div>

     <div className="grid md:grid-cols-3 gap-6">
       {crates.map((crate, i) => (
         <motion.div
           key={i}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: i * 0.1 }}
           className="border border-gray-700 p-4 rounded-lg bg-[#111]"
         >
           <div className="flex items-center gap-3 mb-3">
             <img src={crate.image} className="w-10 h-10 rounded" />
             <div>
               <p className="font-semibold">{crate.name}</p>
               <p className="text-xs text-gray-400">{crate.party}</p>
             </div>
           </div>
           <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 mb-4">
             <div>
               <p className="text-green-400 font-semibold">
                 {crate.returns}
               </p>
               <p>Total Returns</p>
             </div>
             <div>
               <p className="text-green-400 font-semibold">
                 {crate.thisMonth}
               </p>
               <p>This month</p>
             </div>
             <div>
               <p className="font-semibold">{crate.subscribers}</p>
               <p>Subscribers</p>
             </div>
             <div>
               <p className="font-semibold">{crate.stocks}</p>
               <p>Stocks</p>
             </div>
           </div>
           <div className="flex gap-2">
             <Button
               variant="outline"
               className="w-full font-ropa text-black border-white"
             >
               View details
             </Button>
             <Button className="w-full font-ropa bg-white text-black">
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
     
   </section></>
     
  );
}
