import * as StellarSdk from '@stellar/stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';

const HORIZON_TESTNET_URL = 'https://horizon-testnet.stellar.org';
const server = new StellarSdk.Horizon.Server(HORIZON_TESTNET_URL);

/**
 * Fetch native XLM balance from Horizon Testnet
 */
export const fetchAccountBalance = async (publicKey) => {
  console.log(`[Stellar Horizon] Fetching account balance for: ${publicKey}`);
  if (!publicKey || publicKey.trim() === '') {
    return { balance: '0.00', raw: 0, isUnfunded: true };
  }

  try {
    const account = await server.loadAccount(publicKey);
    console.log('[Stellar Horizon] Account loaded successfully:', account);

    const nativeBalance = account.balances.find((b) => b.asset_type === 'native');
    const balanceVal = nativeBalance ? parseFloat(nativeBalance.balance) : 0;
    const formattedBalance = balanceVal.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return {
      balance: formattedBalance,
      raw: balanceVal,
      isUnfunded: false,
      sequence: account.sequence,
    };
  } catch (err) {
    console.warn('[Stellar Horizon] Load account error:', err);
    // Check if 404 / Account Not Found on Testnet
    const is404 = err?.response?.status === 404 || err?.status === 404;
    if (is404) {
      console.log('[Stellar Horizon] Account not yet created/funded on Testnet.');
      return { balance: '0.00', raw: 0, isUnfunded: true };
    }
    throw new Error(err?.message || 'Failed to fetch account balance from Horizon Testnet RPC.');
  }
};

/**
 * Fetch recent payments & transactions for an account from Horizon Testnet
 */
export const fetchAccountTransactions = async (publicKey, limit = 10) => {
  console.log(`[Stellar Horizon] Fetching payments for account: ${publicKey} (limit: ${limit})`);
  if (!publicKey || publicKey.trim() === '') {
    return [];
  }

  try {
    const paymentsCall = await server.payments().forAccount(publicKey).order('desc').limit(limit).call();
    console.log('[Stellar Horizon] Payments response:', paymentsCall);

    const records = paymentsCall.records || [];
    const formattedTxs = records.map((record) => {
      const isSent = record.from === publicKey;
      const isPayment = record.type === 'payment' || record.type === 'create_account';
      
      let amount = '0.00';
      if (record.type === 'payment') {
        amount = parseFloat(record.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      } else if (record.type === 'create_account') {
        amount = parseFloat(record.starting_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      return {
        id: record.id,
        hash: record.transaction_hash,
        direction: isSent ? 'sent' : 'received',
        type: record.type,
        amount: amount,
        asset: record.asset_type === 'native' || !record.asset_type ? 'XLM' : record.asset_code,
        counterparty: isSent ? record.to : record.from,
        sender: record.from || 'N/A',
        recipient: record.to || record.account || 'N/A',
        timestamp: record.created_at,
        status: 'confirmed',
        fee: record.fee_charged || '100 stroops',
        ledger: record.transaction_successful ? 'Confirmed' : 'Failed',
      };
    });

    return formattedTxs;
  } catch (err) {
    console.warn('[Stellar Horizon] Fetch transactions warning:', err);
    // If account not found 404, return empty list
    return [];
  }
};

/**
 * Fund testnet account using Stellar Friendbot
 */
export const fundAccountWithFriendbot = async (publicKey) => {
  console.log(`[Stellar Friendbot] Funding testnet account: ${publicKey}`);
  try {
    const response = await fetch(`https://friendbot.stellar.org/?addr=${encodeURIComponent(publicKey)}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.detail || 'Friendbot funding request failed.');
    }
    console.log('[Stellar Friendbot] Account funded successfully:', data);
    return { success: true, data };
  } catch (err) {
    console.error('[Stellar Friendbot Error]:', err);
    throw new Error(err?.message || 'Failed to fund account via Stellar Friendbot.');
  }
};

/**
 * Send native XLM payment on Stellar Testnet signed via Freighter Wallet
 */
export const sendTestPayment = async ({ sourceAddress, recipientAddress, amount }) => {
  console.log(`[Stellar Payment] Initiating testnet payment of ${amount} XLM from ${sourceAddress} to ${recipientAddress}`);

  if (!sourceAddress || !recipientAddress || !amount) {
    throw new Error('Missing required transaction parameters.');
  }

  if (!StellarSdk.StrKey.isValidEd25519PublicKey(recipientAddress)) {
    throw new Error('Invalid recipient Stellar public key format (must start with G and be 56 characters long).');
  }

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    throw new Error('Payment amount must be greater than 0 XLM.');
  }

  try {
    const sourceAccount = await server.loadAccount(sourceAddress);

    const fee = await server.fetchBaseFee();
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: fee.toString(),
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: recipientAddress,
          asset: StellarSdk.Asset.native(),
          amount: numericAmount.toFixed(7),
        })
      )
      .setTimeout(30)
      .build();

    const unsignedXdr = transaction.toXDR();
    console.log('[Stellar Payment] Unsigned Transaction XDR created:', unsignedXdr);

    const signRes = await signTransaction(unsignedXdr, {
      network: 'TESTNET',
      networkPassphrase: StellarSdk.Networks.TESTNET,
    });
    console.log('[Stellar Payment] Freighter sign result:', signRes);

    let signedXdr = '';
    if (typeof signRes === 'string') {
      signedXdr = signRes;
    } else if (signRes && typeof signRes === 'object') {
      if (signRes.error) {
        throw new Error(`Freighter signing rejected: ${signRes.error}`);
      }
      signedXdr = signRes.signedTxXdr || signRes.signedTransaction || signRes.xdr || '';
    }

    if (!signedXdr || signedXdr.trim() === '') {
      throw new Error('Transaction signing was cancelled by user.');
    }

    const transactionToSubmit = StellarSdk.TransactionBuilder.fromXDR(
      signedXdr,
      StellarSdk.Networks.TESTNET
    );

    const result = await server.submitTransaction(transactionToSubmit);
    console.log('[Stellar Payment] Transaction confirmed on Horizon Testnet!', result);

    return {
      success: true,
      hash: result.hash,
      ledger: result.ledger,
      successful: result.successful,
    };
  } catch (err) {
    console.error('[Stellar Payment Error]:', err);
    const horizonErrorData = err?.response?.data?.extras?.result_codes;
    if (horizonErrorData) {
      const codeStr = JSON.stringify(horizonErrorData);
      throw new Error(`Horizon Transaction Error: ${codeStr}`);
    }
    throw new Error(err?.message || 'Transaction execution failed on Stellar Testnet.');
  }
};
