# SAHTY — صحتي

React, Vite, TypeScript, Firebase Authentication, Realtime Database, Storage, and Hosting.

## Local setup

1. Use a supported Node.js LTS release and run `npm install`.
2. Copy `.env.example` to `.env` and enter the real web-app values from Firebase project `sahty-27e33`. For an isolated test project, replace all Firebase values with that project's web-app configuration and set its matching `VITE_FIREBASE_PROJECT_ID`; the app uses only the explicitly configured project and does not silently fall back to production or a demo project.
3. In Firebase Console, enable the required sign-in methods and create a Realtime Database and Storage bucket.
4. Run `npm run dev` and open `/dev/firebase-check` in development to test the Firebase App, Authentication project endpoint, Realtime Database connection, Storage response, and provider enablement.
5. Run `npm run lint` and `npm run build`.

The diagnostic fails closed when required configuration is missing. Firebase failures are shown with their original error only in development. A successful local build does not establish a Firebase connection.

The RTDB Emulator rules suite is `npm run test:rules`; Firebase CLI 14 requires Node.js 20 or newer, and the Realtime Database Emulator requires Java. Cloud Function payment-unit tests are run with `npm test` from `functions/`.

## Firebase deployment

`.firebaserc` selects `sahty-27e33` as the default Firebase project. `firebase.json` points Firebase CLI to `database.rules.json`, `storage.rules`, and the Vite `dist` hosting directory. After signing in to Firebase CLI and configuring `.env`, deploy with:

```powershell
firebase deploy --only database,storage,hosting
```

**The default project is production. Do not run deployment commands as part of local testing.** No rules, Functions, hosting content, or production data were changed or deployed during this work; review and explicit approval are required before any production deployment.

The rules are source files until deployed; the project connection and deployed rules must be verified against the actual Firebase project before production traffic.

## Privileged roles

New accounts start as patients. The trusted administrator email addresses are recognized only after Firebase confirms email ownership; the corresponding database and Storage rules must also authorize those verified accounts. Doctor approval updates the doctor role and verified profile through Realtime Database rules. Payment-confirmation Functions still require the trusted `admin: true` custom claim.

Bootstrap the first administrator only in a trusted environment using the Firebase Admin SDK: assign the `admin: true` custom claim and set that account's `users/{uid}/role` to `admin`. Never place Admin SDK credentials or service-account keys in this project or in Vite environment variables. Custom claims must be issued by a trusted server and may require the user to refresh their ID token.

The application does not contain a privileged claim-issuance service. An email-verified administrator can access the review dashboard, but actions requiring a custom claim remain unavailable until the claim is assigned through a trusted server.

## Doctor application email notifications

Doctors can submit an application before confirming their email. The request is bound to the signed-in Firebase UID and email and stays pending until an administrator reviews the application; this does not grant doctor permissions or allow the applicant to approve their own request.

The doctor application is saved first, then a callable Cloud Function sends a notification to `abdoaltyp8@gmail.com` through the configured SMTP provider. The email contains the applicant's name, specialty, and account ID; documents remain private in Firebase Storage. If email delivery fails after an application is saved, the page reports that partial outcome and lets the applicant retry the notification without resubmitting the application.

The admin dashboard can also create a doctor Auth account through the `createDoctorAccount` callable Function. The function requires a verified trusted administrator account (or the trusted admin custom claim) and a matching active `ADMIN` database profile, creates the doctor as inactive and pending review, and sends a Firebase password-reset link through SMTP. Its continue URL is derived from the Firebase project running the Function, keeping staging invitations within staging. A failed email send leaves the doctor account inactive and reports that it was created without an invitation; do not deploy this Function until the SMTP secrets are configured.

Before deploying the notification Function, configure these Firebase Functions secrets in an authorized environment:

```powershell
firebase functions:secrets:set SMTP_HOST
firebase functions:secrets:set SMTP_PORT
firebase functions:secrets:set SMTP_USER
firebase functions:secrets:set SMTP_PASSWORD
firebase functions:secrets:set SMTP_FROM
```

Do not put SMTP credentials in `.env`, browser code, or source control. If email delivery fails after an application is saved, the page reports that partial outcome and lets the applicant retry the notification without resubmitting the application.

## Appointments and patient care

Appointment creation, on-site payment confirmation, cancellation, and Paymob checkout initiation are server-side callable Functions. Clinic appointments use `cash_on_site` and remain pending until an authorized administrator confirms receipt of cash. Online appointments use `paymob`; they remain pending until the `paymobWebhook` HTTP Function validates Paymob's HMAC signature and matches the transaction, integration, currency, amount, and server-side payment-attempt reference against the appointment. The browser return URL only displays the status stored in Firebase and is never treated as proof of payment.

The Paymob Intention API integration and unified-checkout redirect are implemented locally, but are **not configured or verified against a merchant sandbox account**. The current Paymob documentation describes a backend-created intention, redirects Egypt customers to `https://eg.checkout.paymob.com/` using the public key and intention client secret, and treats the signed callback as the payment source of truth; the browser redirect is for user experience only. Before deploying Functions to an isolated test project, obtain sandbox values for `PAYMOB_SECRET_KEY`, `PAYMOB_PUBLIC_KEY`, `PAYMOB_INTEGRATION_ID`, and `PAYMOB_HMAC_SECRET`; do not put them in `.env`, browser code, source control, or chat. Start with the merchant's **card Sandbox integration**: Paymob's current Create Intention reference documents `notification_url` as supported only for card Integration IDs. Do not enable wallet Integration IDs until their callback delivery and HMAC have been confirmed in the merchant Sandbox. `paymobIntents/{attemptId}` stores checkout secrets only for server-side idempotency; client RTDB reads and writes are explicitly denied. Re-opening a ready Checkout reuses the same Paymob intention. If the intention request's outcome is uncertain (such as a network timeout or server error after submission), the attempt remains blocked for reconciliation instead of silently creating another potentially chargeable intention. A booking cannot be cancelled while an active Checkout may still accept payment. The patient supplies actual billing details, and those details are sent only in the server's Paymob request.

