# NakshatraAI — API Structure

Cloud Functions used by the app.

| Function | Responsibility |
| --- | --- |
| `assignRole` | Runs on signup, sets user or pandit role in Firestore |
| `generateLiveKitToken` | Authorizes consultation, returns short-lived token |
| `startBillingTimer` | Starts per-minute deduction when call connects |
| `processRefund` | Handles refund via Razorpay based on disconnect reason |
| `verifyRazorpayPayment` | Verifies payment signature before call starts |
| `endConsultation` | Marks call as ENDED, calculates final charge |
