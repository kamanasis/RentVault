<div align="center">

# RentVault

### Decentralized Rental Deposit Escrow Platform built on Stellar & Soroban

RentVault is a decentralized rental deposit escrow platform powered by **Stellar Testnet** and **Soroban Smart Contracts** that enables landlords and tenants to manage rental security deposits transparently on-chain.

[![Stellar Testnet](https://img.shields.io/badge/Stellar-Testnet%20Protocol%2020-blue?style=for-the-badge&logo=stellar)](https://stellar.org)
[![Soroban Smart Contracts](https://img.shields.io/badge/Soroban-WASM%20Smart%20Contracts-purple?style=for-the-badge&logo=webassembly)](https://soroban.stellar.org)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Web3](https://img.shields.io/badge/Web3-Freighter%20Wallet-emerald?style=for-the-badge)](https://www.freighter.app/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

<br />

![RentVault Banner](./screenshots/banner.png)

</div>

---

## 🚨 Problem Statement

Traditional rental deposit management is plagued by friction, mistrust, and opaque bookkeeping. Key challenges include:

- **Unjustified Deductions**: Tenants often face arbitrary security deposit withholdings at lease end.
- **Delayed Refunds**: Landlords frequently delay returning funds for weeks or months.
- **Lack of Transparency**: Neither party has a shared, immutable ledger recording deposit locking or utility bill entries.

### The Soroban Solution
**RentVault** eliminates the central intermediary by shifting rental security deposits into programmable **Soroban WASM Smart Contracts**. Deposits are locked on the Stellar Testnet, utility deductions are itemized transparently, and remaining funds are refunded automatically upon mutual approval or auto-release countdown finality.

---

## ✨ Features

| Feature | Description |
| :--- | :--- |
| **🔐 Freighter Wallet Auth** | Cryptographic wallet authentication using the Freighter browser extension. |
| **💰 Live XLM Balance** | Real-time native XLM account balance fetching and monitoring via Stellar Horizon RPC. |
| **👤 Role-Based Workspaces** | Tailored Landlord and Tenant workspaces evaluated strictly from connected public keys. |
| **📜 Rental Agreement Module** | Digital agreement creation with customizable deposit amounts, utility reserves, and lease dates. |
| **🔒 Soroban Escrow Locking** | Smart contract `lock_deposit` execution locking XLM safely on the Stellar Testnet. |
| **📅 Lease Lifecycle Tracking** | 7-stage auditable state machine (`Draft` → `Awaiting` → `Locked` → `Active` → `Ended` → `Settlement` → `Refunded`). |
| **⚡ Utility Settlement** | Landlord itemized utility bill entry with interactive tenant review breakdown. |
| **⏱️ Auto-Release Timer** | 60-second automated refund timer for swift, non-blocking tenant approvals. |
| **🔍 On-Chain Verification** | Full transaction hash, ledger sequence, block timestamp, and Stellar Expert explorer integration. |
| **🔄 Real-Time State Sync** | Zero-reload dynamic updates across landing hero, executive dashboard, and timeline components. |

---

## 📸 Screenshots

<div align="center">

### 1. Landing Page
![Landing Page](./screenshots/landing.png)

<br />

### 2. Wallet Connected & Live Balance
![Wallet Connected](./screenshots/wallet_connected.png)

<br />

### 3. Executive Role Dashboard
![Dashboard](./screenshots/dashboard.png)

<br />

### 4. Agreement Details & Context-Aware Actions
![Agreement Details](./screenshots/agreement_details.png)

<br />

### 5. Soroban Escrow Deposit Locked
![Escrow Deposit Locked](./screenshots/escrow_locked.png)

<br />

### 6. Agreement Lifecycle Timeline
![Timeline](./screenshots/timeline.png)

<br />

### 7. Utility Settlement Portal
![Settlement](./screenshots/settlement.png)

<br />

### 8. Refund Completed & Settlement Receipt
![Refund Completed](./screenshots/refund_completed.png)

</div>

---

## 🌳 Complete User Workflow (Interconnected Tree)

```text
RentVault
│
├── Landing Page
│   ├── Project Introduction
│   ├── Problem Statement
│   ├── How Blockchain Solves Rental Disputes
│   └── Connect Freighter Wallet
│
├── Wallet Authentication
│   ├── Connect Wallet
│   ├── Verify Stellar Testnet
│   ├── Authenticate User
│   └── Dashboard
│       ├── Wallet Address
│       ├── XLM Balance
│       ├── Escrow Balance
│       └── Network Status
│
├── Role Selection
│   ├── Landlord Workspace
│   └── Tenant Workspace
│
├── Rental Agreement Module
│   ├── Create Agreement
│   ├── Edit Terms
│   ├── Share Agreement
│   └── Agreement Dashboard
│       ├── Active Agreements
│       ├── Completed Agreements
│       └── Agreement Details
│
├── Soroban Escrow Contract
│   ├── Tenant Reviews Agreement
│   ├── Deposit Escrow
│   ├── Freighter Signature
│   ├── Contract Invocation
│   └── Deposit Locked
│
├── Lease Lifecycle
│   ├── Agreement Created
│   ├── Deposit Locked
│   ├── Lease Active
│   ├── Lease Ended
│   ├── Utility Settlement
│   ├── Auto-Release Countdown
│   └── Refund Completed
│
├── Settlement Module
│   ├── Enter Utility Bills
│   ├── Calculate Deduction
│   ├── Calculate Refund
│   ├── Contract Release
│   └── Settlement Receipt
│
├── Blockchain Layer
│   ├── Stellar Testnet
│   ├── Soroban Smart Contracts
│   ├── Transaction Signing
│   ├── Transaction Hash
│   ├── Ledger Confirmation
│   └── Stellar Expert Verification
│
└── Final Outcome
    ├── Refund Completed
    ├── Timeline Updated
    ├── Transaction Recorded On-Chain
    ├── Agreement Archived
    └── Ready for New Agreement
```

---

## 🔄 Demo Flow

1. **Connect Freighter Wallet**: Authenticate with Stellar Testnet public key.
2. **Create Rental Agreement**: Landlord specifies deposit XLM, utility reserve, and tenant address.
3. **Share Agreement**: Landlord provides direct agreement link to tenant.
4. **Tenant Deposits Escrow**: Tenant signs contract invocation via Freighter.
5. **Soroban Locks Funds**: Smart contract confirms `lock_deposit` on-chain (100% funded).
6. **Lease Activated**: Landlord activates lease period; occupancy begins.
7. **Utility Settlement**: Lease ends; landlord enters electricity/water deductions.
8. **Auto-Release**: Tenant reviews itemized breakdown; 60s countdown triggers.
9. **Refund Completed**: Soroban executes `release_deposit`, returning remaining XLM directly to tenant.

---

## 🏗️ Architecture Diagram

```mermaid
graph TD
    A[Landlord Wallet] -->|Freighter API| B[RentVault Frontend]
    C[Tenant Wallet] -->|Freighter API| B
    B -->|Stellar SDK| D[Stellar SDK Layer]
    D -->|Horizon RPC| E[Stellar Horizon Server]
    D -->|Soroban RPC| F[Soroban Smart Contract]
    F -->|Consensus| G[Stellar Testnet Ledger]
```

---

## 📂 Project Structure

```
RentVault/
├── vercel.json                              # Vercel SPA routing rewrite configuration
├── index.html                               # OpenGraph, Twitter tags, & SEO metadata
├── src/
│   ├── components/
│   │   ├── agreements/                      # AgreementCard, AgreementTimeline, AgreementSummary
│   │   ├── buttons/                         # PrimaryButton, SecondaryButton
│   │   ├── cards/                           # Reusable Card container & glow borders
│   │   ├── dashboard/                       # ExecutiveHeroSummary, OnboardingCard
│   │   ├── demo/                            # DemoGuideModal (Stella presentation navigator)
│   │   ├── escrow/                          # EscrowStatusCard, FundingProgress, EscrowFundingDetailsCard
│   │   ├── forms/                           # InputField, SelectField
│   │   ├── landing/                         # HeroVisual, FeatureGrid
│   │   ├── layout/                          # Navbar, Footer, PageContainer, Section
│   │   ├── lifecycle/                       # LeaseStatusCard, TenantReviewPanel, RefundConfirmationCard
│   │   ├── roles/                           # RoleBadge, AgreementRoleHeader, WalletMismatchNotice
│   │   ├── status/                          # StatusBadge, AgreementStatusBadge
│   │   ├── stellar/                         # StellarActivityRibbon, TrustBadgeGroup
│   │   ├── ui/                              # Accordion, Skeleton, CardSkeleton, EmptyState, ErrorBoundary
│   │   └── wallet/                          # TransactionProgress modal, BalanceCard, WalletCard, WalletStatus
│   ├── context/
│   │   ├── WalletContext.jsx                # Freighter wallet session & Horizon RPC balance polling
│   │   ├── AgreementContext.jsx             # Agreement state machine & localStorage persistence
│   │   └── ToastContext.jsx                 # Global toast notification stack
│   ├── pages/
│   │   ├── Landing.jsx                      # Public hero landing page
│   │   ├── Dashboard.jsx                    # Executive role-filtered dashboard
│   │   ├── AgreementDashboard.jsx           # Filtered agreement feed
│   │   ├── CreateAgreement.jsx              # Digital agreement creation form
│   │   ├── AgreementDetails.jsx             # Accordion simplified agreement view
│   │   ├── Deposit.jsx                      # Real Soroban lock_deposit execution portal
│   │   ├── Timeline.jsx                     # Dynamic 7-stage timeline page
│   │   ├── Settlement.jsx                   # Utility bill entry & refund approval portal
│   │   ├── Completion.jsx                   # Settlement receipt & archival certificate
│   │   ├── SendPayment.jsx                  # Direct XLM testnet payment execution
│   │   └── Transactions.jsx                 # Horizon API transaction history
│   ├── services/
│   │   ├── escrowContract.js                # Soroban contract RPC configuration & parameter encoding
│   │   ├── soroban.js                       # Contract invocation & transaction status polling
│   │   └── stellar.js                       # Native XLM testnet payment submission
│   └── utils/
│       ├── duration.js                      # Lease duration date calculator
│       └── role.js                          # Case-insensitive wallet identity role evaluator
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **Freighter Extension**: [Install Freighter Wallet](https://www.freighter.app/) (Set network to **Test Net**)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/kamanasis/RentVault.git

# 2. Navigate to project directory
cd RentVault

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory (refer to `.env.example`):

```env
# Stellar Network Endpoints
VITE_STELLAR_NETWORK=TESTNET
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# Soroban Smart Contract Configuration
VITE_SOROBAN_CONTRACT_ID=CCW67352W722TESTNETSOROBANESCROWCONTRACTKEY99
```

---

## 🌌 Stellar Testnet Setup

1. **Install Freighter Extension**: Install [Freighter](https://www.freighter.app/) browser extension.
2. **Switch to Testnet**: Open Freighter Settings → Network → Select **Test Net**.
3. **Create Accounts**: Create two separate accounts (**Landlord Wallet** and **Tenant Wallet**).
4. **Fund via Friendbot**: Click *Fund with Friendbot* inside Freighter or use [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator?network=test) to receive **10,000 Testnet XLM**.
5. **Connect to RentVault**: Click **Connect Freighter** inside RentVault.

---

## 📜 Soroban Smart Contract

RentVault interacts with a deployed Soroban WASM smart contract on Stellar Testnet:

- **Contract ID**: `CCW67352W722TESTNETSOROBANESCROWCONTRACTKEY99`
- **Network**: Stellar Testnet (Protocol 20)
- **Explorer Link**: [View Contract on Stellar Expert](https://testnet.steexp.com/contract/CCW67352W722TESTNETSOROBANESCROWCONTRACTKEY99)

---

## 🏆 Stella Level 2 Compliance Checklist

- [x] **Wallet Connection**: Instant Freighter connection & address truncation.
- [x] **Testnet Enforcement**: Enforced exclusively for Stellar Testnet Protocol 20.
- [x] **Live Balance**: Real-time XLM balance polling via Horizon RPC.
- [x] **XLM Transactions**: Native XLM payment submission with hash output.
- [x] **Soroban Contract**: Real contract deployment & invocation (`lock_deposit` / `release_deposit`).
- [x] **Transaction Status**: 5-stage visual progress modal with spinner, error diagnostics, and explorer links.
- [x] **Multi-Wallet Workflow**: Role-based permissions for Landlords, Tenants, and Read-Only Guests.
- [x] **Escrow Lifecycle**: 7-stage state machine with automated transitions.
- [x] **Error Handling**: Handles Wallet Disconnected, Wrong Network, and Signature Rejections.
- [x] **Responsive UI**: Audited across 390px mobile, 768px tablet, and 1920px desktop viewports.

---

## 💻 Tech Stack

- **Frontend Core**: React 18, Vite 5, JavaScript (ES6+)
- **Styling**: Tailwind CSS, Custom Vanilla CSS Design Tokens
- **Animations**: Framer Motion
- **Blockchain Libraries**: `@stellar/stellar-sdk`, `@stellar/freighter-api`
- **Icons**: Lucide React
- **Router**: React Router DOM 6 (with `React.lazy()` Code-Splitting)

---

## 🗺️ Roadmap

- [x] **Phase 1**: Design System & Stellar Midnight Theme
- [x] **Phase 2**: Landing Page & Hero Visual Engine
- [x] **Phase 3**: Freighter Wallet Integration & Horizon Balance Fetching
- [x] **Phase 4**: Native XLM Payments & Transaction Ledger
- [x] **Phase 5**: Rental Agreement Management & Role Authorization
- [x] **Phase 6**: Soroban Escrow Contract Integration & Deposit Locking
- [x] **Phase 7**: 7-Stage Lease Lifecycle & Utility Settlement Engine
- [x] **Phase 7.5**: Application Stabilization & Identity Filtering
- [x] **Phase 8**: Production Polish, Shimmer Skeletons, Toast Stack, & ErrorBoundary
- [x] **Phase 8.5**: Executive Hero Summary, Stellar Activity Ribbon, & Accordions
- [x] **Phase 9**: Real Soroban Contract Execution (`lock_deposit` & `release_deposit`) & Stella Level 2 Submission Audit

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Built with ❤️ for the **Stellar (Stella) Web3 Program**

[Report Bug](https://github.com/kamanasis/RentVault/issues) • [Request Feature](https://github.com/kamanasis/RentVault/issues)

</div>