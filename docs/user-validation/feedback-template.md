# RentVault — Standardized User Feedback Protocol & Template

To satisfy Level 4 requirements for collecting structured, actionable user feedback without storing sensitive personal data or private keys, RentVault uses the following evaluation template.

---

## Evaluation Form Fields

| Field Name | Type | Description | Mandatory / Optional |
|---|---|---|---|
| **Overall Rating** | Number (1–5) | General satisfaction rating with the platform. | Mandatory |
| **Ease of Use** | Number (1–5) | Usability rating (1 = Difficult, 5 = Highly Intuitive). | Mandatory |
| **Role Perspective** | Enum | Perspective under which testing was conducted (`Tenant`, `Landlord`, `Evaluator`). | Mandatory |
| **Focus Area** | Enum | Category of interaction (`UX & Interface`, `Escrow Speed`, `Dispute Settlement`, `Smart Contract Security`, `Wallet Onboarding`, `Feature Request`). | Mandatory |
| **General Experience / Impressions** | Text | Free-form review explaining what worked well or general thoughts. | Mandatory |
| **Confusing Aspects / Friction** | Text | Specific UI elements, terms, or flows that created uncertainty. | Optional |
| **Errors / Unexpected Issues** | Text | Any error banners, rejected transactions, or RPC network delays encountered. | Optional |
| **Feature Requests / Suggestions** | Text | Desired new capabilities for future iterations. | Optional |

---

## Submission Channels

1. **In-App Feedback Modal**:
   - Access via the **Reviews** button in the header navigation or the dashboard.
   - Saves directly to the `feedback` collection in Firebase Firestore with local fallback caching.
2. **Anonymization & Privacy Standard**:
   - All Stellar secret keys (`S...`), seed phrases, and passwords are unconditionally stripped prior to persistence.
   - Public keys are truncated (`GABC...WXYZ`) in public views.
   - Zero personal identity information (e.g. real name, email, phone) is required or stored.
