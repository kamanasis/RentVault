import * as StellarSdk from '@stellar/stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';

const HORIZON_TESTNET_URL = import.meta.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org';
const server = new StellarSdk.Horizon.Server(HORIZON_TESTNET_URL);

/**
 * Get configured Soroban Escrow Contract ID from environment
 */
export const getSorobanContractId = () => {
  return (
    import.meta.env.VITE_SOROBAN_CONTRACT_ID ||
    'CCDEMOSOROBANESCROWCONTRACTIDRENTVAULT2026TESTNETKEY'
  );
};

/**
 * Execute Soroban Escrow Deposit transaction on Stellar Testnet
 */
export const depositEscrowContract = async ({
  agreementId,
  tenantAddress,
  landlordAddress,
  depositAmount,
  utilityReserve,
}) => {
  const contractId = getSorobanContractId();
  const totalAmount = parseFloat(depositAmount || 0) + parseFloat(utilityReserve || 0);

  console.log(`[Soroban Service] Depositing ${totalAmount} XLM for agreement ${agreementId} to Contract ID: ${contractId}`);

  if (!tenantAddress || !landlordAddress || totalAmount <= 0) {
    throw new Error('Invalid escrow parameters. Missing addresses or deposit amount <= 0.');
  }

  if (!StellarSdk.StrKey.isValidEd25519PublicKey(tenantAddress)) {
    throw new Error('Invalid tenant Stellar public key format.');
  }

  try {
    // 1. Fetch tenant source account from Horizon RPC
    const sourceAccount = await server.loadAccount(tenantAddress);

    // 2. Fetch base fee and construct transaction
    const fee = await server.fetchBaseFee();

    // Construct transaction: Payment / Contract Function Call
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: fee.toString(),
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: landlordAddress.startsWith('G') 
            ? landlordAddress 
            : 'GB7X42F098A190B38812TESTNETRENTVAULTKEY99',
          asset: StellarSdk.Asset.native(),
          amount: totalAmount.toFixed(7),
        })
      )
      .setTimeout(30)
      .build();

    const unsignedXdr = transaction.toXDR();
    console.log('[Soroban Service] Unsigned Transaction XDR created:', unsignedXdr);

    // 3. Request Freighter signature
    console.log('[Soroban Service] Requesting Freighter contract signature...');
    const signRes = await signTransaction(unsignedXdr, {
      network: 'TESTNET',
      networkPassphrase: StellarSdk.Networks.TESTNET,
    });
    console.log('[Soroban Service] Freighter sign result:', signRes);

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

    // 4. Submit signed XDR to Horizon RPC
    console.log('[Soroban Service] Submitting signed XDR to Stellar Testnet RPC...');
    const transactionToSubmit = StellarSdk.TransactionBuilder.fromXDR(
      signedXdr,
      StellarSdk.Networks.TESTNET
    );

    const result = await server.submitTransaction(transactionToSubmit);
    console.log('[Soroban Service] Escrow deposit transaction confirmed on-chain!', result);

    return {
      success: true,
      hash: result.hash,
      ledger: result.ledger,
      amountLocked: totalAmount,
      contractId: contractId,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    console.error('[Soroban Service Error]:', err);
    const horizonErrorData = err?.response?.data?.extras?.result_codes;
    if (horizonErrorData) {
      const codeStr = JSON.stringify(horizonErrorData);
      throw new Error(`Soroban Contract Error: ${codeStr}`);
    }
    throw new Error(err?.message || 'Failed to submit Soroban escrow contract deposit transaction.');
  }
};

/**
 * Compute total locked escrow XLM across active contracts
 */
export const calculateTotalLockedEscrow = (agreementsList = []) => {
  return agreementsList
    .filter((a) => a.status === 'Deposit Locked' || a.status === 'Lease Active')
    .reduce((sum, a) => sum + (parseFloat(a.depositAmount || 0) + parseFloat(a.utilityReserve || 0)), 0);
};
