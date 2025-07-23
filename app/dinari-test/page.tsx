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
import orderProcessorData from '@/lib/sbt-deployments/v0.4.0/order_processor.json';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import LoginButton from '@/components/LoginButton';
import { encodeFunctionData, parseAbi, decodeEventLog } from 'viem';

const permitTypes = {
  Permit: [
    { name: 'owner', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
};

const tokenAbi = parseAbi([
  'function name() view returns (string)',
  'function decimals() view returns (uint8)',
  'function version() view returns (string)',
  'function nonces(address owner) view returns (uint256)',
]);

async function getContractVersion({ client, address, abi }: { client: any; address: string; abi: any }) {
  let contractVersion = '1';
  try {
    contractVersion = await client.readContract({
      address,
      abi,
      functionName: 'version',
    });
  } catch {
    // do nothing
  }
  return contractVersion;
}

export default function DinariTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string>('');
  const { toast } = useToast();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  

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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const testDinariOrder = async () => {
    setIsLoading(true);
    setResults('');
    try {
      if (!walletClient || !address || !publicClient) {
        throw new Error('Wallet not connected. Please connect your wallet.');
      }
      const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;
      if (!RPC_URL) throw new Error('empty rpc url');
      const assetTokenAddress = process.env.NEXT_PUBLIC_ASSETTOKEN as `0x${string}`;
      if (!assetTokenAddress) throw new Error('empty asset token address');
      const paymentTokenAddress = process.env.NEXT_PUBLIC_PAYMENTTOKEN as `0x${string}`;
      if (!paymentTokenAddress) throw new Error('empty payment token address');
      const orderProcessorAbi = orderProcessorData.abi;
      // Get chainId from publicClient
      const chainId = publicClient.chain.id;
      // Use the original type and cast only at the point of use
      const orderProcessorAddress = (orderProcessorData.networkAddresses as Record<string, string>)[String(chainId)] as `0x${string}`;
      if (!orderProcessorAddress) throw new Error('No order processor address for this chain');
      setResults('Step 1: Preparing order...\n');
      // Order params
      const orderAmount = BigInt(1_000_000);
      const sellOrder = false;
      const orderType = 0;
      const limitPrice = 0;
      const orderParams = {
        requestTimestamp: Date.now(),
        recipient: address,
        assetToken: assetTokenAddress,
        paymentToken: paymentTokenAddress,
        sell: sellOrder,
        orderType: orderType,
        assetTokenQuantity: 0,
        paymentTokenQuantity: Number(10),
        price: limitPrice,
        tif: 1,
      };
      const orderParams2 = {
        requestTimestamp: Date.now(),
        recipient: address,
        assetToken: '0x92d95BCB50B83d488bBFA18776ADC1553d3a8914' as `0x${string}`,
        paymentToken: paymentTokenAddress,
        sell: sellOrder,
        orderType: orderType,
        assetTokenQuantity: 0,
        paymentTokenQuantity: Number(10),
        price: limitPrice,
        tif: 1,
      };
      const _order = {
        chain_id: 'eip155:11155111',
        order_side: 'BUY',
        order_tif: 'DAY',
        order_type: 'MARKET',
        stock_id: '0196ea6d-b6de-70d5-ae41-9525959ef309',
        payment_token: paymentTokenAddress,
        payment_token_quantity: 10,
      };
      const _order2 = {
        chain_id: 'eip155:11155111',
        order_side: 'BUY',
        order_tif: 'DAY',
        order_type: 'MARKET',
        stock_id: '0196ea6d-b6df-7dcb-a1de-d7733e7bcc51',
        payment_token: paymentTokenAddress,
        payment_token_quantity: 8,
      };
      // Fee quotes
      const client = new Dinari({
        apiKeyID: process.env.NEXT_PUBLIC_DINARI_API_KEY_ID,
        apiSecretKey: process.env.NEXT_PUBLIC_DINARI_API_SECRET_KEY,
        environment: 'sandbox',
      });
      const feeQuoteResponse1 = await client.v2.accounts.orders.stocks.eip155.getFeeQuote(formData.accountId, { ..._order, order_side: _order.order_side as any, order_tif: _order.order_tif as any, order_type: _order.order_type as any, chain_id: _order.chain_id as any });
      const feeQuoteResponse2 = await client.v2.accounts.orders.stocks.eip155.getFeeQuote(formData.accountId, { ..._order2, order_side: _order2.order_side as any, order_tif: _order2.order_tif as any, order_type: _order2.order_type as any, chain_id: _order2.chain_id as any });
      const fees1 = BigInt(feeQuoteResponse1.order_fee_contract_object.fee_quote.fee);
      const fees2 = BigInt(feeQuoteResponse2.order_fee_contract_object.fee_quote.fee);
      const totalSpendAmount = orderAmount + fees1 + fees2;
      // Get nonce, name, version, decimals from paymentToken
      const nonce = await publicClient.readContract({
        address: paymentTokenAddress,
        abi: tokenAbi,
        functionName: 'nonces',
        args: [address],
      });
      const block = await publicClient.getBlock();
      const blockTime = block.timestamp;
      const deadline = Number(blockTime) + 60 * 5;
      const tokenName = await publicClient.readContract({
        address: paymentTokenAddress,
        abi: tokenAbi,
        functionName: 'name',
      });
      const tokenVersion = await getContractVersion({ client: publicClient, address: paymentTokenAddress, abi: tokenAbi });
      const permitDomain = {
        name: tokenName,
        version: tokenVersion,
        chainId: chainId,
        verifyingContract: paymentTokenAddress,
      } as const;
      const permitMessage = {
        owner: address,
        spender: orderProcessorAddress,
        value: totalSpendAmount,
        nonce: nonce,
        deadline: deadline,
      };
      // Sign permit
      const permitSignature = await walletClient.signTypedData({
        domain: permitDomain,
        types: permitTypes,
        primaryType: 'Permit',
        message: permitMessage,
        account: address,
      });
      // viem returns a hex signature, split it
      const v = parseInt(permitSignature.slice(-2), 16);
      const r = `0x${permitSignature.slice(2, 66)}` as `0x${string}`;
      const s = `0x${permitSignature.slice(66, 130)}` as `0x${string}`;
      // Encode multicall data
      const selfPermitData = encodeFunctionData({
        abi: orderProcessorAbi,
        functionName: 'selfPermit',
        args: [
          paymentTokenAddress,
          permitMessage.owner,
          permitMessage.value,
          permitMessage.deadline,
          v,
          r,
          s,
        ],
      });
      const requestOrderData = encodeFunctionData({
        abi: orderProcessorAbi,
        functionName: 'createOrder',
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
            feeQuoteResponse1.order_fee_contract_object.fee_quote.orderId,
            feeQuoteResponse1.order_fee_contract_object.fee_quote.requester,
            feeQuoteResponse1.order_fee_contract_object.fee_quote.fee,
            feeQuoteResponse1.order_fee_contract_object.fee_quote.timestamp,
            feeQuoteResponse1.order_fee_contract_object.fee_quote.deadline,
          ],
          feeQuoteResponse1.order_fee_contract_object.fee_quote_signature,
        ],
      });
      const requestOrderData2 = encodeFunctionData({
        abi: orderProcessorAbi,
        functionName: 'createOrder',
        args: [
          [
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
          ],
          [
            feeQuoteResponse2.order_fee_contract_object.fee_quote.orderId,
            feeQuoteResponse2.order_fee_contract_object.fee_quote.requester,
            feeQuoteResponse2.order_fee_contract_object.fee_quote.fee,
            feeQuoteResponse2.order_fee_contract_object.fee_quote.timestamp,
            feeQuoteResponse2.order_fee_contract_object.fee_quote.deadline,
          ],
          feeQuoteResponse2.order_fee_contract_object.fee_quote_signature,
        ],
      });
      // Send multicall transaction
      const txHash = await walletClient.writeContract({
        address: orderProcessorAddress,
        abi: orderProcessorAbi,
        functionName: 'multicall',
        args: [[selfPermitData, requestOrderData, requestOrderData2]],
        account: address,
      });
      setResults((prev) => prev + `Tx sent: ${txHash}\n`);
      // Wait for receipt
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
      // Find OrderCreated event
      const orderCreatedEvent = receipt.logs
        .map((log) => {
          try {
            return decodeEventLog({
              abi: orderProcessorAbi,
              data: log.data,
              topics: log.topics,
            });
          } catch {
            return null;
          }
        })
        .find((e) => e && e.eventName === 'OrderCreated');
      let orderId = '';
      let orderAccount = '';
      if (orderCreatedEvent && orderCreatedEvent.args) {
        orderId = String(orderCreatedEvent.args[0]);
        orderAccount = String(orderCreatedEvent.args[1]);
      }
      setResults((prev) => prev + 'Order prepared successfully!\n');
      setResults((prev) => prev + `Transaction data: ${orderId}\n`);
      setResults((prev) => prev + `Tx hash: ${txHash}\n`);
      setResults((prev) => prev + `Order Account: ${orderAccount}\n`);
    } catch (error) {
      console.error('Error testing Dinari order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setResults((prev) => prev + `Error: ${errorMessage}\n`);
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
        {/* Add Privy Connect Wallet Button here */}
        <div className="mb-6 flex justify-end">
          <LoginButton />
        </div>
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
                    : 'Stock Quantity'}
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
