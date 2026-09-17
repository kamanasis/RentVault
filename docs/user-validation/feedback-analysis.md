# RentVault — Feedback Categorization & Prioritization Framework

This document defines the methodology for analyzing, categorizing, and prioritizing real user feedback collected during the Level 4 validation phase.

---

## 1. Categorization Taxonomy

Incoming user feedback is routed into one of the following 14 operational domains:

1. **Onboarding**: Initial discovery, first-time instructions, and understanding the core value proposition.
2. **Wallet Connection**: Freighter authentication, wallet switching, network configuration, and installation guidance.
3. **Agreement Creation**: Setting lease terms, property address inputs, validation constraints, and review previews.
4. **Escrow / Deposit**: Soroban contract authorization, token transfers, deposit locking confirmation, and transaction hashing.
5. **Lease Lifecycle**: Transitioning between the 8 lifecycle stages, activation timestamps, and duration calculation.
6. **Utility Settlement**: Itemized deduction logging, reserve balance calculations, and net refund adjustments.
7. **Dispute Handling**: Dispute lodging, evidence notes, auto-release timers, and mutual agreement resolution.
8. **Dashboard**: Summary metrics, agreement cards, portfolio health, and role filtering.
9. **Navigation**: Header menus, breadcrumbs, modal triggers, and deep-link routing.
10. **Mobile Experience**: Touch targets, responsive card grids, modal scrolling, and layout wrapping.
11. **Performance**: Page loading latency, RPC response times, Firestore query frequency, and ledger polling.
12. **Error Handling**: Graceful degradation on network timeout, clear error explanations, and retry pathways.
13. **Visual Clarity**: Information hierarchy, typography, status contrast, and design system consistency.
14. **Feature Requests**: Net-new capabilities requested by real users.

---

## 2. Prioritization Model

Issues and suggestions are triaged according to the following criteria:

### 🔴 HIGH Priority
- **Definition**: Directly blocks a user from completing a core financial or contractual workflow (e.g., wallet failure, smart contract deposit panic, inability to approve settlement).
- **SLA**: Immediate triage and hotfix implementation.

### 🟡 MEDIUM Priority
- **Definition**: Creates noticeable cognitive friction, ambiguity, or hesitation, but allows the user to eventually complete the operation (e.g., unclear next step, missing transaction feedback, confusing role permission error).
- **SLA**: Planned for next minor sprint release.

### 🟢 LOW Priority
- **Definition**: Minor cosmetic Polish, styling preference, or non-critical enhancement idea that does not impede task completion.
- **SLA**: Tracked in product backlog for future consideration.

---

## 3. Feedback Lifecycle States

Each feedback submission transitions through an explicit lifecycle:
- **`PENDING_REVIEW`**: Newly submitted feedback awaiting evaluation and priority assignment.
- **`IN_PROGRESS`**: Issue confirmed; engineering solution or UX refinement being designed and coded.
- **`RESOLVED`**: Improvement implemented, verified via automated test suites, and deployed to live production.
