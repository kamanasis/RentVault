# RentVault — Product Improvement Log

This log records user-reported friction points, architectural audit findings, decisions taken, implemented code changes, and verification outcomes for RentVault.

---

### Record 1: Dual-Pathway Onboarding for Landlords and Tenants
- **Identified Friction / Feedback**: First-time users connecting as tenants were presented with an empty-state card that only allowed creating an agreement ("Create your first rental agreement"), leaving tenants without a clear path to join an existing agreement.
- **Problem**: Onboarding card was exclusively Landlord-oriented.
- **Impact**: Tenants had to manually construct URLs or navigate away without understanding how to access their agreement.
- **Decision**: Introduce a dual-perspective toggle directly on `OnboardingCard.jsx` with an inline "Lookup Agreement ID" form for tenants and direct 1-click Friendbot testnet XLM faucet.
- **Implemented Change**:
  - Added "I am a Landlord" vs "I am a Tenant" pathway switcher.
  - Added inline Agreement ID lookup input with instant navigation to `/agreements/:id`.
  - Added 1-click Testnet Friendbot claim button (`+10,000 XLM`).
- **Verification**: Verified dual-tab switching and direct lookup navigation in `OnboardingCard.jsx`.

---

### Record 2: Desktop Accessibility of the 10+ Onboarded Users Ledger
- **Identified Friction / Feedback**: Evaluators and desktop users could not access the "Onboarded Users & Interaction Registry" modal directly from the desktop navigation bar; it was only accessible inside the mobile hamburger menu.
- **Problem**: Navigation header inconsistency between mobile and desktop views.
- **Impact**: Desktop evaluators could not easily inspect verified on-chain cryptographic proofs without resizing the browser to mobile viewport.
- **Decision**: Expose the "10+ Users" modal trigger in the primary desktop header controls ribbon alongside Telemetry and Reviews.
- **Implemented Change**: Updated `Navbar.jsx` to render the `10+ Users` button on desktop viewports.
- **Verification**: Verified button renders and launches the registry modal on desktop and mobile.

---

### Record 3: Structured Diagnostics in User Feedback Collection
- **Identified Friction / Feedback**: Users and testers provided unstructured comments that often lacked actionable diagnostics regarding specific friction points or transaction errors.
- **Problem**: Single freeform comment textarea did not prompt users for ease-of-use rating or specific error descriptions.
- **Impact**: Difficulty categorizing user feedback into actionable technical issues.
- **Decision**: Upgrade `UserFeedbackModal.jsx` and `feedbackStore.js` to collect structured ease-of-use scores and optional diagnostic prompts (Friction/Confusion, Errors Encountered, Feature Suggestions).
- **Implemented Change**:
  - Added `easeOfUse` (1–5) rating selector.
  - Added expandable detailed diagnostic prompts for friction, errors, and feature requests.
  - Added lifecycle status (`PENDING_REVIEW`, `IN_PROGRESS`, `RESOLVED`) and resolution note tracking.
- **Verification**: Tested submission and validation with zero-error compilation.

---

### Record 4: Instant Lifecycle Clarity on Agreement Cards
- **Identified Friction / Feedback**: Users managing multiple agreements could not immediately tell who needed to take the next action without clicking into each agreement's detail view.
- **Problem**: `AgreementCard.jsx` displayed raw status badges without highlighting pending action responsibility.
- **Impact**: Landlords and tenants experienced cognitive overhead determining whether an action was required from them.
- **Decision**: Add an explicit "Next Action" status pill to each agreement card summarizing the immediate requirement (e.g., "Next: Awaiting Tenant Deposit", "Next: Escrow Locked On-Chain", "Next: Settlement Review Pending").
- **Implemented Change**: Implemented `getNextActionSummary` helper and rendered status pill on `AgreementCard.jsx`.
- **Verification**: Verified visual display across Draft, Active, Pending Settlement, and Completed stages.
