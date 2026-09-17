# RentVault — Official Video Walkthrough & Demo Script

This document provides the structured 20-step demonstration script for recording the Level 4 video walkthrough of **RentVault**.

---

## Demo Overview
- **Application URL**: [https://rent-vault-pi.vercel.app](https://rent-vault-pi.vercel.app)
- **Target Network**: Stellar Testnet (Protocol 20)
- **Soroban Escrow Contract ID**: `CB2YAY734VGBLC4B3KGCDFSLS5JWKRCLIW4NM77VFLH32Q6JPEYLHADF`
- **Target Video Duration**: 3–5 Minutes

---

## Step-by-Step Script

### Phase 1: Introduction & Landing Page (0:00 – 0:45)
1. **Screen**: Open [https://rent-vault-pi.vercel.app](https://rent-vault-pi.vercel.app).
2. **Audio/Action**:
   - Introduce RentVault: *"RentVault is a decentralized rental security deposit escrow platform built on Stellar Testnet using Soroban WASM smart contracts."*
   - Scroll through the Landing Page: Highlight the 3-5 second finality, micro-cent fees, WASM sandboxed security, and zero-intermediary escrow guarantee.
   - Point out the trust metrics ribbon, interactive feature cards, and "Stellar Midnight" design theme.

---

### Phase 2: Wallet Connection & Account Setup (0:45 – 1:15)
3. **Screen**: Top Navigation Bar.
4. **Action**: Click **Connect Wallet**.
   - Show the Freighter extension authorization popup.
   - Note the Testnet network indicator badge.
   - If balance is low, demonstrate the 1-click **Get Free Testnet XLM** button invoking Stellar Friendbot (+10,000 XLM).
5. **Action**: Click the **Telemetry** button in the header to demonstrate real-time Horizon RPC health, Soroban contract ping, and ledger consensus.
6. **Action**: Click the **10+ Users** button in the header to show the Onboarded Users & Cryptographic Interaction Registry on Stellar Expert.

---

### Phase 3: Landlord Workflow — Agreement Creation (1:15 – 2:00)
7. **Screen**: Dashboard → Click **Create First Agreement Now** (or select "I am a Landlord" on the onboarding card).
8. **Action**: Fill out rental agreement fields:
   - Property Name: `Sunset Heights Apt 4B`
   - Address: `742 Evergreen Terrace, Springfield`
   - Monthly Rent: `1,500 XLM`
   - Security Deposit: `3,000 XLM`
   - Utility Reserve: `500 XLM`
   - Tenant Wallet: Enter a secondary Stellar Testnet public key (`G...`)
   - Lease Duration: Select start and end dates (e.g. 1 year).
9. **Action**: Click **Create & Save Agreement**.
   - Explain real-time synchronization: The agreement is instantly persisted to Firestore with an 8-stage state machine initialized at `Draft / Created`.
   - Copy the generated Agreement ID (e.g., `AGR-1234`).

---

### Phase 4: Tenant Workflow — Joining & Escrow Deposit (2:00 – 3:00)
10. **Screen**: Switch browser window or switch Freighter account to the **Tenant Wallet**.
11. **Action**: On the Dashboard, select **I am a Tenant**, paste the Agreement ID into the lookup field, and click **Lookup Agreement**.
12. **Action**: Review agreement terms, deposit amount, and landlord identity.
13. **Action**: Click **Deposit & Lock Escrow**.
    - Point out the Soroban Contract ID: `CB2YAY734VGBLC4B3KGCDFSLS5JWKRCLIW4NM77VFLH32Q6JPEYLHADF`.
    - Click **Authorize Deposit via Freighter**.
    - Sign the transaction in Freighter.
    - Show the transaction progress indicator (Simulation → Authorization → Consensus → Confirmation).
14. **Action**: Once confirmed, click the **Stellar Expert Explorer** link to show the real on-chain transaction hash and emitted topic event (`"escrow"`, `"locked"`).
15. **Screen**: Return to the application to show that the agreement status transitioned to `Deposit Locked / Active`.

---

### Phase 5: Lease Lifecycle, Utility Settlement & Refund (3:00 – 4:00)
16. **Screen**: Switch back to Landlord window.
17. **Action**: Navigate to the agreement's **Settlement Portal**:
    - Add an itemized utility deduction: `Electricity & Water: 150 XLM`.
    - Show dynamic financial math: Total Escrow (3,500 XLM) - Deductions (150 XLM) = Net Tenant Refund (3,350 XLM).
    - Submit the settlement terms.
18. **Action**: Switch to Tenant view:
    - Tenant reviews the deduction breakdown.
    - Demonstrate the dual choice: **Approve Settlement** or **Lodge Dispute**.
    - Click **Approve Settlement**.
19. **Action**: Demonstrate the Soroban release invocation:
    - Escrow transfers the refund directly to the Tenant's wallet and deductions to the Landlord.
    - Status transitions to `Completed / Refunded`.
    - Generate and view the immutable cryptographic receipt.

---

### Phase 6: User Feedback & Conclusion (4:00 – 4:30)
20. **Action**: Click **Reviews** in the header navigation:
    - Click **Leave Feedback**.
    - Submit a rating (5 stars), ease-of-use (5/5), role (Tenant), and brief review.
    - Open the **Sentiment Report** to demonstrate that the review is immediately recorded, aggregated into the CSAT score, and tracked in the public registry.
    - Conclude: *"RentVault delivers a production-hardened, non-custodial rental deposit escrow on Stellar, eliminating deposit theft and delivering instant cryptographic settlement."*