Paymob secrets are bound narrowly: `startPaymobPayment` receives `PAYMOB_SECRET_KEY`, `PAYMOB_PUBLIC_KEY`, and `PAYMOB_INTEGRATION_ID`; `paymobWebhook` receives `PAYMOB_HMAC_SECRET` and `PAYMOB_INTEGRATION_ID`. The public key is stored server-side for deployment/configuration simplicity; it is not an authorization secret. `PAYMOB_INTEGRATION_ID` is configuration, not a password.

To configure an isolated Sandbox project, first create a separate Firebase project, enable Realtime Database, Authentication, Storage, App Check, and Functions, and associate billing as required for deployed Cloud Functions. Install/use Node.js 20 or newer. Then run these commands in PowerShell, entering the Sandbox values only at the Firebase CLI's secure prompts:

```powershell
$StagingProjectId = Read-Host "Sandbox Firebase Project ID"
if ($StagingProjectId -eq "sahty-27e33") { throw "Refusing to configure the production project." }
npx firebase --project $StagingProjectId functions:secrets:set PAYMOB_SECRET_KEY
npx firebase --project $StagingProjectId functions:secrets:set PAYMOB_PUBLIC_KEY
npx firebase --project $StagingProjectId functions:secrets:set PAYMOB_INTEGRATION_ID
npx firebase --project $StagingProjectId functions:secrets:set PAYMOB_HMAC_SECRET
```

Enter values only when prompted by the CLI; do not pass them as command-line arguments or paste them into chat. Do not run any command with `sahty-27e33`. Configure the Sandbox merchant's callback/webhook URL to the deployed Sandbox `paymobWebhook` URL and use the Sandbox Web App settings in a local `.env` (including its App Check site key); do not reuse production Firebase values. A connected Sandbox checkout requires deploying only the two payment Functions to that explicitly selected Sandbox project:

```powershell
npx firebase --project $StagingProjectId deploy --only functions:startPaymobPayment,functions:paymobWebhook
```

That command is provided for you to run after reviewing the Sandbox setup; it was **not** run as part of this change. It does not deploy Hosting, Database Rules, or production Functions. Any ambiguous intention still in `creating` must be reconciled in the Paymob Dashboard before a trusted operator decides whether a new attempt is safe.

Official Paymob documentation reviewed: [API integration flow](https://developers.paymob.com/paymob-docs/integration-paths/apis), [Create Intention API](https://developers.paymob.com/paymob-docs/developers/intention-apis/create-intention), [Unified Checkout redirection](https://developers.paymob.com/paymob-docs/developers/checkout-experiences/unified-checkout-redirection), [Webhook and HMAC overview](https://developers.paymob.com/paymob-docs/developers/webhook-callbacks-and-hmac/overview), and [HMAC verification](https://developers.paymob.com/paymob-docs/developers/webhook-callbacks-and-hmac/hmac). The current Create Intention reference documents the `Token` secret-key authorization, amount in cents, integration IDs, `special_reference` as `merchant_order_id` in the transaction callback, intention `client_secret`, and the card-only limitation for a request-supplied `notification_url`. The merchant-specific Sandbox credentials, callback configuration, and actual callback payload still require verification in the merchant portal before accepting payments.

No Paymob secret values were supplied, no gateway request was made, and no Firebase configuration or deployment was changed. A sandbox test must exercise checkout, successful and failed HMAC callbacks, duplicate callbacks, mismatched amounts/references, and payment retry before the integration can be considered working. App Check must also be configured in the client before callable Functions can be exercised outside the emulator.

After a paid appointment is confirmed, the assigned patient and doctor can exchange append-only messages at `conversations/{appointmentId}/messages`. RTDB rules restrict access to those two participants, and deny edits, deletion, and access to unpaid appointments.

An active verified doctor can issue one prescription for a paid appointment through the `createPrescription` callable Function. The server derives the patient and doctor from the stored appointment, and RTDB rules do not grant browser clients permission to create prescriptions. Patients can view and print their prescription list or use the browser's print dialog to save it as PDF.

The database contains access rules for call signaling, but the application does not yet implement a WebRTC call screen, call scheduling/rescheduling, or a TURN credential service. A TURN deployment and credentials are needed before video can be treated as production-ready. Nurse self-registration/application review is also not yet implemented.

The doctor invitation link is generated for the Firebase project running the Function, so staging invitations do not redirect applicants to the production Hosting site.

## Private Storage

Doctor-application identity documents are uploaded directly under `doctorApplications/{uid}/{fileName}` so they match the one-level private Storage rule. They are not public and can only be read by their owner or a trusted administrator. Doctor application uploads show per-file progress and begin as soon as a file is selected. Doctors can read Realtime Database records only when the record is linked to one of their bookings. Firebase Storage Rules cannot query Realtime Database, so attached patient files are currently readable only by that patient and an administrator; physician file access requires a trusted server that validates the booking and issues a short-lived download URL.

Cloud Storage for Firebase requires the project to have an active Blaze billing account before a bucket can be created. Review the billing terms and confirm the account before enabling Storage in a production project.

## Layout

- `src/components/` — shared layout
- `src/contexts/` — authentication and profile state
- `src/firebase/` — Firebase initialization, data access, and connection checks
- `src/pages/` — route screens
- `src/routes/` — protected and administrator route guards
- `src/types/` — domain types
- `database.rules.json`, `storage.rules` — Firebase security rules
