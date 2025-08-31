import { useMutation } from "@tanstack/react-query";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { toast } from "sonner";
import orderProcessorData from "@/lib/sbt-deployments/v0.4.0/order_processor.json";

export function useGetOrderStatus() {

  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  console.log(address,walletClient,publicClient,"client")
  if (!walletClient || !address || !publicClient)
    throw new Error("Wallet not connected");

  return useMutation({
    mutationFn: async ({ orderIds }: { orderIds: string[] }) => {
      try {
        if (!publicClient || !walletClient) throw new Error("Wallet not connected");

        const chainId = publicClient.chain.id;
        const orderProcessorAbi = orderProcessorData.abi;
        const orderProcessorAddress = (orderProcessorData.networkAddresses as Record<
          string,
          string
        >)[String(chainId)] as `0x${string}`;

        // Call contract for each orderId
        const statuses = await Promise.all(
          orderIds.map(async (orderId) => {
            const status = await publicClient.readContract({
              address: orderProcessorAddress,
              abi: orderProcessorAbi,
              functionName: "getOrderStatus",
              args: [orderId],
            });
            return Number(status); // 0 = pending, 1 = completed
          })
        );

        const completedCount = statuses.filter((s) => s === 1).length;
        const percentageCompleted =
          orderIds.length > 0
            ? (completedCount / orderIds.length) * 100
            : 0;

        return {
          statuses,
          completedCount,
          total: orderIds.length,
          percentageCompleted,
        };
      } catch (err: any) {
        toast.error(err?.message || "Failed to fetch order status");
        throw err;
      }
    },
  });
}
