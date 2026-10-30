# NakshatraAI — API Structure

Cloud Functions used by the app. **None are built yet** — the whole backend
service is assigned to Anurag (payments/billing) and Prachi (call lifecycle,
LiveKit). The `functions/` directory does not exist at the time of writing;
this document is the contract the mobile app will code against.

| Function | Responsibility | Status | Owner |
| --- | --- | --- | --- |
| `assignRole` | Runs on signup, sets user or pandit role in Firestore | Not built *(role is currently written through the client-on-create rule — keep or retire when backend lands)* | Anurag |
| `createRazorpayOrder` | Creates a Razorpay order for wallet top-ups / call pre-pay | Not built | Anurag |
| `verifyRazorpayPayment` | Verifies payment signature before call starts | Not built | Anurag |
| `startBillingTimer` | Starts per-minute deduction when call connects | Not built | Anurag |
| `processRefund` | Handles refund via Razorpay based on disconnect reason | Not built | Anurag |
| `approvePandit` | Sets `pandit.verificationStatus` = `approved`/`rejected` (clients may never self-approve — enforced by `firestore.rules`) | Not built | Anurag / Prachi |
| `generateLiveKitToken` | Authorizes consultation, returns short-lived LiveKit token for participants only | Not built | Prachi |
| `onRoomEvent` | Records room-join / room-leave so billing can compute exact duration | Not built | Prachi |
| `endConsultation` | Marks call `ENDED`, calculates final charge | Not built | Prachi |
| `notifyIncomingCall` | FCM push to pandit (and ringing-handoff) during `RINGING` | Not built | Prachi |

## Conventions every function must follow

- Validate the caller's Firebase auth token and App Check token before doing anything.
- **Never** expose the LiveKit API secret or Razorpay key secret to the mobile app.
- Money fields on `consultations`/`transactions` are client-immutable; only
  these functions may write them (`firestore.rules` enforces this already).
- Refunding follows `REQUIREMENTS.md`: reject → full, pandit disconnect → 50%,
  network failure → investigate, no penalty.
