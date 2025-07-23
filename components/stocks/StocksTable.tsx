"use client";
import { columns, Stock } from "./columns";
import { DataTable } from "@/components/ui/data-table";

const stocks: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple",
    logo: "/assets/apple.png",
    address: "XxHt...vUL7",
    weight: "23%",
  },
  {
    symbol: "ABBV",
    name: "AbbVie",
    logo: "/assets/apple.png",
    address: "XxHt...vUL7",
    weight: "12%",
  },
  {
    symbol: "AMZN",
    name: "Amazon",
    logo: "/assets/apple.png",
    address: "XxHt...vUL7",
    weight: "8%",
  },
  {
    symbol: "NVDA",
    name: "Nvidia Corporation",
    logo: "/assets/apple.png",
    address: "XxHt...vUL7",
    weight: "32%",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    logo: "/assets/apple.png",
    address: "XxHt...vUL7",
    weight: "3%",
  },
  {
    symbol: "KO",
    name: "Coca-Cola",
    logo: "/assets/apple.png",
    address: "XxHt...vUL7",
    weight: "4%",
  },

];

export function StocksTable() {
  return (
    <div className="mt-8 font-chakra bg-[#0e0e0e]">
      <DataTable columns={columns} data={stocks} />
    </div>
  );
}
