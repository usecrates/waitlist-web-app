"use client";
import { columns, Stock } from "./columns";
import { DataTable } from "@/components/ui/data-table";

const stocks: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple",
    logo: "/assets/apple.png",
    address: "XxHt...vUL7",
    share: "$124.23",
  },
  {
    symbol: "ABBV",
    name: "AbbVie",
    logo: "/assets/apple.png",
    address: "XxHt...vUL7",
    share: "$1214.23",
  },
  {
    symbol: "AMZN",
    name: "Amazon",
    logo: "/assets/apple.png",
    address: "XxHt...vUL7",
    share: "$823.23",
  },
  {
    symbol: "NVDA",
    name: "Nvidia Corporation",
    logo: "/assets/apple.png",
    address: "XxHt...vUL7",
    share: "$3212.23",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    logo: "/assets/apple.png",
    address: "XxHt...vUL7",
    share: "$34.23",
  },
  {
    symbol: "KO",
    name: "Coca-Cola",
    logo: "/assets/apple.png",
    address: "XxHt...vUL7",
    share: "$423.23",
  },
  {
    symbol: "GME",
    name: "Gamestop",
    logo: "/assets/apple.png",
    address: "XxHt...vUL7",
    share: "$324.23",
  },
];

export function StocksTable() {
  return (
    <div className="mt-8 rounded-xl border border-gray-700 font-ropa bg-black">
      <DataTable columns={columns} data={stocks} />
    </div>
  );
}
