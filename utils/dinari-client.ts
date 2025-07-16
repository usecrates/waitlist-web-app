import { Eip155PrepareProxiedOrderResponse } from '@dinari/api-sdk/resources/v2/accounts/order-requests/stocks/eip155';
import { Eip155PrepareOrderResponse } from '@dinari/api-sdk/resources/v2/accounts/orders/stocks/eip155';
import { createPublicClient, http, WalletClient, PublicClient, TypedData, Address, Account } from 'viem';
import * as allChains from 'viem/chains';

/**
 * Resolves a CAIP-2 formatted chain ID (e.g., "eip155:421614") or a plain numeric string (e.g., "1")
 * to the corresponding viem chain object.
 */
export function resolveViemChain(chain_id: string): allChains.Chain {
  // eg. Accepts "eip155:421614" or just "421614"
  const match = chain_id.match(/^eip155:(\d+)$/);
  const numericChainId = match ? Number(match[1]) : Number(chain_id);

  const chain = Object.values(allChains).find((c: allChains.Chain) => c.id === numericChainId);
  if (!chain) {
    throw new Error(`Chain with id ${numericChainId} not found in viem/chains`);
  }
  return chain;
}

/**
 * Sends all transactions in the given orderResponse sequentially using the provided viem WalletClient.
 * Waits for each transaction to be mined before sending the next.
 * Can be used in both frontend and backend environments.
 *
 * Backend requires that account is passed in
 */
export async function sendOrderForViem(
  walletClient: WalletClient,
  chain_id: string,
  orderResponse: Eip155PrepareOrderResponse,
  account?: Account,
  publicClient?: PublicClient,
): Promise<{
  txHashes: `0x${string}`[];
}> {
  const chain = resolveViemChain(chain_id);

  let resolvedPublicClient = publicClient;
  if (!resolvedPublicClient) {
    resolvedPublicClient = createPublicClient({ transport: http(), chain });
  }

  const txDatas = orderResponse.transaction_data;
  if (!Array.isArray(txDatas) || txDatas.length === 0) {
    throw new Error('transaction_data is missing or empty');
  }

  let resolvedAccount: Address | Account;
  if (account) {
    resolvedAccount = account;
  } else {
    [resolvedAccount] = await walletClient.requestAddresses();
  }

  const txHashes: `0x${string}`[] = [];
  for (const txData of txDatas) {
    if (!txData || !txData.contract_address || !txData.data) {
      throw new Error('transaction_data item is missing required fields');
    }

    // 1. Sign and send transaction
    const txHash = await walletClient.sendTransaction({
      to: txData.contract_address as `0x${string}`,
      data: txData.data as `0x${string}`,
      account: resolvedAccount,
      chain,
    });

    // 2. Wait for the transaction to be mined before proceeding to the next
    await resolvedPublicClient.waitForTransactionReceipt({ hash: txHash });
    txHashes.push(txHash);
  }

  return { txHashes };
}

/**
 * Prompts the user or backend signer to sign the permit and order typed data using the provided viem WalletClient.
 * Returns the signatures for both permit and order.
 *
 * Backend requires that account is passed in
 */
export async function signTransferPermitAndOrderForViem(
  walletClient: WalletClient,
  orderResponse: Eip155PrepareProxiedOrderResponse,
  account?: Account,
): Promise<{
  permitSignature: `0x${string}`;
  orderSignature: `0x${string}`;
}> {
  const { permit_typed_data, order_typed_data } = orderResponse;

  if (!permit_typed_data.domain || !permit_typed_data.types || !permit_typed_data.message) {
    throw new Error('permit_typed_data is missing required fields');
  }
  if (!order_typed_data.domain || !order_typed_data.types || !order_typed_data.message) {
    throw new Error('order_typed_data is missing required fields');
  }

  let resolvedAccount: Address | Account;
  if (account) {
    resolvedAccount = account;
  } else {
    [resolvedAccount] = await walletClient.requestAddresses();
  }

  const permitSignature = await walletClient.signTypedData({
    domain: permit_typed_data.domain,
    types: permit_typed_data.types as TypedData,
    primaryType: permit_typed_data.primaryType,
    message: permit_typed_data.message as Record<string, unknown>,
    account: resolvedAccount,
  });

  const orderSignature = await walletClient.signTypedData({
    domain: order_typed_data.domain,
    types: order_typed_data.types as TypedData,
    primaryType: order_typed_data.primaryType,
    message: order_typed_data.message as Record<string, unknown>,
    account: resolvedAccount,
  });

  return {
    permitSignature,
    orderSignature,
  };
}