# NakshatraAI — Project Status Board

**Last updated:** 30 Oct 2026 · **Verified against:** `main` @ `c29fb58` (Step 2 merged via PR #6)
**Overall completion: ~35%** · Steps 1–2 near done · Steps 3–5 not started · Step 6 (testing) 0%

Status key: ✅ done · 🟡 partial · ❌ not started · ⚠️ needs ops/merge decision

---

## Step 1 — Ayushman (Firebase Foundation) — ~85%

| Item | Status | Notes |
| --- | --- | --- |
| GitHub repo + team added | ✅ | |
| Firebase project (Auth, Firestore) | ✅ | Configured in app code |
| FCM + Storage enabled | ❌ | Console setup listed in README; SDK integration comes in Steps 5 |
| Upgrade to Blaze + spending limit | ⚠️ | Ops item — required before Cloud Functions can deploy |
| Share all keys with team | ⚠️ | Ops item — `google-services.json` stays local, never committed |
| Phone OTP login | ✅ | `LoginScreen` + `src/services/auth.ts` |
| Role assignment in Firestore | ✅ | `RoleScreen` → `users/{uid}.role` |
| Rule: nobody can change own role | ✅ | Enforced in `firestore.rules` |

## Step 2 — Anshika (Database + Rules + Pandit APIs) — ~95%

| Item | Status | Notes |
| --- | --- | --- |
| All collections defined: `users`, `pandits`, `consultations`, `messages`, `transactions` | ✅ | Merged to `main` |
| Security rules for every collection | ✅ | Role/verification/money fields client-immutable; transactions write = backend only |
| Pandit listing + search APIs | ✅ | `fetchPandits()` filters: language, max ₹/min, online-only |
| Pandit profile API | ✅ | `fetchPandit(uid)` |
| Photo uploads / image messages | ❌ | Needs Firebase Storage integration (later step) |
| Merge to `main` | ✅ | PR #6 |

## Step 2 — Anurag (Razorpay + Wallet + Billing) — ~5%

| Item | Status | Notes |
| --- | --- | --- |
| Razorpay account setup | ❌ | |
| Wallet: add money, balance | ❌ | UI tab is a placeholder; no backend |
| Per-minute billing (Cloud Functions) | ❌ | **No `functions/` directory exists** |
| Refunds + duplicate-payment protection | ❌ | Rules ready (clients cannot write money fields) |
| Transaction history (backend writes) | ❌ | Client read-only API exists (`fetchTransactions`) |

## Step 3 — Indrabhan (Frontend, User + Pandit) — ~40%

> ⚠️ Brief says "React Native + Expo" — project is actually **bare React Native CLI** (migrated on `main`).

| Item | Status | Notes |
| --- | --- | --- |
| RN project setup | ✅ | Bare RN CLI 0.88.1, Android project committed |
| Navigation config | ❌ | No React Navigation; local-state switching in `App.tsx`/`HomeScreen.tsx` |
| Environment variables + shared components | ❌ | Colors/inputs currently inline per screen |
| Login, Role select | ✅ | |
| Home (user + pandit dashboards) | ✅ | Tab structure + review/journey cards |
| Pandit List + Search + Pandit Profile | ✅ | `PanditListScreen` |
| Registration + Profile Setup (both roles) | ✅ | `ProfileSetupScreen` multi-step wizard |
| Wallet + Transaction History screens | ❌ | Placeholder tabs |
| Online/Offline toggle | ❌ | |
| Incoming Call screen | ❌ | Blocked by FCM + call lifecycle |
| Earnings Dashboard | ❌ | Placeholder card |
| Screens connected to Firebase | ✅ | For everything built so far |

## Step 4 — Prachi (Call Lifecycle + LiveKit + Functions) — ~5%

| Item | Status | Notes |
| --- | --- | --- |
| Call state machine in Cloud Functions | ❌ | Client-side enum + participant rules exist as groundwork |
| LiveKit project setup | ❌ | |
| `generateLiveKitToken` (authorized users only) | ❌ | Documented in `API_STRUCTURE.md` |
| No LiveKit secret in app | ✅ (by design) | No LiveKit code exists yet; convention documented |
| Room join/leave recording for billing | ❌ | |
| Edge cases (app killed, network drop, pandit offline) | ❌ | |

## Step 5 — Adarsh (Calls + Chat UI) — ~5%

| Item | Status | Notes |
| --- | --- | --- |
| LiveKit SDK in app | ❌ | |
| Call UI (mute, speaker, camera, end, reconnect) | ❌ | |
| Live chat UI (Firestore listener) | ❌ | Send/fetch/read functions ready in `src/services/consultations.ts` |
| FCM incoming call screen (Accept/Reject) | ❌ | |
| Same-room wiring for user + pandit | ❌ | |
| Edge-case UI (low balance, rejection, network) | ❌ | |

## Step 6 — Everyone (Testing + Review) — 0%

- No test suite, no E2E, no device-matrix run yet.
- Dhruv's review gate applies to every PR (currently one open: `feat/step2-data-layer`).

---

## Blockers (priority order)

1. **Cloud Functions don't exist** — freezes Anurag, Prachi and Adarsh (most of the remaining work). Needs Blaze plan first.
2. **Pandit verification path** — list stays empty until `verificationStatus='approved'` is set (console as admin, or `approvePandit` function).
3. **Correct the Expo mention** in team briefs — repo is bare RN CLI.

## How to read this file

- This is a planning/status document, not a spec. Specs: `REQUIREMENTS.md`,
  `DB_STRUCTURE.md`, `API_STRUCTURE.md`, `FRONTEND_GUIDE.md`, `WORKFLOW.md`.
- Update the **Last updated** line whenever statuses change, and keep the
  per-item percentages roughly honest (±10%).
