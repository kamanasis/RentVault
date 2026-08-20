import * as StellarSdk from '@stellar/stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';
import { 
  SOROBAN_CONTRACT_ID, 
  NETWORK_PASSPHRASE, 
  sorobanServer, 
  horizonServer,
  encodeLockDepositParams,
  encodeReleaseDepositParams 
} from './escrowContract';

export const getSorobanContractId = () => {
  return SOROBAN_CONTRACT_ID;
};

async function pollTransactionStatus(hash) {
  let statusResponse;
  let attempts = 0;
  while (attempts < 20) {
    statusResponse = await sorobanServer.getTransaction(hash);
    if (statusResponse.status !== 'NOT_FOUND') {
      return statusResponse;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    attempts++;
  }
  throw new Error('Transaction confirmation timeout.');
}

/**
 * Execute Soroban Escrow Deposit lock transaction on Stellar Testnet
 */
export const depositEscrowContract = async (
  { agreementId, tenantAddress, landlordAddress, depositAmount, utilityReserve },
  onProgress
) => {
  const totalAmount = parseFloat(depositAmount || 0) + parseFloat(utilityReserve || 0);
  console.log(`[Soroban Service] Depositing ${totalAmount} XLM for agreement ${agreementId} to Contract ID: ${SOROBAN_CONTRACT_ID}`);

  if (!tenantAddress || !landlordAddress || totalAmount <= 0) {
    throw new Error('Invalid escrow parameters.');
  }

  try {
    // Stage 1: Preparing transaction & Simulation
    if (onProgress) onProgress('preparing');

    const sourceAccount = await horizonServer.loadAccount(tenantAddress);
    
    const invokeParams = encodeLockDepositParams({
      agreementId,
      tenantAddress,
      landlordAddress,
      totalAmount,
    });

    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: '1000', // Base fee before simulation
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(StellarSdk.Operation.invokeContractFunction(invokeParams))
      .setTimeout(30)
      .build();

    const simResult = await sorobanServer.simulateTransaction(transaction);
    if (StellarSdk.rpc.Api.isSimulationError(simResult)) {
        throw new Error(`Simulation failed: ${simResult.error}`);
    }

    const assembledTx = StellarSdk.rpc.assembleTransaction(transaction, simResult).build();
    const unsignedXdr = assembledTx.toXDR();

    // Stage 2: Awaiting Freighter Signature
    if (onProgress) onProgress('signing');
    
    const signRes = await signTransaction(unsignedXdr, {
      network: 'TESTNET',
      networkPassphrase: NETWORK_PASSPHRASE,
    });

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

    // Stage 3: Submitting to Soroban
    if (onProgress) onProgress('submitting');
    
    const transactionToSubmit = StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
    const submitResult = await sorobanServer.sendTransaction(transactionToSubmit);

    if (submitResult.status === 'ERROR') {
      throw new Error(`Transaction submission failed`);
    }

    // Stage 4: Confirming On-Chain
    if (onProgress) onProgress('confirming');
    
    const statusResponse = await pollTransactionStatus(submitResult.hash);

    if (statusResponse.status === 'SUCCESS') {
      if (onProgress) onProgress('success');
      return {
        success: true,
        hash: submitResult.hash,
        ledger: statusResponse.latestLedger,
        amountLocked: totalAmount,
        contractId: SOROBAN_CONTRACT_ID,
        timestamp: new Date().toISOString(),
      };
    } else {
      throw new Error(`Transaction failed on-chain: ${JSON.stringify(statusResponse.resultMetaXdr)}`);
    }
  } catch (err) {
    console.error('[Soroban Lock Error]', err);
    if (onProgress) onProgress('failed');
    throw new Error(err?.message || 'Failed to execute deposit transaction.');
  }
};

/**
 * Execute Soroban Escrow Release / Refund transaction on Stellar Testnet
 */
export const releaseEscrowContract = async (
  { agreementId, tenantAddress, landlordAddress, refundAmount },
  onProgress
) => {
  const amountToRefund = parseFloat(refundAmount || 0);
  console.log(`[Soroban Service] Releasing ${amountToRefund} XLM for agreement ${agreementId}`);

  try {
    if (onProgress) onProgress('preparing');

    // Releaser is assumed to be the landlord based on RentVault logic
    const sourceAccount = await horizonServer.loadAccount(landlordAddress);
    
    const invokeParams = encodeReleaseDepositParams({
      agreementId,
      releaserAddress: landlordAddress,
    });

    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: '1000',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(StellarSdk.Operation.invokeContractFunction(invokeParams))
      .setTimeout(30)
      .build();

    const simResult = await sorobanServer.simulateTransaction(transaction);
    if (StellarSdk.rpc.Api.isSimulationError(simResult)) {
        throw new Error(`Simulation failed: ${simResult.error}`);
    }

    const assembledTx = StellarSdk.rpc.assembleTransaction(transaction, simResult).build();
    const unsignedXdr = assembledTx.toXDR();

    if (onProgress) onProgress('signing');
    const signRes = await signTransaction(unsignedXdr, {
      network: 'TESTNET',
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    let signedXdr = '';
    if (typeof signRes === 'string') {
      signedXdr = signRes;
    } else if (signRes && signRes.error) {
      throw new Error(`Freighter signing rejected: ${signRes.error}`);
    } else {
      signedXdr = signRes.signedTxXdr || signRes.signedTransaction || signRes.xdr;
    }

    if (!signedXdr || signedXdr.trim() === '') {
      throw new Error('Transaction signing was cancelled by user.');
    }

    if (onProgress) onProgress('submitting');
    
    const transactionToSubmit = StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
    const submitResult = await sorobanServer.sendTransaction(transactionToSubmit);

    if (submitResult.status === 'ERROR') {
      throw new Error(`Transaction submission failed`);
    }

    if (onProgress) onProgress('confirming');
    
    const statusResponse = await pollTransactionStatus(submitResult.hash);

    if (statusResponse.status === 'SUCCESS') {
      if (onProgress) onProgress('success');
      return {
        success: true,
        hash: submitResult.hash,
        ledger: statusResponse.latestLedger,
        refundAmount: amountToRefund,
        contractId: SOROBAN_CONTRACT_ID,
        timestamp: new Date().toISOString(),
      };
    } else {
      throw new Error(`Release transaction failed on-chain`);
    }
  } catch (err) {
    console.error('[Soroban Release Error]:', err);
    if (onProgress) onProgress('failed');
    throw new Error(err?.message || 'Failed to submit Soroban release transaction.');
  }
};

export const calculateTotalLockedEscrow = (agreementsList = []) => {
  return agreementsList
    .filter(
      (a) =>
        a.status === 'Deposit Locked' ||
        a.status === 'Lease Active' ||
        a.status === 'Lease Ended' ||
        a.status === 'Utility Settlement' ||
        a.status === 'Approval Pending'
    )
    .reduce((sum, a) => sum + (parseFloat(a.depositAmount || 0) + parseFloat(a.utilityReserve || 0)), 0);
};
