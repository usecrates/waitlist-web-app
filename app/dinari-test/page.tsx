'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Dinari from '@dinari/api-sdk';
import { ethers } from "ethers";
import orderProcessorData from "@/lib/sbt-deployments/v0.4.0/order_processor.json";
import { createWalletClient, custom } from 'viem';
import { resolveViemChain, sendBatchOrderForViem, sendOrderForViem } from '@/utils/dinari-client';
const permitTypes = {
  Permit: [
    {
      name: "owner",
      type: "address"
    },
    {
      name: "spender",
      type: "address"
    },
    {
      name: "value",
      type: "uint256"
    },
    {
      name: "nonce",
      type: "uint256"
    },
    {
      name: "deadline",
      type: "uint256"
    }
  ],
};
const tokenAbi = [
  "function name() external view returns (string memory)",
  "function decimals() external view returns (uint8)",
  "function version() external view returns (string memory)",
  "function nonces(address owner) external view returns (uint256)",
];

async function getContractVersion(contract: ethers.Contract): Promise<string> {
  let contractVersion = '1';
  try {
    contractVersion = await contract.version();
  } catch {
    // do nothing
  }
  return contractVersion;
}

// {
//   chain_id: 'eip155:11155111',
//   fee: '0.25',
//   order_fee_contract_object: {
//     chain_id: 11155111,
//     fee_quote: {
//       deadline: 1752929485,
//       fee: '250000',
//       orderId: '79947742091934140318961801769020851197796702555430663194951546521125246970297',
//       requester: '0xdAF0182De86F904918Db8d07c7340A1EfcDF8244',
//       timestamp: 1752929185
//     },
//     fee_quote_signature: '0x50104e06e359538b75e12808825c088a47f5d7e81b27316da132781c1342ece00cb8a5f772325a94b99777b1fed234d40b6c0411e6f157381be827db0abafdc01c',
//     fees: [ [Object], [Object], [Object], [Object] ],
//     payment_token: '0x665b099132d79739462DfDe6874126AFe840F7a3'
//   }
// }

// const _order = {
//   chain_id: 'eip155:11155111',
//   order_side: 'BUY',
//   order_tif: 'DAY',
//   order_type: 'MARKET',
//   stock_id: "0196ea6d-b6de-70d5-ae41-9525959ef309",
//   payment_token: paymentTokenAddress,
//   payment_token_quantity: 10,
// }


async function getSignerFromMetamask() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  // Ask the user to connect their wallet
  await window.ethereum.request({ method: "eth_requestAccounts" });

  // Create an ethers provider using the injected provider (MetaMask)
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  // Get signer (the currently selected account in MetaMask)
  const signer = await provider.getSigner();

  // Optional: Get their address
  const address = await signer.getAddress();
  console.log("Connected wallet address:", address);

  return {signer,address};
}


