# RentVault — Technical System Architecture

This document describes the architectural layers, cryptographic security models, and data synchronization patterns implemented across RentVault.

---

## 1. High-Level Architecture Overview

RentVault combines an on-chain smart contract layer for financial escrow custody with an off-chain cloud layer for high-speed agreement metadata indexing:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER                            │
│           React 18 + Vite 5 + Tailwind CSS (Stellar Midnight)          │
│       Freighter Wallet Integration + Stellar SDK + Soroban RPC         │
└──────────────────────────┬─────────────────────────────────┬───────────┘
                           │                                 │
                 Soroban RPC / Horizon               Firestore onSnapshot
                           │                                 │
                           ▼                                 ▼
┌──────────────────────────────────────┐   ┌─────────────────────────────┐
│          STELLAR TESTNET             │   │    FIREBASE FIRESTORE       │
│  - SCP Consensus (3-5s Finality)     │   │  - Real-Time Subscriptions  │
│  - Protocol 20 WASM Engine           │   │  - Agreement State Machine  │
│  - Soroban Escrow Contract           │   │  - Telemetry & Analytics    │
│  - Stellar Asset Contract (SAC)      │   │  - Sanitized Feedback Store │
└──────────────────────────────────────┘   └─────────────────────────────┘
```

---

## 2. Soroban Smart Contract Architecture (`contracts/escrow`)

The smart contract is written in Rust targeting `wasm32-unknown-unknown` and executed within the sandboxed Soroban virtual machine.

### Data Storage Model
State is stored in persistent contract storage using the `DataKey` enumeration:
```rust
pub enum DataKey {
    Agreement(Symbol), // Keyed by agreement_id symbol
}

pub struct EscrowRecord {
    pub agreement_id: Symbol,
    pub tenant: Address,
    pub landlord: Address,
    pub token: Address,
    pub amount: i128,
    pub state: EscrowState, // Locked, Released, Disputed
}
```

### Inter-Contract Communication (SAC Invocation)
The escrow contract uses the **Stellar Asset Contract (SAC)** client for native XLM token transfers:
1. **Locking**:
   ```rust
   tenant.require_auth();
   let client = token::Client::new(&env, &token);
   client.transfer(&tenant, &contract_address, &amount);
   ```
2. **Releasing**:
   ```rust
   landlord.require_auth();
   let client = token::Client::new(&env, &token);
   client.transfer(&contract_address, &to_address, &amount);
   ```

### Security & Invariants
- **Reentrancy Protection**: WASM execution engine isolates contract state deterministically; duplicate releases on the same agreement ID panic with `AlreadyReleased`.
- **Zero/Negative Checks**: Any deposit amount `<= 0` immediately panics before token transfer.
- **Authorization Enforcement**: `require_auth()` guarantees that only the authentic signing key can execute transfers.

---

## 3. Real-Time Synchronization Engine (`src/services/sharedStore.js`)

RentVault utilizes Firebase Firestore `onSnapshot` listeners to synchronize agreement state between disparate browsers without polling or manual page refreshing:
- **Agreement Updates**: When a tenant deposits funds, the on-chain transaction hash and new lifecycle stage (`Deposit Locked`) are synced to Firestore. The landlord's browser receives the update in real-time.
- **Settlement & Dispute**: When a landlord submits utility deductions or a tenant lodges a dispute, the respective counterparty's UI reflects the change instantaneously.

---

## 4. Privacy & Anti-Hallucination Guardrails
- **Credential Scrubbing**: `analytics.js` and `feedbackStore.js` run regex filters to scrub all 56-character Stellar secret keys (`S...`), seed phrases, and passwords before network transmission.
- **Zero Fake Data**: The application displays 0 when no data is present rather than generating mock metrics or fake transactions.
