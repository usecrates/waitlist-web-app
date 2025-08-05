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

export function useSellOrderMutation() {
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();

    return useMutation({
        mutationFn: async ({ assets, accountId, crateId }: CreateSellOrderArgs) => {
            if (!walletClient || !address || !publicClient) throw new Error("Wallet not connected");
            if (!accountId || !assets || assets.length === 0) throw new Error("Invalid assets");

            let id = toast.loading("Creating sell order...");

            const chainId = publicClient.chain.id;
            const orderProcessorAbi = orderProcessorData.abi;
            const orderProcessorAddress = (orderProcessorData.networkAddresses as Record<string, string>)[String(chainId)] as `0x${string}`;

            if (!orderProcessorAddress) throw new Error("Missing order processor address");

            const dinariClient = new Dinari({
                apiKeyID: process.env.NEXT_PUBLIC_DINARI_API_KEY_ID,
                apiSecretKey: process.env.NEXT_PUBLIC_DINARI_API_SECRET_KEY,
                environment: "sandbox",
            });

            const orders = [];
            let totalFees = BigInt(0);
            const multiCallBytes: string[] = [];

            for (const asset of assets) {
                const assetTokenQuantity = parseUnits(asset.amountToSell, asset.decimals);
                const _order = {
                    chain_id: `eip155:${chainId}`,
                    order_side: 'SELL',
                    order_tif: 'DAY',
                    order_type: 'MARKET',
                    stock_id: asset.stockId,
                    payment_token: asset.paymentToken,
                    asset_token_quantity: assetTokenQuantity.toString(),
                };
                const orderParams = {
                    requestTimestamp: Date.now(),
                    recipient: address,
                    assetToken: asset.assetAddress,
                    paymentToken: asset.paymentToken,
                    sell: true,
                    orderType: 0,
                    assetTokenQuantity,
                    paymentTokenQuantity: 0,
                    price: 0,
                    tif: 1,
                };

                const feeQuoteResponse = await dinariClient.v2.accounts.orders.stocks.eip155.getFeeQuote(accountId, _order);
                const orderFee = BigInt(feeQuoteResponse.order_fee_contract_object.fee_quote.fee);
                totalFees += orderFee;

                orders.push({ orderParams, feeQuoteResponse });

                // ------- PERMIT for this asset -------
                const nonce = await publicClient.readContract({
                    address: asset.assetAddress,
                    abi: tokenAbi,
                    functionName: "nonces",
                    args: [address],
                });

                const block = await publicClient.getBlock();
                const deadline = Number(block.timestamp) + 60 * 5;

                const tokenName = await publicClient.readContract({
                    address: asset.assetAddress,
                    abi: tokenAbi,
                    functionName: "name",
                });

                let tokenVersion = "1";
                try {
                    tokenVersion = await publicClient.readContract({
                        address: asset.assetAddress,
                        abi: tokenAbi,
                        functionName: "version",
                    });
                } catch {}

                const permitDomain = {
                    name: tokenName,
                    version: tokenVersion,
                    chainId,
                    verifyingContract: asset.assetAddress,
                } as const;

                const permitMessage = {
                    owner: address,
                    spender: orderProcessorAddress,
                    value: assetTokenQuantity,
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
                    args: [asset.assetAddress, address, assetTokenQuantity, deadline, v, r, s],
                });

                multiCallBytes.push(selfPermitData);
            }

            const orderCalls = orders.map((order) => {
                return encodeFunctionData({
                    abi: orderProcessorAbi,
                    functionName: "createOrder",
                    args: [
                        [
                            order.orderParams.requestTimestamp,
                            order.orderParams.recipient,
                            order.orderParams.assetToken,
                            order.orderParams.paymentToken,
                            order.orderParams.sell,
                            order.orderParams.orderType,
                            order.orderParams.assetTokenQuantity,
                            order.orderParams.paymentTokenQuantity,
                            order.orderParams.price,
                            order.orderParams.tif,
                        ],
                        [
                            order.feeQuoteResponse.order_fee_contract_object.fee_quote.orderId,
                            order.feeQuoteResponse.order_fee_contract_object.fee_quote.requester,
                            order.feeQuoteResponse.order_fee_contract_object.fee_quote.fee,
                            order.feeQuoteResponse.order_fee_contract_object.fee_quote.timestamp,
                            order.feeQuoteResponse.order_fee_contract_object.fee_quote.deadline,
                        ],
                        order.feeQuoteResponse.order_fee_contract_object.fee_quote_signature,
                    ],
                });
            });

            // Send multicall with all permits + orders
            const txHash = await walletClient.writeContract({
                address: orderProcessorAddress,
                abi: orderProcessorAbi,
                functionName: "multicall",
                args: [[...multiCallBytes, ...orderCalls]],
                account: address,
            });

            await api.post("/transactions", {
                wallet: address,
                crateId,
                type: "sell",
                totalAmountInvested: assets.map(a => `${a.symbol}:${a.amountToSell}`).join(", "),
                totalFeesDeducted: formatUnits(totalFees, 6),
                transactionHash: txHash,
                chainId,
            });

            toast.success("Sell order completed successfully", { id });
            return txHash;
        },
    });
}