export default function DinariTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string>('');
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    accountId: '019814c3-64d2-7611-a4b7-dcc7c068f6ea',
    chainId: 'eip155:11155111',
    orderSide: 'BUY',
    orderTif: 'DAY',
    orderType: 'MARKET',
    stockId: '0196ea6d-b6de-70d5-ae41-9525959ef309',
    paymentToken: '0x665b099132d79739462DfDe6874126AFe840F7a3',
    paymentTokenQuantity: '10',
    limitPrice: '100.0',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const testDinariOrder = async () => {
    setIsLoading(true);
    setResults('');

    try {
      // Check if MetaMask is available
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to test this functionality.');
      }


      const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
      if (!privateKey) throw new Error("empty key");
      const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;
      if (!RPC_URL) throw new Error("empty rpc url");
      const assetTokenAddress = process.env.NEXT_PUBLIC_ASSETTOKEN;
      if (!assetTokenAddress) throw new Error("empty asset token address");
      const paymentTokenAddress = process.env.NEXT_PUBLIC_PAYMENTTOKEN;
      if (!paymentTokenAddress) throw new Error("empty payment token address");
      const orderProcessorAbi = orderProcessorData.abi;
      // Initialize Dinari client
      const client = new Dinari({
        apiKeyID: process.env.NEXT_PUBLIC_DINARI_API_KEY_ID,
        apiSecretKey: process.env.NEXT_PUBLIC_DINARI_API_SECRET_KEY,
        environment: 'sandbox',
      });

      const provider = ethers.getDefaultProvider(RPC_URL);
      const {signer,address} = await getSignerFromMetamask();
      console.log(`Signer Address: ${address}`);
      const chainId = Number((await provider.getNetwork()).chainId);
      const orderProcessorAddress = orderProcessorData.networkAddresses[chainId];
      console.log(`Order Processor Address: ${orderProcessorAddress}`);
      console.log(orderProcessorAddress, "address");
      setResults('Step 1: Preparing order...\n');

      const orderProcessor = new ethers.Contract(
        orderProcessorAddress,
        orderProcessorAbi,
        signer,
      );
      const assetToken = new ethers.Contract(
        assetTokenAddress,
        tokenAbi,
        signer,
      );

      const paymentToken = new ethers.Contract(
        paymentTokenAddress,
        tokenAbi,
        signer,
      );

      const orderAmount = BigInt(1_000_000);
      // sell order amount (10 dShares)
      // const orderAmount = BigInt(10_000_000_000_000_000_000);
      // buy order (Change to true for Sell Order)
      const sellOrder = false;
      // market order
      const orderType = Number(0);
      // limit price
      const limitPrice = Number(0);

      // check the order precision doesn't exceed max decimals
      // applicable to sell orders only
      if (sellOrder) {
        const allowedDecimalReduction = await orderProcessor.orderDecimalReduction(assetTokenAddress);
        const allowablePrecisionReduction = 10 ** allowedDecimalReduction;
        if (Number(orderAmount) % allowablePrecisionReduction != 0) {
          const assetTokenDecimals = await assetToken.decimals();
          const maxDecimals = assetTokenDecimals - allowedDecimalReduction;
          throw new Error(`Order amount precision exceeds max decimals of ${maxDecimals}`);
        }
      }

      const orderParams = {
        requestTimestamp: Date.now(),
        recipient: address,
        assetToken: assetTokenAddress,
        paymentToken: paymentTokenAddress,
        sell: sellOrder,
        orderType: orderType,
        assetTokenQuantity: 0, // Asset amount to sell. Ignored for buys. Fees will be taken from proceeds for sells.
        paymentTokenQuantity: Number(10), // Payment amount to spend. Ignored for sells. Fees will be added to this amount for buys.
        price: limitPrice, // Limit price unused for market orders
        tif: 1, // GTC
      };
    
      const orderParams2 = {
        requestTimestamp: Date.now(),
        recipient: address,
        assetToken: "0x92d95BCB50B83d488bBFA18776ADC1553d3a8914",
        paymentToken: paymentTokenAddress,
        sell: sellOrder,
        orderType: orderType,
        assetTokenQuantity: 0, // Asset amount to sell. Ignored for buys. Fees will be taken from proceeds for sells.
        paymentTokenQuantity: Number(10), // Payment amount to spend. Ignored for sells. Fees will be added to this amount for buys.
        price: limitPrice, // Limit price unused for market orders
        tif: 1, // GTC
      };
      const _order = {
        chain_id: 'eip155:11155111',
        order_side: 'BUY',
        order_tif: 'DAY',
        order_type: 'MARKET',
        stock_id: "0196ea6d-b6de-70d5-ae41-9525959ef309",
        payment_token: paymentTokenAddress,
        payment_token_quantity: 10,
      }
      const _order2 = {
        chain_id: 'eip155:11155111',
        order_side: 'BUY',
        order_tif: 'DAY',
        order_type: 'MARKET',
        stock_id: "0196ea6d-b6df-7dcb-a1de-d7733e7bcc51",
        payment_token: paymentTokenAddress,
        payment_token_quantity: 8,
      }


      const feeQuoteResponse1 = await client.v2.accounts.orders.stocks.eip155.getFeeQuote(formData.accountId, _order);
      const feeQuoteResponse2 = await client.v2.accounts.orders.stocks.eip155.getFeeQuote(formData.accountId, _order2);

      const fees1 = BigInt(feeQuoteResponse1.order_fee_contract_object.fee_quote.fee);
      const fees2 = BigInt(feeQuoteResponse2.order_fee_contract_object.fee_quote.fee);
      const totalSpendAmount = orderAmount + fees1 + fees2;
      console.log(`fees: ${ethers.utils.formatUnits(fees1, 6)}`);
      console.log(`fees: ${ethers.utils.formatUnits(fees2, 6)}`);

      const nonce = await paymentToken.nonces(address);
      // // 5 minute deadline from current blocktime
      const blockNumber = await provider.getBlockNumber();
      const blockTime = (await provider.getBlock(blockNumber))?.timestamp;
      if (!blockTime) throw new Error("no block time");
      const deadline = blockTime + 60 * 5;


      const permitDomain = {
        name: await paymentToken.name(),
        version: await getContractVersion(paymentToken),
        chainId: (await provider.getNetwork()).chainId,
        verifyingContract: paymentTokenAddress,
      };

      // permit message to sign
      const permitMessage = {
        owner: address,
        spender: orderProcessorAddress,
        value: totalSpendAmount,
        nonce: nonce,
        deadline: deadline
      };


      const permitSignatureBytes = await signer._signTypedData(permitDomain, permitTypes, permitMessage);
      const permitSignature = ethers.utils.splitSignature(permitSignatureBytes);

      console.log(permitSignature);

      // // create selfPermit call data
      const selfPermitData = orderProcessor.interface.encodeFunctionData("selfPermit", [
        paymentTokenAddress,
        permitMessage.owner,
        permitMessage.value,
        permitMessage.deadline,
        permitSignature.v,
        permitSignature.r,
        permitSignature.s
      ]);

      console.log("self", selfPermitData)

      const requestOrderData = orderProcessor.interface.encodeFunctionData("createOrder", [[
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
      ], [
        feeQuoteResponse1.order_fee_contract_object.fee_quote.orderId,
        feeQuoteResponse1.order_fee_contract_object.fee_quote.requester,
        feeQuoteResponse1.order_fee_contract_object.fee_quote.fee,
        feeQuoteResponse1.order_fee_contract_object.fee_quote.timestamp,
        feeQuoteResponse1.order_fee_contract_object.fee_quote.deadline,
      ], feeQuoteResponse1.order_fee_contract_object.fee_quote_signature]);
    
      const requestOrderData2 = orderProcessor.interface.encodeFunctionData("createOrder", [[
        orderParams2.requestTimestamp,
        orderParams2.recipient,
        orderParams2.assetToken,
        orderParams2.paymentToken,
        orderParams2.sell,
        orderParams2.orderType,
        orderParams2.assetTokenQuantity,
        orderParams2.paymentTokenQuantity,
        orderParams2.price,
        orderParams2.tif,
      ], [
        feeQuoteResponse2.order_fee_contract_object.fee_quote.orderId,
        feeQuoteResponse2.order_fee_contract_object.fee_quote.requester,
        feeQuoteResponse2.order_fee_contract_object.fee_quote.fee,
        feeQuoteResponse2.order_fee_contract_object.fee_quote.timestamp,
        feeQuoteResponse2.order_fee_contract_object.fee_quote.deadline,
      ], feeQuoteResponse2.order_fee_contract_object.fee_quote_signature]);


      const tx = await orderProcessor.multicall([
        selfPermitData,
        requestOrderData,
        requestOrderData2
      ]);
      const receipt = await tx.wait();
      console.log(`tx hash: ${tx.hash}`);

      const orderEvent = receipt.logs.filter((log: any) => log.topics[0] === orderProcessor.interface.getEventTopic("OrderCreated")).map((log: any) => orderProcessor.interface.parseLog(log))[0];
      if (!orderEvent) throw new Error("no order event");
      const orderId = orderEvent.args[0];
      const orderAccount = orderEvent.args[1];
    
    
      // use order id to get order status (ACTIVE, FULFILLED, CANCELLED)
      const orderStatus = await orderProcessor.getOrderStatus(orderId);
      console.log(`Order Status: ${orderStatus}`);
      setResults(prev => prev + 'Order prepared successfully!\n');
      setResults(prev => prev + `Transaction data: ${orderId}\n`);
      setResults(prev => prev + `Tx hash: ${tx.hash}\n`);
      setResults(prev => prev + `Order Account: ${orderAccount}\n`);

    } catch (error) {
      console.error('Error testing Dinari order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setResults(prev => prev + `Error: ${errorMessage}\n`);

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dinari API Test</h1>
          <p className="text-muted-foreground">
            Test the Dinari API integration for stock orders
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle>Order Configuration</CardTitle>
              <CardDescription>
                Configure the parameters for your Dinari stock order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountId">Account ID</Label>
                <Input
                  id="accountId"
                  value={formData.accountId}
                  onChange={(e) => handleInputChange('accountId', e.target.value)}
                  placeholder="Enter your account ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chainId">Chain ID</Label>
                <Select value={formData.chainId} onValueChange={(value) => handleInputChange('chainId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eip155:421614">Arbitrum Sepolia (421614)</SelectItem>
                    <SelectItem value="eip155:11155111">Sepolia (11155111)</SelectItem>
                    <SelectItem value="eip155:1">Ethereum Mainnet (1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderSide">Order Side</Label>
                  <Select value={formData.orderSide} onValueChange={(value) => handleInputChange('orderSide', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BUY">BUY</SelectItem>
                      <SelectItem value="SELL">SELL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orderType">Order Type</Label>
                  <Select value={formData.orderType} onValueChange={(value) => handleInputChange('orderType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MARKET">MARKET</SelectItem>
                      <SelectItem value="LIMIT">LIMIT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderTif">Time in Force</Label>
                <Select value={formData.orderTif} onValueChange={(value) => handleInputChange('orderTif', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAY">DAY</SelectItem>
                    <SelectItem value="GTC">GTC</SelectItem>
                    <SelectItem value="IOC">IOC</SelectItem>
                    <SelectItem value="FOK">FOK</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stockId">Stock ID</Label>
                <Input
                  id="stockId"
                  value={formData.stockId}
                  onChange={(e) => handleInputChange('stockId', e.target.value)}
                  placeholder="Enter stock ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentToken">Payment Token Address</Label>
                <Input
                  id="paymentToken"
                  value={formData.paymentToken}
                  onChange={(e) => handleInputChange('paymentToken', e.target.value)}
                  placeholder="0x..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentTokenQuantity">
                  {formData.orderSide === 'BUY' && formData.orderType === 'MARKET'
                    ? 'Payment Token Quantity'
                    : 'Stock Quantity'
                  }
                </Label>
                <Input
                  id="paymentTokenQuantity"
                  type="number"
                  value={formData.paymentTokenQuantity}
                  onChange={(e) => handleInputChange('paymentTokenQuantity', e.target.value)}
                  placeholder="10"
                />
              </div>

              {formData.orderType === 'LIMIT' && (
                <div className="space-y-2">
                  <Label htmlFor="limitPrice">Limit Price</Label>
                  <Input
                    id="limitPrice"
                    type="number"
                    step="0.01"
                    value={formData.limitPrice}
                    onChange={(e) => handleInputChange('limitPrice', e.target.value)}
                    placeholder="100.00"
                  />
                </div>
              )}

              <Button
                onClick={testDinariOrder}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Processing...' : 'Test Dinari Order'}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                View the results of your Dinari API test
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={results}
                readOnly
                placeholder="Test results will appear here..."
                className="min-h-[400px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>

        {/* Environment Variables Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Environment Setup</CardTitle>
            <CardDescription>
              Make sure you have the following environment variables set in your .env.local file:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md font-mono text-sm">
              <div>NEXT_PUBLIC_DINARI_API_KEY_ID=your_api_key_id</div>
              <div>NEXT_PUBLIC_DINARI_API_SECRET_KEY=your_api_secret_key</div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Note: These are exposed to the client for testing purposes. In production,
              API calls should be made from the backend.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
