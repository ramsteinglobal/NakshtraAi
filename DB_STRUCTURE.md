# NakshatraAI — Database Structure

Cloud Firestore collections used by the app.

## Collections

### `users/{uid}`

| Field | Description |
| --- | --- |
| `uid` | Copies the document ID |
| `name` | User display name |
| `email` | Email address (optional) |
| `role` | `user` or `pandit` — written once, never editable by the account |
| `photo` | Profile photo URL (Firebase Storage) |
| `city` | Current city (optional) |
| `birthDate` | Date of birth, `DD/MM/YYYY` (optional) |
| `birthTime` | Time of birth, `HH:MM AM/PM` (optional) |
| `birthPlace` | Place of birth (optional) |
| `profileComplete` | `true` once onboarding finished |
| `updatedAt` | Last write time |

### `pandits/{uid}`

| Field | Description |
| --- | --- |
| `uid` | Copies the document ID |
| `name` | Pandit display name |
| `city` | Base city |
| `specialization` | Pandit specialty |
| `experience` | Years of experience (number) |
| `languages` | Array of language names |
| `ratePerMinute` | Price per minute (number) |
| `bio` | Short about text |
| `rating` | Average rating — maintained by admin/backend only |
| `availability` | `online` / `offline` |
| `verificationStatus` | `pending` / `approved` / `rejected` |
| `profileComplete` | `true` once onboarding finished |
| `updatedAt` | Last write time |

The pandit's own account may never change `verificationStatus` or `rating`.
Set them from the Firebase console (or a Cloud Function) using a signed-in
principal with the `admin` custom claim, then clients read
`verificationStatus == 'approved'` to list pandits.

### `consultations/{callId}`

| Field | Description |
| --- | --- |
| `userId` | User UID |
| `panditId` | Pandit UID |
| `status` | Call state (`REQUESTED` … `SETTLED`) |
| `mode` | `chat`, `audio` or `video` |
| `amountPaid` | Amount paid for the consultation |
| `connectedAt` | Timestamp when the call connected |
| `endedAt` | Timestamp when the call ended |
| `refundAmount` | Amount refunded |
| `createdAt` | Created time (`REQUESTED`) |
| `updatedAt` | Last status change |

Clients may only move `status`, `connectedAt` and `endedAt`. `userId`,
`panditId`, `amountPaid` and `refundAmount` are immutable until the trusted
Cloud Functions (Anurag / Prachi steps) take over.

### `consultations/{callId}/messages/{messageId}`

| Field | Description |
| --- | --- |
| `senderId` | UID of the sender |
| `text` | Message body |
| `type` | Message type (`text`, `image`, `system`, …) |
| `createdAt` | Sent timestamp |
| `readAt` | Read timestamp |

### `transactions/{txnId}`

| Field | Description |
| --- | --- |
| `userId` | User UID |
| `panditId` | Pandit UID |
| `callId` | Related consultation ID |
| `amount` | Transaction amount |
| `type` | Transaction type (credit, debit, refund, earning, …) |
| `createdAt` | Timestamp |

Transactions are **read-only for clients**: Firestore rules reject every client
write so amounts can't be forged. Wallet/payment Cloud Functions (Anurag's
step) own all writes.
