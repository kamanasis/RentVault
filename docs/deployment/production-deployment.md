# RentVault — Production Deployment & Network Verification

This document provides the verified deployment parameters, network configurations, and public explorer links for the production release of RentVault.

---

## 1. Live Web Application
- **Production URL**: [https://rent-vault-pi.vercel.app](https://rent-vault-pi.vercel.app)
- **Deployment Platform**: Vercel
- **Build Command**: `vite build`
- **Output Directory**: `dist`
- **Hosting Status**: Active & Serving HTTP 200

---

## 2. Stellar Testnet Soroban Smart Contract
- **Contract Name**: `rentvault_escrow`
- **Network**: Stellar Testnet (Protocol 20)
- **Soroban RPC Endpoint**: `https://soroban-testnet.stellar.org`
- **Horizon RPC Endpoint**: `https://horizon-testnet.stellar.org`
- **Passphrase**: `Test SDF Network ; September 2015`
- **Contract ID**: `CB2YAY734VGBLC4B3KGCDFSLS5JWKRCLIW4NM77VFLH32Q6JPEYLHADF`
- **Contract Explorer**: [View on Stellar Lab](https://lab.stellar.org/r/testnet/contract/CB2YAY734VGBLC4B3KGCDFSLS5JWKRCLIW4NM77VFLH32Q6JPEYLHADF)
- **Verified Interaction Transaction**: [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/2d6758e2adc05dff2f563c454034304873889d4781a114dc5d9fa69501b83593)

---

## 3. Environment Variables & Security Hygiene

| Variable Name | Environment | Purpose | Exposed in Bundle? |
|---|---|---|:---:|
| `VITE_STELLAR_NETWORK` | Production | Identifies network as `TESTNET` | Yes (Public) |
| `VITE_SOROBAN_CONTRACT_ID` | Production | Deployed Escrow Contract ID | Yes (Public) |
| `VITE_SOROBAN_RPC_URL` | Production | Stellar Testnet RPC URL | Yes (Public) |
| `VITE_HORIZON_URL` | Production | Horizon Testnet Server URL | Yes (Public) |
| `VITE_FIREBASE_API_KEY` | Production | Firebase Project API Key | Yes (Public Client Token) |
| `VITE_FIREBASE_PROJECT_ID` | Production | Firebase Project ID (`rentvault-e2f94`) | Yes (Public) |

> [!IMPORTANT]
> Zero private keys (`S...`), seed phrases, or administrator secrets are contained in any environment file, repository commit, or production bundle.
