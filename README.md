# NakshatraAI

Astrology consultation app — one React Native (Expo) app with two roles: **User** and **Pandit**.

| Area | Technology |
| --- | --- |
| Mobile app | React Native + Expo |
| Auth | Firebase Authentication (phone OTP) |
| Database | Cloud Firestore |
| Notifications | Firebase Cloud Messaging |
| Storage | Firebase Storage |
| Backend | Firebase Cloud Functions |
| Calls | LiveKit |
| Payments | Razorpay |

## Docs

- [REQUIREMENTS.md](REQUIREMENTS.md)
- [DB_STRUCTURE.md](DB_STRUCTURE.md)
- [WORKFLOW.md](WORKFLOW.md)
- [API_STRUCTURE.md](API_STRUCTURE.md)
- [FRONTEND_GUIDE.md](FRONTEND_GUIDE.md)

## Local setup

```bash
npm install
cp .env.example .env   # then fill in the Firebase web app config
npm start
```

`google-services.json` (Android) and `GoogleService-Info.plist` (iOS) are **not** committed.
Download them from the Firebase console and drop them in the project root before running phone auth on a device.

### Firebase console checklist (Step 1 — Ayushman)

1. Create the Firebase project and add an Android app with package `com.nakshatraai`.
2. Enable **Authentication → Phone** and add test numbers.
3. Create **Firestore** (production mode) and deploy the rules: `firebase deploy --only firestore:rules`.
4. Enable **Storage** and **Cloud Messaging**.
5. Add the SHA-1 / SHA-256 fingerprints so Play Integrity app verification works for OTP.

Roles live in `users/{uid}.role`. The account writes it once at first sign-in and
`firestore.rules` rejects every update that changes it, so nobody can promote themselves.

## CI

| Workflow | What it does |
| --- | --- |
| `.github/workflows/ci.yml` | Installs deps, runs TypeScript, validates the Expo config and Firestore rules |
| `.github/workflows/android-debug.yml` | Expo prebuild + `./gradlew assembleDebug`, uploads `app-debug.apk` |
