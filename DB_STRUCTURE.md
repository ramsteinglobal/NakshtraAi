# NakshatraAI — Database Structure

Cloud Firestore collections used by the app.

## Collections

### `users/{uid}`

| Field | Description |
| --- | --- |
| `name` | User display name |
| `email` | Email address |
| `role` | `user` or `pandit` — written once, never editable by the account |
| `photo` | Profile photo URL (Firebase Storage) |

### `pandits/{uid}`

| Field | Description |
| --- | --- |
| `specialization` | Pandit specialty |
| `experience` | Years of experience |
| `rating` | Average rating |
| `ratePerMinute` | Price per minute |
| `availability` | Online / offline state |
| `verificationStatus` | Verification state |

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
