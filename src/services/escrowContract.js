import * as StellarSdk from '@stellar/stellar-sdk';

// Configurable Soroban Contract ID from environment variable
export const SOROBAN_CONTRACT_ID = import.meta.env.VITE_SOROBAN_CONTRACT_ID || 'CB2YAY734VGBLC4B3GKCDFSLS5JWKRCLIW4NM77VFLH32Q6JPEYLHADF';

// Stellar Testnet RPC & Horizon Endpoints
export const HORIZON_URL = import.meta.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org';
export const SOROBAN_RPC_URL = import.meta.env.VITE_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';
export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

export const horizonServer = new StellarSdk.Horizon.Server(HORIZON_URL);
export const sorobanServer = new StellarSdk.rpc.Server(SOROBAN_RPC_URL);

/**
 * Encodes agreement escrow parameters for Soroban smart contract invocation
 * Rust signature: lock_deposit(env, agreement_id: String, tenant: Address, landlord: Address, amount: i128)
 */
export const encodeLockDepositParams = ({ agreementId, tenantAddress, landlordAddress, totalAmount }) => {
  return {
    contractId: SOROBAN_CONTRACT_ID,
    functionName: 'lock_deposit',
    args: [
      StellarSdk.nativeToScVal(agreementId, { type: 'string' }),
      StellarSdk.nativeToScVal(tenantAddress, { type: 'address' }),
      StellarSdk.nativeToScVal(landlordAddress, { type: 'address' }),
      StellarSdk.nativeToScVal(Math.round(totalAmount * 10_000_000), { type: 'i128' }),
    ],
  };
};

/**
 * Encodes release parameters for Soroban contract release invocation
 * Rust signature: release_deposit(env, agreement_id: String, releaser: Address)
 */
export const encodeReleaseDepositParams = ({ agreementId, releaserAddress }) => {
  return {
    contractId: SOROBAN_CONTRACT_ID,
    functionName: 'release_deposit',
    args: [
      StellarSdk.nativeToScVal(agreementId, { type: 'string' }),
      StellarSdk.nativeToScVal(releaserAddress, { type: 'address' }),
    ],
  };
};
