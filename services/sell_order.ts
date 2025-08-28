import { useMutation } from "@tanstack/react-query";
import Dinari from "@dinari/api-sdk";
import { encodeFunctionData, formatUnits, parseAbi, parseUnits } from "viem";
import orderProcessorData from "@/lib/sbt-deployments/v0.4.0/order_processor.json";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { toast } from "react-hot-toast";
import { api } from "@/config";
import { BigNumber, ethers } from "ethers";

const tokenAbi = parseAbi([
    "function name() view returns (string)",
    "function decimals() view returns (uint8)",
    "function version() view returns (string)",
    "function nonces(address owner) view returns (uint256)",
    "function balanceOf(address account) view returns (uint256)",
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

function getTokenAddress(chainId, tokens) {
    const entry = tokens.find(token => token.split(":")[1] === String(chainId));
    return entry ? entry.split(":")[2] : null;
}

interface CreateSellOrderArgs {
    accountId: string;
    crateId: string;
    crateInvestmentData: any;
}

export function useSellOrderMutation() {
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();

    return useMutation({
        mutationFn: async ({ crateInvestmentData, accountId, crateId }: CreateSellOrderArgs) => {
            if (!walletClient || !address || !publicClient) throw new Error("Wallet not connected");

            const id = toast.loading("Creating sell order...");

            const chainId = publicClient.chain.id;
            const orderProcessorAbi = orderProcessorData.abi;
            const orderProcessorAddress = (orderProcessorData.networkAddresses as Record<string, string>)[String(chainId)] as `0x${string}`;
            if (!orderProcessorAddress) throw new Error("Missing order processor address");

            const dinariClient = new Dinari({
                apiKeyID: process.env.NEXT_PUBLIC_DINARI_API_KEY_ID,
                apiSecretKey: process.env.NEXT_PUBLIC_DINARI_API_SECRET_KEY,
                environment: "sandbox",
            });

            const multiCallBytes: string[] = [];
            const executableOrders: any[] = [];
            let totalUsdWithdrawn = 0;
            let totalFees = BigInt(0);

            // ✅ loop over crateInvestmentData.stockHoldings instead of "assets"
            for (const stock of crateInvestmentData.stockHoldings) {
                const _stock = stock.stockId;

                const assetTokenAddress = getTokenAddress(chainId, _stock.tokens);
                if (!assetTokenAddress) {
                    console.log(`⚠️ Skipping Stock ${_stock.dinari_id} (No token for chainId ${chainId})`);
                    continue;
                }

                const userBalance = await publicClient.readContract({
                    address: assetTokenAddress,
                    abi: tokenAbi,
                    functionName: "balanceOf",
                    args: [address],
                });

                const decimals = await publicClient.readContract({
                    address: assetTokenAddress,
                    abi: tokenAbi,
                    functionName: "decimals",
                    args: [],
                });
                const orderAmount = parseUnits(stock.sharesOwned.toString(), decimals);
                if (userBalance < orderAmount) {
                    console.log(`Skipping ${stock.stockId}, insufficient balance`);
                    continue;
                }


                const sellOrder = true;
                const orderType = 0;

                let actualAmount = BigNumber.from(orderAmount);
                if (sellOrder) {
                  const { data: allowedDecimalReduction } = await publicClient.readContract({
                    address: orderProcessorAddress,
                    abi: orderProcessorAbi,
                    functionName: "orderDecimalReduction",
                    args: [assetTokenAddress],
                  });
                
                  const allowablePrecisionReduction = 10 ** allowedDecimalReduction;
                  const assetTokenDecimals = decimals; 
                  console.log({assetTokenDecimals,allowablePrecisionReduction})
                  const maxDecimals = assetTokenDecimals - allowedDecimalReduction;
                  console.log(`Max Decimals Allowed for Order Amount: ${maxDecimals}`);
                
                  const scale = BigNumber.from(10).pow(assetTokenDecimals - allowedDecimalReduction);
                  actualAmount = actualAmount.div(scale).mul(scale);
                
                  console.log(`Adjusted Order Amount: ${actualAmount} tokens`);
                
                  if (Number(actualAmount) % allowablePrecisionReduction !== 0) {
                    console.log(`Asset Token Decimals: ${assetTokenDecimals}`);
                    throw new Error(`Order amount precision exceeds max decimals of ${maxDecimals}`);
                  }
                }
                

                const orderParams = {
                    requestTimestamp: Date.now(),
                    recipient: address,
                    assetToken: assetTokenAddress,
                    paymentToken: process.env.NEXT_PUBLIC_PAYMENTTOKEN,
                    sell: sellOrder,
                    orderType: orderType,
                    assetTokenQuantity: orderAmount,
                    paymentTokenQuantity: 0,
                    price: 0,
                    tif: 1,
                };

                const _order = {
                    chain_id: `eip155: ${chainId}`,
                    order_side: "SELL",
                    order_tif: "DAY",
                    order_type: "MARKET",
                    stock_id: _stock.dinari_id,
                    payment_token: process.env.NEXT_PUBLIC_PAYMENTTOKEN,
                    asset_token_quantity: orderAmount.toString(),
                };

                const feeQuoteResponse = await dinariClient.v2.accounts.orders.stocks.eip155.getFeeQuote(accountId, _order);
                const orderFee = BigInt(feeQuoteResponse.order_fee_contract_object.fee_quote.fee);
                totalFees += orderFee;

                console.log(totalFees, "totalFews");

                // Permit signing
                const nonce = await publicClient.readContract({
                    address: assetTokenAddress,
                    abi: tokenAbi,
                    functionName: "nonces",
                    args: [address],
                });
                const block = await publicClient.getBlock();
                const deadline = Number(block.timestamp) + 60 * 5;
                const tokenName = await publicClient.readContract({
                    address: assetTokenAddress,
                    abi: tokenAbi,
                    functionName: "name",
                });
                let tokenVersion = "1";
                try {
                    tokenVersion = await publicClient.readContract({
                        address: assetTokenAddress,
                        abi: tokenAbi,
                        functionName: "version",
                    });
                } catch { }

                const permitDomain = {
                    name: tokenName,
                    version: tokenVersion,
                    chainId,
                    verifyingContract: assetTokenAddress,
                } as const;

                const permitMessage = {
                    owner: address,
                    spender: orderProcessorAddress,
                    value: orderAmount,
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
                const r = `0x${ permitSig.slice(2, 66) }` as `0x${ string }`;
                const s = `0x${ permitSig.slice(66, 130) }` as `0x${ string }`;

                const selfPermitData = encodeFunctionData({
                    abi: orderProcessorAbi,
                    functionName: "selfPermit",
                    args: [assetTokenAddress, address, orderAmount, deadline, v, r, s],
                });
                multiCallBytes.push(selfPermitData);

                const requestOrderData = encodeFunctionData({
                    abi: orderProcessorAbi,
                    functionName: "createOrder",
                    args: [
                        [
                            orderParams.requestTimestamp,
                            orderParams.recipient,
                            orderParams.assetToken,
                            orderParams.paymentToken,
                            orderParams.sell,
                            orderParams.orderType,
                            orderParams.assetTokenQuantity,
                            orderParams.paymentTokenQuantity,
                            orderParams.price,
                            orderParams.tif,
                        ],
                        [
                            feeQuoteResponse.order_fee_contract_object.fee_quote.orderId,
                            feeQuoteResponse.order_fee_contract_object.fee_quote.requester,
                            feeQuoteResponse.order_fee_contract_object.fee_quote.fee,
                            feeQuoteResponse.order_fee_contract_object.fee_quote.timestamp,
                            feeQuoteResponse.order_fee_contract_object.fee_quote.deadline,
                        ],
                        feeQuoteResponse.order_fee_contract_object.fee_quote_signature,
                    ],
                });
                multiCallBytes.push(requestOrderData);

                executableOrders.push({
                    stock: _stock._id,
                    sharesOwned: formatUnits(orderAmount, decimals),
                });
                totalUsdWithdrawn += Number(formatUnits(orderAmount, decimals)) * _stock.price;
            }

            if (multiCallBytes.length === 0) throw new Error("No sell orders to process");

            const txHash = await walletClient.writeContract({
                address: orderProcessorAddress,
                abi: orderProcessorAbi,
                functionName: "multicall",
                args: [multiCallBytes],
                account: address,
            });

            // Push transaction to backend
            await api.post("/transactions", {
                wallet: address,
                crateId,
                type: "sell",
                stockHoldings: executableOrders,
                totalAmountInvested: totalUsdWithdrawn,
                totalFeesDeducted: formatUnits(totalFees, 6),
                transactionHash: txHash,
                chainId,
            });
            toast.success("Sell order completed successfully", { id });
            return txHash;
        },
    });
}
