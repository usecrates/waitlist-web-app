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
import { createWalletClient, custom } from 'viem';
import { resolveViemChain, sendOrderForViem } from '@/utils/dinari-client';

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

      // Initialize Dinari client
      const client = new Dinari({
        apiKeyID: process.env.NEXT_PUBLIC_DINARI_API_KEY_ID,
        apiSecretKey: process.env.NEXT_PUBLIC_DINARI_API_SECRET_KEY,
        environment: 'sandbox',
      });

      setResults('Step 1: Preparing order...\n');

      const preparedOrders: any[] = [];
      const preparedOrder1 = await client.v2.accounts.orders.stocks.eip155.prepareOrder(formData.accountId, {
        chain_id: formData.chainId,
        order_side: 'BUY',
        order_tif: 'DAY',
        order_type: 'MARKET',
        stock_id: formData.stockId,
        payment_token: formData.paymentToken,
        payment_token_quantity: 10,
      });
      const preparedOrder2 = await client.v2.accounts.orders.stocks.eip155.prepareOrder(formData.accountId, {
        chain_id: formData.chainId,
        order_side: 'BUY',
        order_tif: 'DAY',
        order_type: 'MARKET',
        stock_id: formData.stockId,
        payment_token: formData.paymentToken,
        payment_token_quantity: 10,
      });

      preparedOrders.push(preparedOrder1);
      preparedOrders.push(preparedOrder2);

      console.log(preparedOrders,"orderrss");

      // setResults(prev => prev + 'Order prepared successfully!\n');
      // setResults(prev => prev + `Transaction data: ${JSON.stringify(preparedOrder, null, 2)}\n\n`);

      // setResults(prev => prev + 'Step 2: Setting up wallet client...\n');

      // // Step 2: Sign and send the transaction data using viem
      // const walletClient = createWalletClient({
      //   transport: custom((window as any).ethereum),
      // });

      // setResults(prev => prev + 'Requesting user signature...\n');

      // const { txHashes } = await sendOrderForViem(
      //   walletClient,
      //   formData.chainId,
      //   preparedOrder
      // );

      // setResults(prev => prev + 'Transactions completed successfully!\n');
      // setResults(prev => prev + `Transaction hashes: ${JSON.stringify(txHashes, null, 2)}\n`);

      // toast({
      //   title: 'Success!',
      //   description: 'Dinari order executed successfully',
      // });

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
