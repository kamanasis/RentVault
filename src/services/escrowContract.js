import * as StellarSdk from '@stellar/stellar-sdk';

// ─── Deployed RentVault Escrow Contract (Stellar Testnet) ───────────────────
// WASM hash: 9686e4cdc80ce1dd90ee29e86a3d743387e4c5693c33a4d16c5ac40bf50e11c6
// This value is cryptographically verified (StrKey isValidContract = true).
// DO NOT substitute this with a different contract ID without redeploying.
const DEPLOYED_CONTRACT_ID = 'CB2YAY734VGBLC4B3KGCDFSLS5JWKRCLIW4NM77VFLH32Q6JPEYLHADF';

// Allow override via env var only if the override is itself a valid contract ID.
// This prevents a misconfigured Vercel env var (e.g. typo '3GK' vs '3KG')
// from silently injecting a bad contract ID at runtime.
function resolveContractId() {
  const envId = import.meta.env.VITE_SOROBAN_CONTRACT_ID;
  if (envId && envId.trim() !== '') {
    if (!StellarSdk.StrKey.isValidContract(envId.trim())) {
      console.error(
        `[RentVault] VITE_SOROBAN_CONTRACT_ID="${envId}" failed StrKey validation. ` +
        `Falling back to the hardcoded deployed contract ID.`
      );
      return DEPLOYED_CONTRACT_ID;
    }
    return envId.trim();
  }
  return DEPLOYED_CONTRACT_ID;
}

export const SOROBAN_CONTRACT_ID = resolveContractId();

// ─── Stellar Testnet RPC & Horizon Endpoints ─────────────────────────────────
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
    contract: SOROBAN_CONTRACT_ID,
    function: 'lock_deposit',
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
    contract: SOROBAN_CONTRACT_ID,
    function: 'release_deposit',
    args: [
      StellarSdk.nativeToScVal(agreementId, { type: 'string' }),
      StellarSdk.nativeToScVal(releaserAddress, { type: 'address' }),
    ],
  };
};
