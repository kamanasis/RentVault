import * as StellarSdk from '@stellar/stellar-sdk';
import { isConnected, getPublicKey, signTransaction } from '@stellar/freighter-api';

// Configurable Soroban Contract ID from environment variable
export const SOROBAN_CONTRACT_ID = import.meta.env.VITE_SOROBAN_CONTRACT_ID || 'CCW67352W722TESTNETSOROBANESCROWCONTRACTKEY99';

// Stellar Testnet RPC & Horizon Endpoints
export const HORIZON_URL = 'https://horizon-testnet.stellar.org';
export const SOROBAN_RPC_URL = 'https://soroban-testnet.stellar.org';
export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

export const horizonServer = new StellarSdk.Horizon.Server(HORIZON_URL);

/**
 * Encodes agreement escrow parameters for Soroban smart contract invocation
 */
export const encodeLockDepositParams = ({ agreementId, landlordAddress, tenantAddress, depositAmount, utilityReserve }) => {
  return {
    contractId: SOROBAN_CONTRACT_ID,
    functionName: 'lock_deposit',
    args: [
      StellarSdk.nativeToScVal(agreementId, { type: 'string' }),
      StellarSdk.nativeToScVal(landlordAddress, { type: 'address' }),
      StellarSdk.nativeToScVal(tenantAddress, { type: 'address' }),
      StellarSdk.nativeToScVal(Math.round(depositAmount * 10_000_000), { type: 'i128' }),
      StellarSdk.nativeToScVal(Math.round(utilityReserve * 10_000_000), { type: 'i128' }),
    ],
  };
};

/**
 * Encodes release parameters for Soroban contract release invocation
 */
export const encodeReleaseDepositParams = ({ agreementId, utilityDeduction }) => {
  return {
    contractId: SOROBAN_CONTRACT_ID,
    functionName: 'release_deposit',
    args: [
      StellarSdk.nativeToScVal(agreementId, { type: 'string' }),
      StellarSdk.nativeToScVal(Math.round(utilityDeduction * 10_000_000), { type: 'i128' }),
    ],
  };
};
