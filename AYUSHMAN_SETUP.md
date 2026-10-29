# Ayushman — GitHub and Firebase Foundation Checklist

This checklist covers only the initial project-owner tasks. App authentication implementation and role logic belong to the implementation owners; database schema/security hardening belongs to the assigned owners after this foundation is ready.

## 1. GitHub repository and team access

- [ ] Confirm the canonical repository is `ramsteinglobal/NakshtraAi`.
- [ ] Add each teammate using their exact GitHub username or the relevant organization team.
- [ ] Give maintain/admin access only to people explicitly approved by the project owner; give the rest the agreed developer/write role.
- [ ] Keep the `main` branch protected and use pull requests for changes.
- [ ] Confirm teammates can clone the repo and open a pull request.

> Collaborator invitations and branch-protection changes require the correct repository/organization permissions. Do not guess usernames from first names.

## 2. Create and configure Firebase

In the Firebase Console, create or select the NakshtraAi project. Confirm the project ID with the team before wiring it into app configuration.

- [ ] Register the Android app using the package/application ID configured in `app.json`; confirm the ID before downloading platform files.
- [ ] Enable **Authentication → Sign-in method → Phone**. Add test phone numbers for development.
- [ ] Create the **Cloud Firestore** database in production mode.
- [ ] Enable **Cloud Storage** and select an appropriate location.
- [ ] Enable **Firebase Cloud Messaging** for push notifications.
- [ ] Register the iOS app only if iOS is in scope; download its configuration file separately.
- [ ] Add Android SHA-1 and SHA-256 fingerprints from the actual signing configuration where required for phone-auth app verification.
- [ ] Record the Firebase project ID and enabled services in the team setup notes.
- [ ] Deploy reviewed Firestore rules only after the database/security owners have checked them.

## 3. Billing and Blaze plan

- [ ] Confirm the billing owner and obtain their approval before linking a payment method or upgrading to Blaze.
- [ ] Link the correct billing account and upgrade only after approval.
- [ ] Configure Cloud Billing budget alerts at agreed thresholds and add the responsible billing contacts.
- [ ] Review usage dashboards and service quotas regularly.

**Important:** Budget alerts notify you; they are not a guaranteed hard spending cap. Do not describe a budget alert as a spending limit that automatically stops charges. Check service-specific controls and billing terms before enabling paid services.

## 4. Configuration and safe team handoff

- [ ] Populate local `.env` from `.env.example` for each developer; never commit the real `.env`.
- [ ] Provide the Firebase project ID and app configuration through the team's approved password manager or secret-sharing channel.
- [ ] Keep service-account private keys, Admin SDK credentials, billing details, and other privileged secrets out of GitHub source files, chat messages, and public repositories.
- [ ] Use GitHub Actions repository/environment secrets for CI credentials when needed; restrict who can access them.
- [ ] Use Firebase/Google Cloud IAM to grant minimum required access to each teammate. Do not share one personal account or one private key with everyone.
- [ ] If a privileged key has already been committed or posted publicly, revoke/rotate it and review audit logs.

Firebase client configuration values used by a mobile app are not equivalent to an Admin SDK private key. Protect data with Authentication, Firestore/Storage Security Rules, App Check, and least-privilege IAM; do not rely on hiding client config.

## Completion handoff

Tell the team when:
1. The Firebase project ID and registered app IDs are confirmed.
2. Phone sign-in, Firestore, Storage, and FCM are enabled.
3. The billing owner has approved any Blaze upgrade.
4. Team access has been checked.
5. Configuration handoff is available through the approved secure channel.

Do not mark this checklist complete until each item has been verified in the actual GitHub/Firebase consoles.
