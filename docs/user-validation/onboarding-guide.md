# RentVault — Real User Testnet Onboarding Guide

Welcome to **RentVault**, a decentralized rental security deposit escrow platform built on **Stellar Testnet** using **Soroban WASM Smart Contracts**.

This guide outlines the step-by-step procedure for real users and evaluators to interact with the deployed testnet application, test the smart contract escrow, and submit feedback.

---

## 1. Prerequisites

1. **Web Browser**: Google Chrome, Brave, or Firefox.
2. **Freighter Wallet Extension**:
   - Install from [https://www.freighter.app/](https://www.freighter.app/).
   - Set up or import a testnet account.
   - Switch network to **Test Net** (Freighter Settings → Network → Test Net).

> [!NOTE]
> RentVault operates exclusively on **Stellar Testnet (Protocol 20)**. No real-world funds or real money are ever required.

---

## 2. Onboarding Workflow

### Step 1: Connect Wallet & Fund Testnet XLM
1. Visit the live RentVault application: [https://rent-vault-pi.vercel.app](https://rent-vault-pi.vercel.app).
2. Click **Connect Wallet** in the top navigation bar.
3. If your account balance is `0.00 XLM`, click **Get Free Testnet XLM** on the dashboard or **Fund Account via Friendbot (+10,000 XLM)** to receive free Stellar Testnet test tokens.

---

### Step 2: Role Selection & Rental Agreement Setup

#### For Landlords:
1. In the dashboard, select **I am a Landlord** or click **Create First Agreement Now**.
2. Fill out the agreement details:
   - Property Name & Address
   - Monthly Rent (XLM)
   - Security Deposit Amount (XLM)
   - Tenant Stellar Public Key (`G...`)
   - Lease Start & End Dates
3. Review the preview and click **Create & Save Agreement**.
4. Share the generated Agreement ID or link with your tenant.

#### For Tenants:
1. On the dashboard, toggle to **I am a Tenant**.
2. Enter the Agreement ID provided by your landlord and click **Lookup Agreement**.
3. Review the security deposit terms, landlord address, and lease duration.

---

### Step 3: Deposit Locking in Soroban Escrow (Tenant Action)
1. On the agreement page, click **Deposit & Lock Escrow**.
2. Review the transaction parameters:
   - Deposit Amount in XLM
   - Soroban Escrow Contract ID: `CB2YAY734VGBLC4B3KGCDFSLS5JWKRCLIW4NM77VFLH32Q6JPEYLHADF`
3. Click **Authorize Deposit via Freighter**.
4. Confirm the transaction in the Freighter extension popup.
5. The Soroban smart contract will lock the security deposit and emit an on-chain topic event (`"escrow"`, `"locked"`).
6. Verify your transaction on Stellar Expert Explorer via the link provided on screen.

---

### Step 4: Utility Settlement & Mutual Release (Landlord & Tenant)
1. At the end of the lease period, the Landlord itemizes any utility or maintenance deductions.
2. The remaining escrow balance is calculated transparently.
3. The Tenant reviews and approves the settlement or submits a dispute.
4. Upon resolution or agreement completion, the escrow releases funds back to the respective parties automatically.

---

### Step 5: Submitting Real User Feedback
1. Click **Reviews** in the top navigation bar.
2. Click **Leave Feedback**.
3. Rate your overall experience and ease of use (1–5 stars).
4. Select your role perspective (Tenant, Landlord, or Evaluator).
5. Optionally provide diagnostic details:
   - What was confusing or caused friction?
   - Any errors or transaction failures encountered?
   - What feature would you like to see next?
6. Submit your feedback. Your submission is recorded securely in Firestore and visible on the public sentiment report.
