# NakshatraAI

Astrology consultation app — one bare React Native app with two roles: **User** and **Pandit**.

| Area | Technology |
| --- | --- |
| Mobile app | React Native CLI |
| Auth | Firebase Authentication (phone OTP) |
| Database | Cloud Firestore |
| Notifications | Firebase Cloud Messaging |
| Storage | Firebase Storage |
| Backend | Firebase Cloud Functions |
| Calls | LiveKit |
| Payments | Razorpay |

## Docs

- [PROGRESS.md](PROGRESS.md)
- [AYUSHMAN_SETUP.md](AYUSHMAN_SETUP.md)
- [REQUIREMENTS.md](REQUIREMENTS.md)
- [DB_STRUCTURE.md](DB_STRUCTURE.md)
- [WORKFLOW.md](WORKFLOW.md)
- [API_STRUCTURE.md](API_STRUCTURE.md)
- [FRONTEND_GUIDE.md](FRONTEND_GUIDE.md)

## Local setup

```powershell
npm install
npm start
# In another terminal, with an Android device/emulator connected:
npm run android
```

In Firebase Console, register an Android app with package `com.nakshatraai` and place its downloaded `google-services.json` at `android/app/google-services.json`. The Google Services Gradle plugin reads this file for the native Firebase SDK. It is ignored by Git.

### Firebase console checklist (Step 1 — Ayushman)

1. Create the Firebase project and add an Android app with package `com.nakshatraai`.
2. Enable **Authentication → Phone** and add test numbers.
3. Create **Firestore** (production mode) and deploy the rules: `firebase deploy --only firestore:rules`.
4. Enable **Storage** and **Cloud Messaging**.
5. Add SHA-1 and SHA-256 fingerprints from `cd android; .\gradlew.bat signingReport` so phone OTP app verification works.

Roles live in `users/{uid}.role`. The account writes it once at first sign-in and
`firestore.rules` rejects every update that changes it, so nobody can promote themselves.

## CI

| Workflow | What it does |
| --- | --- |
| `.github/workflows/ci.yml` | Installs deps, runs TypeScript, validates Firestore rules |
| `.github/workflows/android-debug.yml` | `./gradlew assembleDebug`, uploads `app-debug.apk` |
