# NakshatraAI — Frontend Guide

Stack: **bare React Native CLI (0.88)** — not Expo. TypeScript strict mode.
All Firebase access goes through `src/services/*`; screens never touch Firebase
directly.

## Brand colors

The current screens ship with a provisional palette. Anurag / Indrabhan still
own the final call — update this table if it changes (Colors are used inline in
screens for now).

| Role | Hex | Used for |
| --- | --- | --- |
| Deep purple (primary) | `#301653` | Primary buttons, pandit-side accents |
| Purple (accent) | `#684395` / `#512779` | Eyebrow text, links, spinners |
| Chip purple | `#351759` | Selected filter chips |
| Cream (app background) | `#FAF5EF` | Pandit list background |
| White | `#FFFFFF` | Cards, inputs, user dashboard background |
| Soft lilac | `#EEE9F2`, `#F0E5F6`, `#E8DFE8` | Progress track, avatars, borders |
| Gold (highlight) | `#E7BD60` | Avatar ring |
| Green (success/online) | `#27814D` | Online dot |
| Text primary | `#21182B` / `#251A30` | Headings |
| Text secondary | `#68636D` / `#716A78` | Body copy |
| Error red | `#B3261E` | Validation errors |

## Navigation structure

> No React Navigation installed yet — screens are switched with local state in
> `App.tsx` / `HomeScreen.tsx`. First real step: add `@react-navigation`.

**User stack**

```
Login → Role select → Profile Setup → Home (tabs: Home · Pandits · Wallet · History)
             Home → Pandit List → Pandit Profile → Chat → Call
             Wallet → Transaction History
```

**Pandit stack**

```
Login → Role select → Profile Setup (steps) → Dashboard
             Dashboard → Availability toggle → Incoming Call → Chat → Call
             Dashboard → Earnings
```

## Screen status

| Screen | Status |
| --- | --- |
| Login (OTP), Role select, Profile Setup, Home (both roles) | ✅ Built |
| Pandit List + Search, Pandit Profile | ✅ Built |
| Wallet, Transaction History | ❌ Placeholder tabs only |
| Online/Offline toggle, Incoming Call, Earnings Dashboard | ❌ Placeholder cards only |
| Chat UI, Call UI | ❌ Not started (Adarsh / Step 5) |

## Shared components

None exist yet — styling is currently inline per screen. Extract as shared
components in the navigation step:

- [ ] Button
- [ ] InputField
- [ ] PanditCard
- [ ] WalletCard
- [ ] ChatBubble
- [ ] CallControls
- [ ] LoadingSpinner
- [ ] NotificationBanner
