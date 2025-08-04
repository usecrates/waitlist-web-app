import { useMutation } from "@tanstack/react-query";
import Dinari from "@dinari/api-sdk";
import { encodeFunctionData, formatUnits, parseAbi, parseAbiItem, parseEventLogs, parseUnits } from "viem";
import orderProcessorData from "@/lib/sbt-deployments/v0.4.0/order_processor.json";
import { useAccount, useWalletClient, usePublicClient, useWatchContractEvent } from "wagmi";
import { toast } from "react-hot-toast";
import { api } from "@/config";
const tokenAbi = parseAbi([
    "function name() view returns (string)",
    "function decimals() view returns (uint8)",
    "function version() view returns (string)",
    "function nonces(address owner) view returns (uint256)",
]);

const permitTypes = {
    Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
    ],
};

interface BuyOrderInput {
    stockId: string;
    assetAddress: string;
    weightage: number;
}

interface CreateBuyOrderArgs {
    assets: BuyOrderInput[];
    accountId: string;
    totalAmountToBeInvested: string;
    crateId?: string; 
}

export function useBuyOrderMutation() {
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();

    return useMutation({
        mutationFn: async ({ assets, accountId, totalAmountToBeInvested,crateId }: CreateBuyOrderArgs) => {
            console.log({assets});
            if (!walletClient || !address || !publicClient)
                throw new Error("Wallet not connected");
            if (!accountId || !assets || assets.length === 0) {
                toast.error("Invalid account ID or orders");
                throw new Error("Invalid account ID or orders");
            }
            let id = toast.loading("Creating buy order...");

            totalAmountToBeInvested = parseUnits(totalAmountToBeInvested, 6).toString();
            const paymentTokenAddress = process.env.NEXT_PUBLIC_PAYMENTTOKEN as `0x${string}`;
            const chainId = publicClient.chain.id;

            const orderProcessorAbi = orderProcessorData.abi;
            const orderProcessorAddress = (orderProcessorData.networkAddresses as Record<string, string>)[String(chainId)] as `0x${string}`;
            if (!orderProcessorAddress) throw new Error("Missing order processor address");

            const dinariClient = new Dinari({
                apiKeyID: process.env.NEXT_PUBLIC_DINARI_API_KEY_ID,
                apiSecretKey: process.env.NEXT_PUBLIC_DINARI_API_SECRET_KEY,
                environment: "sandbox",
            });
            const totalWeight = assets.reduce((sum, asset) => sum + asset.weightage, 0);
            const orders = [];
            let totalOrderAmount = BigInt(0);
            let totalFees = BigInt(0);
            let orderType: number = 0;
            let tif: number = 1;
            const multiCallBytes: string[] = [];
            for (const asset of assets) {
                const rawAmount = (asset.weightage / totalWeight) * Number(totalAmountToBeInvested);
                const paymentTokenQuantity = rawAmount.toString();
                const formattedQuantity = formatUnits(BigInt(paymentTokenQuantity), 6);

                const _order = {
                    chain_id: `eip155:${chainId}`,
                    order_side: 'BUY',
                    order_tif: 'DAY',
                    order_type: 'MARKET',
                    stock_id: asset.stockId,
                    payment_token: paymentTokenAddress,
                    payment_token_quantity: formattedQuantity,
                };

                const orderParams = {
                    requestTimestamp: Date.now(),
                    recipient: address,
                    assetToken: asset.assetAddress,
                    paymentToken: paymentTokenAddress,
                    sell: false,
                    orderType: orderType, // assuming defined elsewhere
                    assetTokenQuantity: 0,
                    paymentTokenQuantity: paymentTokenQuantity,
                    price: 0,
                    tif: tif, // assuming defined elsewhere
                };

                const feeQuoteResponse = await dinariClient.v2.accounts.orders.stocks.eip155.getFeeQuote(accountId, _order);

                const orderFee = BigInt(feeQuoteResponse.order_fee_contract_object.fee_quote.fee);

                totalOrderAmount += BigInt(paymentTokenQuantity);
                totalFees += orderFee;

                orders.push({
                    _order,
                    orderParams,
                    feeQuoteResponse,
                    orderFee,
                });
            }
            const totalSpendAmount = totalOrderAmount + totalFees;
            const nonce = await publicClient.readContract({
                address: paymentTokenAddress,
                abi: tokenAbi,
                functionName: "nonces",
                args: [address],
            });

            const block = await publicClient.getBlock();
            const deadline = Number(block.timestamp) + 60 * 5;
            const tokenName = await publicClient.readContract({
                address: paymentTokenAddress,
                abi: tokenAbi,
                functionName: "name",
            });

            let tokenVersion = "1";
            try {
                tokenVersion = await publicClient.readContract({
                    address: paymentTokenAddress,
                    abi: tokenAbi,
                    functionName: "version",
                });
            } catch { }

            const permitDomain = {
                name: tokenName,
                version: tokenVersion,
                chainId,
                verifyingContract: paymentTokenAddress,
            } as const;

            const permitMessage = {
                owner: address,
                spender: orderProcessorAddress,
                value: totalSpendAmount,
                nonce,
                deadline,
            };

            const permitSig = await walletClient.signTypedData({
                domain: permitDomain,
                types: permitTypes,
                primaryType: "Permit",
                message: permitMessage,
                account: address,
            });

            const v = parseInt(permitSig.slice(-2), 16);
            const r = `0x${permitSig.slice(2, 66)}` as `0x${string}`;
            const s = `0x${permitSig.slice(66, 130)}` as `0x${string}`;

            const selfPermitData = encodeFunctionData({
                abi: orderProcessorAbi,
                functionName: "selfPermit",
                args: [paymentTokenAddress, address, totalSpendAmount, deadline, v, r, s],
            });
            multiCallBytes.push(selfPermitData);

            if (orders.length === 0) {
                throw new Error("No valid orders to process");
            }
            const orderCalls = orders.map((order, i) => {
                return encodeFunctionData({
                    abi: orderProcessorAbi,
                    functionName: "createOrder",
                    args: [[
                        order?.orderParams.requestTimestamp,
                        order?.orderParams.recipient,
                        order?.orderParams.assetToken,
                        order?.orderParams.paymentToken,
                        order?.orderParams.sell,
                        order?.orderParams.orderType,
                        order?.orderParams.assetTokenQuantity,
                        order?.orderParams.paymentTokenQuantity,
                        order?.orderParams.price,
                        order?.orderParams.tif,
                    ], [
                        order?.feeQuoteResponse.order_fee_contract_object.fee_quote.orderId,
                        order?.feeQuoteResponse.order_fee_contract_object.fee_quote.requester,
                        order?.feeQuoteResponse.order_fee_contract_object.fee_quote.fee,
                        order?.feeQuoteResponse.order_fee_contract_object.fee_quote.timestamp,
                        order?.feeQuoteResponse.order_fee_contract_object.fee_quote.deadline,
                    ], order?.feeQuoteResponse.order_fee_contract_object.fee_quote_signature],
                });
            });

            const txHash = await walletClient.writeContract({
                address: orderProcessorAddress,
                abi: orderProcessorAbi,
                functionName: "multicall",
                args: [[selfPermitData, ...orderCalls]],
                account: address,
            });

            const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
            console.log({ receipt });

            const orderEvents = receipt.logs
                .filter(log => log.address.toLowerCase() === orderProcessorAddress.toLowerCase())
                .flatMap(log => {
                    try {
                        return parseEventLogs({
                            abi: orderProcessorAbi,
                            logs: [log],
                            eventName: "OrderCreated",
                        });
                    } catch (err) {
                        return [];
                    }
                });

            if (orderEvents.length === 0) throw new Error("No OrderCreated events found");
            const orderIds = orderEvents.map(event => event.args.id?.toString());
            console.log("Order IDs:", orderIds);
            console.log({
                wallet: address,
                crateId,
                type: "buy",
                totalAmountInvested: formatUnits(totalOrderAmount, 6),
                totalFeesDeducted: formatUnits(totalFees, 6),
                transactionHash: txHash,
                orderIds,
                chainId,
            });

            await api.post("/transactions", {
                wallet: address,
                crateId,
                type: "buy",
                totalAmountInvested: formatUnits(totalOrderAmount, 6),
                totalFeesDeducted: formatUnits(totalFees, 6),
                transactionHash: txHash,
                orderIds,
                chainId,
            });

            toast.success("Buy order completed successfully", { id });

            return txHash;
        },
    });
}
