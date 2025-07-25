"use client";
import CrateChart from "@/components/CreateChart";
import { DonutChartWithLegend } from "@/components/DonutChart";
import { StocksTable } from "@/components/stocks/StocksTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Twitter, Share, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { BuyCrateModal } from "@/components/BuyCrateModal";
import { ExitCrateModal } from "@/components/ExitCrateModal";
import { KycModal } from "@/components/KycModal";
import { useParams } from "next/navigation";
import { useGetCrateById } from "@/hooks/user-hooks";
import { useBuyOrderMutation } from "@/services/buy_order";
import {toast} from "sonner";
export default function SingleCrate() {
  const isSubscribed = false;
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const isKyced = false;
  const { basket_id } = useParams();
  const { data: crate, isLoading } = useGetCrateById(basket_id as string);
  const { mutate: createBuyOrder, isLoading:createBuyOrderLoading, isSuccess, error } = useBuyOrderMutation();
  const handleClick = () => {
    console.log("Helloo World !!!");
    createBuyOrder({
      crateId: basket_id as string,
      accountId: "019814c3-64d2-7611-a4b7-dcc7c068f6ea",
      totalAmountToBeInvested : "5",
      assets: [
        {
          stockId: "0196ea6d-b6de-70d5-ae41-9525959ef309",
          assetAddress: "0xD771a71E5bb303da787b4ba2ce559e39dc6eD85c",
          weightage: 40,
        },
        {
          stockId: "0196ea6d-b6ed-716d-a541-4c36bd32e84a",
          assetAddress: "0x7B58f454c36Edc0FBDEDfA8E0D4392A1a4c0b96c",
          weightage: 40,
        },
        {
          stockId: "0196ea6d-b6f6-7025-867a-b1fc580ea1a0",
          assetAddress: "0xdc2C5910d367f62F2F3234C9eaa5Afb12948Ef01",
          weightage: 20,
        },
      ],
    });
  };
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  if (!crate) {
    return <div className="flex items-center justify-center min-h-screen">Crate not found</div>;
  }
  return (
    <main className="px-6 py-20 max-w-6xl mx-auto text-white space-y-10">
      <button
        className="mb-6 mt-4 flex items-center gap-2 text-gray-400 hover:text-white"
        onClick={() => window.history.back()}
      >
        <ArrowLeft size={18} />
        Back
      </button>
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex gap-4 items-start w-1/2">
          <img src={crate.imageUrl || "https://t3.ftcdn.net/jpg/06/99/46/60/360_F_699466075_DaPTBNlNQTOwwjkOiFEoOvzDV0ByXR9E.jpg"} className="w-20 h-20 rounded-xl object-cover"
            alt={crate?.name} />
          <div>
            <h2 className="text-2xl font-bold">{crate?.name}</h2>
            <p className="text-sm text-gray-400">Democrat / House / California</p>
            <p className="text-sm mt-2">{crate?.description}
            </p>
          </div>
        </div>

        <div className="flex gap-6 items-center text-sm">
          <div>
            <p className="text-green-400
             text-xl font-semibold">+{crate?.totalReturnPercent}%</p>
            <p className="text-gray-400">Total Returns</p>
          </div>
          <div>
            <p className="text-green-400
             text-xl font-semibold">+{crate?.monthlyReturnPercent}%</p>
            <p className="text-gray-400">This Month</p>
          </div>
          <div>
            <span className="px-4 py-2 flex items-center gap-2 rounded bg-[#2D2D2D]  text-red-400 font-semibold">
              <Image src="/assets/volatile.svg" alt="volatility" height={16} width={16} />
              High Volatility</span>
          </div>
        </div>
      </div>
      <div className="w-full flex gap-10 mt-0">
        <div className="w-2/3 flex flex-col space-y-6">
          <Tabs defaultValue="Overview" className="bg-[#0e0e0e] w-full">
            <TabsList className="flex gap-8 border-t pt-3 border-b border-[#232323] mb-0 bg-transparent p-0 h-auto text-base justify-start items-start w-full">
              <TabsTrigger
                value="Overview"
                className="px-2 pb-2 text-base border-b-2 transition-all border-transparent text-gray-400 bg-transparent shadow-none data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-400"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="Stocks & ETFs"
                className="px-2 pb-2 text-base border-b-2 transition-all border-transparent text-gray-400 bg-transparent shadow-none data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-400"
              >
                Stocks & ETFs
              </TabsTrigger>
            </TabsList>

            {/* Stats Bar */}
            <div className=" border-b border-[#282828] p-4 mt-4  flex justify-between font-chakra">
              <div>
                <div className="text-white text-xl">{crate.stocks.length}</div>
                <div className="text-[#898989] text-xs">Total No.of Stocks</div>
              </div>
              <div>
                <div className="text-white text-xl">Jun 1, 2025</div>
                <div className="text-[#898989] text-xs">Last Rebalance</div>
              </div>
              <div>
                <div className="text-white text-xl capitalize">{crate?.rebalanceFrequency}</div>
                <div className="text-[#898989] text-xs">Rebalance Frequency</div>
              </div>
            </div>

            <TabsContent value="Overview">
              <div className="flex p-5 mt-4">
                <div className="w-1/2 space-y-4 ">
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
              <hr className="border-[#383838] py-4" />
              <div>
                <h3 className="text-lg mb-2">
                  Live Performance vs <span className="text-[#FFC081]">Equity Smallcap</span>
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Current value of $100 invested once on Feb 5, 2024 would be
                </p>
                <CrateChart />
              </div>

            </TabsContent>
            <TabsContent value="Stocks & ETFs">
              <div className="flex flex-col mt-4">
                <h3 className="text-xl font-semibold mb-2">Holding Distribution</h3>
                <div className="relative w-full h-[300px]">
                  <DonutChartWithLegend />
                  {!isSubscribed && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-lg border border-[#232323] z-10">
                      <img src="/assets/lock.svg" alt="Locked" className="mb-4" width={54} height={54} />
                      <div className="text-white text-3xl w-1/2 text-center font-semibold mb-2">
                        Subscribe to see stocks of this crate
                      </div>
                      <button className="bg-gradient-to-b from-[#7B7B7B] to-[#EBEBEB] text-black font-bold px-8 py-2 rounded mt-2">
                        Subscribe
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-8">
                  <div className="relative w-full">
                    <div className="rounded-lg overflow-x-auto">
                      <StocksTable stocks={crate?.stocks} />
                      {!isSubscribed && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-lg border border-[#232323] z-10">
                          <img src="/assets/lock.svg" alt="Locked" className="mb-4" width={54} height={54} />
                          <div className="text-white text-3xl w-1/2 text-center font-semibold mb-2">
                            Subscribe to see stocks of this crate
                          </div>
                          <button className="bg-gradient-to-b from-[#7B7B7B] to-[#EBEBEB] text-black font-bold px-8 py-2 rounded mt-2">
                            Subscribe
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

        </div>
        <div className="border w-1/3 border-gray-700 bg-[#111 h-fit p-6 rounded-xl space-y-4 shadow-md">
          {isSubscribed ? (
            <div className="flex flex-col items-center justify-center h-full w-full">
              <div className="w-full max-w-xs rounded-xl shadow-md">
                <div className="flex items-center mb-6">
                  <span className="text-white font-semibold text-sm">Your Performance</span>
                  <span className="flex-1 border-t border-[#383838] ml-4"></span>
                </div>
                <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-6">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-white">150$</span>
                    <span className="text-gray-400 text-sm mt-1">Current Value</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-white">100$</span>
                    <span className="text-gray-400 text-sm mt-1">Current Investment</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-white">200$</span>
                    <span className="text-gray-400 text-sm mt-1">Money Put in</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-white">$120 <span className="text-green-400 text-xs font-semibold align-bottom">+50%</span></span>
                    <span className="text-gray-400 text-sm mt-1">Total Returns</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-white">50$ <span className="text-green-400 text-xs font-semibold align-bottom">+50%</span></span>
                    <span className="text-gray-400 text-sm mt-1">Current Returns</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-green-400">$90</span>
                    <span className="text-gray-400 text-sm mt-1">Realised Returns</span>
                  </div>
                </div>
                <button
                  className="w-full mt-2 py-2 rounded-lg font-bold text-lg text-black"
                  style={{
                    background:
                      "linear-gradient(180deg, #7B7B7B 0%, #EBEBEB 27.19%, #999999 72.17%)",
                    backgroundBlendMode: "normal, normal",
                  }}
                  onClick={() => setExitModalOpen(true)}
                >
                  Invest More
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-2 items-center">
                <p className="text-lg font-bold text-[#989898] capitalize">${crate.subscriptionAmount}/{crate.subscriptionPeriod}</p>
                <span className="bg-green-600  text-white px-4 py-1 text-sm rounded">Free</span>
              </div>
              <p className="text-sm text-white bg-[#202020] w-fit px-2 py-1 rounded-md">{crate.activeSubscribers} Subscribers</p>
              <p className="text-sm text-gray-400">
                Follow Nancy Pelosi's crates and copy trade her automatically
              </p>
              <div className="flex gap-4">
                <Button
                  className="w-full !font-bold bg-white text-black"
                  style={{
                    background:
                      "linear-gradient(180deg, #7B7B7B 0%, #EBEBEB 27.19%, #999999 72.17%)",
                    backgroundBlendMode: "normal, normal",
                  }}
                  onClick={() => {
                    if (isKyced) {
                      setBuyModalOpen(true);
                    } else {
                      setKycModalOpen(true);
                    }
                  }}
                >
                  Subscribe
                </Button>
                <Button
                  onClick={handleClick}
                  className="w-full !font-bold bg-white text-black"
                  style={{
                  background:
                    "linear-gradient(180deg, #7B7B7B 0%, #EBEBEB 27.19%, #999999 72.17%)",
                  backgroundBlendMode: "normal, normal",
                  }}
                  disabled={createBuyOrderLoading}
                >
                  {createBuyOrderLoading ? "Processing..." : "Invest"}
                </Button>
              </div>
              <BuyCrateModal
                open={buyModalOpen}
                onOpenChange={setBuyModalOpen}
                crate={{
                  name: "Nancy Pelosi",
                  meta: "Democrat/House/California",
                  image: "/assets/image.png"
                }}
              />
              <KycModal
                open={kycModalOpen}
                onOpenChange={setKycModalOpen}
                crate={{
                  name: "Nancy Pelosi",
                  meta: "Democrat/House/California",
                  image: "/assets/image.png"
                }}
              />
            </>
          )}
        </div>
        <ExitCrateModal
          open={exitModalOpen}
          onOpenChange={setExitModalOpen}
          crate={{
            name: "Nancy Pelosi",
            meta: "Democrat/House/California",
            image: "/assets/image.png"
          }}
        />
      </div>

    </main>
  );
}
