# ABASHON Employee Portal — Setup

These files are additive: `index.html` is untouched. Drop everything else
alongside it in your site's root.

## New files
```
employee-login.html
dashboard.html
project-entry.html
project-payments.html
assets/firebase-config.js
firestore.rules
storage.rules
functions/index.js
functions/package.json
```

## 1. Create the Firebase project
- console.firebase.google.com → Add project
- Enable: **Authentication** (Email/Password provider), **Firestore**
  (Native mode), **Storage**, **Hosting**, and **Functions** (requires the
  Blaze pay-as-you-go plan — free at this scale, but a card is required)

## 2. Fill in the placeholders
| File | Placeholder | Replace with |
|---|---|---|
| `assets/firebase-config.js` | `__PLACEHOLDER_*__` | Values from Project Settings → General → Your apps → SDK config |
| `project-entry.html` | `__PLACEHOLDER_SHEET_ID__` (iframe `src`) | Your Sheet's ID, from its URL |
| `functions/index.js` | `__PLACEHOLDER_SHEET_ID__` | Same Sheet ID |
| `functions/index.js` | `SHEET_RANGE` | Match your sheet's actual tab name / columns |

## 3. Create employee accounts
Firebase Console → Authentication → Users → Add user. No public sign-up
page exists on purpose — accounts are provisioned by an admin.

## 4. Google Sheets service account (for the Data Bridge)
1. Google Cloud Console (same project) → IAM & Admin → Service Accounts →
   Create service account.
2. Create a JSON key for it.
3. Open the target Google Sheet → Share → paste the service account's
   `client_email` → give it **Editor** access.
4. Store the key as function secrets (never commit the JSON file):
   ```
   firebase functions:secrets:set GOOGLE_SERVICE_ACCOUNT_EMAIL
   firebase functions:secrets:set GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
   ```

## 5. Deploy
```bash
npm install -g firebase-tools
firebase login
firebase init            # select Hosting, Firestore, Storage, Functions;
                          # point Hosting's public dir at your site root
cd functions && npm install && cd ..

firebase deploy --only firestore:rules,storage,functions,hosting
```

## Notes on the security model
- **Client-side auth checks** (`requireAuth()` in the protected pages) are
  UX only — instant redirect, no flash of protected content.
- **The real gate** is `firestore.rules` / `storage.rules`: every read and
  write is checked server-side against `request.auth`, independent of
  what the browser does.
- **The Sheets service-account key never reaches the browser** — only
  `functions/index.js`, running on Google's servers, holds it.
- **Voucher filenames are always server-generated** (`crypto.randomUUID()`
  + timestamp), not the employee's original filename — this is what
  prevents path traversal or filename collisions, independent of any
  client-side validation.
