import CrateChart from "@/components/CreateChart";
import { DonutChartWithLegend } from "@/components/DonutChart";
import { StocksTable } from "@/components/stocks/StocksTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
export default function SingleCrate() {
  return (
    <main className="px-6 py-20 max-w-6xl mx-auto text-white space-y-10">
      <button className="mb-6 mt-4 flex items-center gap-2 text-gray-400 hover:text-white">
        <ArrowLeft size={18} />
        Back
      </button>
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex gap-4 items-start w-1/2">
          <Image src="/assets/image.png" width={80} height={80} alt="crate profile" className="rounded" />
          <div>
            <h2 className="text-2xl font-bold">Nancy Pelosi</h2>
            <p className="text-sm text-gray-400">Democrat / House / California</p>
            <p className="text-sm mt-2">Invest Like One of America’s Most Active Political Traders
              Track and copy the portfolio inspired by Nancy Pelosi’s publicly disclosed stock trades.
            </p>
          </div>
        </div>

        <div className="flex gap-6 items-center text-sm">
          <div>
            <p className="text-green-500 text-xl font-semibold">+12.45%</p>
            <p className="text-gray-400">Total Returns</p>
          </div>
          <div>
            <p className="text-green-500 text-xl font-semibold">+2.45%</p>
            <p className="text-gray-400">This Month</p>
          </div>
          <div>
            <span className="px-3 py-1 rounded border border-red-500 text-red-500 font-semibold">High Volatility</span>
          </div>
        </div>
      </div>



      <div className="w-full flex gap-10 mt-0">
        <div className="w-2/3 flex flex-col space-y-6">
          <Tabs defaultValue="overview" className="bg-black">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stocks">Stocks & ETFs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="flex mt-4">
                <div className="w-1/2 space-y-4">
                  <h3 className="text-xl font-semibold mb-2">About this crate</h3>
                  <p className="text-gray-400 text-sm">
                    This crate mirrors the stock holdings publicly disclosed by Nancy Pelosi, the longtime Democratic leader and former Speaker of the U.S. House of Representatives. Known for her high-profile tenure in Congress and her role at the center of U.S. political power, Pelosi has also become famous among retail traders for her timely stock picks revealed through mandatory congressional financial disclosures.
                  </p>
                  <p className="text-gray-400 text-sm" >All politician trades featured in this platform are based on publicly available congressional financial disclosures, which are legally required under the STOCK Act. This crate does not imply insider information or personal endorsement by Nancy Pelosi. Investing involves risk, and past performance is not indicative of future returns.</p>
                </div>
                <div className="w-1/2 text-sm p-6 text-gray-300">
                  <div className="relative border-l border-gray-600 pl-2 space-y-8 text-sm text-gray-300">
                    <div className="relative">
                      <span className="absolute -left-3 top-1 w-2 h-2 bg-gray-300 rounded-full"></span>
                      <p className="text-gray-400">2023–2024</p>
                      <p className="text-white font-semibold">US Constitution Representative</p>
                      <p className="text-gray-400">The purpose of lorem ipsum is to create a natural looking block of text</p>
                    </div>

                    <div className="relative">
                      <span className="absolute -left-3 top-1 w-2 h-2 bg-gray-300 rounded-full"></span>
                      <p className="text-gray-400">2024–2025</p>
                      <p className="text-white font-semibold">Lorem ipsum dolor sit amet,</p>
                      <p className="text-gray-400">The purpose of lorem ipsum is to create a natural looking block of text</p>
                    </div>

                    <div className="relative">
                      <span className="absolute -left-3 top-1 w-2 h-2 bg-gray-300 rounded-full"></span>
                      <p className="text-gray-400">2012–2024</p>
                      <p className="text-white font-semibold">Lorem ipsum dolor sit amet,</p>
                      <p className="text-gray-400">ut aliquip ex ea commodo consequat. Duis aute</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg mb-2">
                  Live Performance vs <span className="text-orange-400">Equity Smallcap</span>
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Current value of $100 invested once on Feb 5, 2024 would be
                </p>
                <CrateChart />
              </div>

            </TabsContent>
            <TabsContent value="stocks">
              <div className="flex flex-col mt-4">
                <h3 className="text-xl font-semibold mb-2">Holding Distribution</h3>
                <DonutChartWithLegend />
                <StocksTable />
              </div>
            </TabsContent>
          </Tabs>

        </div>
        <div className="border w-1/3 mt-16 border-gray-700 bg-[#111 h-[280px] p-6 rounded-xl space-y-4 shadow-md">
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold">$5.4/month</p>
            <span className="bg-green-600 text-black px-2 py-1 text-sm rounded">Free</span>
          </div>
          <p className="text-sm text-gray-400">17,425 Subscribers</p>
          <p className="text-sm text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
          </p>
          <Button className="w-full bg-white text-black">Subscribe</Button>
          <div className="flex gap-4 text-gray-500 text-sm justify-center pt-2">
            <span>⭐️</span>
            <span>⭐️</span>
            <span>⭐️</span>
          </div>
        </div>

      </div>

    </main>
  );
}
