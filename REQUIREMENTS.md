# NakshatraAI — Requirements

**App name:** NakshatraAI

One React Native app, two roles — **User** and **Pandit**.

## Technology stack

| Component | Technology | Responsibility |
| --- | --- | --- |
| Mobile app | React Native | User and Pandit interfaces |
| Authentication | Firebase Authentication | Sign-in and user identity |
| Database | Cloud Firestore | Profiles, calls, messages, transactions |
| Secure backend | Firebase Cloud Functions | Call authorization, billing, refunds |
| Notifications | Firebase Cloud Messaging (FCM) | Incoming calls and messages |
| Audio/video | LiveKit | Real-time media communication |
| Payments | Razorpay | Payments and eligible refunds |
| File storage | Firebase Storage | Profile photos and permitted attachments |
| Security | Firestore Rules + App Check | Protect application data and backend access |

Firebase Cloud Functions can run trusted backend code without requiring a traditional server.
Callable functions also support Firebase authentication and App Check token validation.

## Roles

- **User** — consults pandits.
- **Pandit** — gives consultations and earns per minute.

## User features

- OTP login
- Browse pandits
- Filter by specialty / language / price
- View pandit profile
- Wallet (add money)
- Live chat
- Audio call
- Video call
- Transaction history

## Pandit features

- Registration
- Profile setup
- Online / offline toggle
- Accept / reject incoming calls
- Live chat
- Earnings dashboard

## Call states

Calls move through these states in order:

```
REQUESTED → PAYMENT_PENDING → RINGING → ACCEPTED → CONNECTED → ENDED → SETTLED
```

## Refund rules

| Situation | Refund |
| --- | --- |
| Pandit rejects the call | Full refund |
| Pandit disconnects mid-call | 50% refund |
| Network failure | Investigate, no penalty |
