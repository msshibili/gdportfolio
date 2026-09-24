# 🔥 STEP-BY-STEP FIREBASE CONNECTION & SETUP GUIDE

This guide walks you through connecting your **Graphic Design Portfolio (`GDPortfolio`)** to **Firebase** (Authentication, Firestore Database, and Firebase Cloud Storage).

---

## 🛠️ STEP 1: CREATE A FREE FIREBASE PROJECT

1. Open **[https://console.firebase.google.com](https://console.firebase.google.com)** in your browser.
2. Log in with your Google account.
3. Click **Add project** (or **Create a project**).
4. Enter your project name (e.g. `GDPortfolio`).
5. (Optional) Toggle Google Analytics off or on, then click **Create project**.
6. Wait for setup to finish, then click **Continue**.

---

## 🔑 STEP 2: REGISTER A WEB APP & GET FIREBASE CREDENTIALS

1. In your Firebase Console project overview, click the **Web icon (`</>`)** to add a web app.
2. Enter an app nickname (e.g. `GDPortfolio-Web`).
3. Click **Register app**.
4. You will see your `firebaseConfig` object looking like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
```

---

## 📝 STEP 3: UPDATE YOUR `.env` FILE

Open the `.env` file in the root of your project and paste your Firebase credentials into the variables:

```env
# ==========================================
# FIREBASE CONFIGURATION
# ==========================================
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
NEXT_PUBLIC_FIREBASE_APP_ID="1:1234567890:web:abcdef123456"
```

---

## 🔒 STEP 4: (OPTIONAL) FIREBASE ADMIN SERVICE ACCOUNT

If you need server-side admin operations using Firebase Admin SDK:
1. Go to **Project Settings (⚙️ icon)** > **Service accounts** tab in Firebase Console.
2. Click **Generate new private key**.
3. Download the `.json` key file.
4. Copy the entire JSON content into your `.env` file:

```env
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id",...}'
```

---

## ⚡ USING FIREBASE IN YOUR APP

Your Firebase connection modules are ready in `src/lib/`:

### Client SDK (`src/lib/firebase.ts`)
```typescript
import { db, auth, storage } from "@/lib/firebase";

// Example Firestore query:
// const querySnapshot = await getDocs(collection(db, "projects"));
```

### Server Admin SDK (`src/lib/firebaseAdmin.ts`)
```typescript
import { adminDb, adminAuth, adminStorage } from "@/lib/firebaseAdmin";
```

---

## 🚀 STEP 5: TEST YOUR APP

Run the development server to verify everything works:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)!
