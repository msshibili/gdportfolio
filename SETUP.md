# PORTFOLIO SETUP GUIDE

## 1. Quick Start
```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Run initial database migration & seed (if setting up fresh)
npx prisma db push
npx prisma db seed

# 3. Start local server
npm run dev
```

Visit:
- **Public Site**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 2. Admin Credentials
- **Email**: `admin@shibili.design`
- **Password**: `admin123456`

---

## 3. Database & Services (Firebase / Local SQLite)
- **Local Development**: SQLite (`prisma/dev.db`) is active for local relational database operations.
- **Firebase Integration**: Firebase Client SDK & Admin SDK are configured (`src/lib/firebase.ts` & `src/lib/firebaseAdmin.ts`). Add your Firebase keys in `.env` to connect to Firebase Firestore, Auth, and Storage. See [FIREBASE_SETUP.md](file:///c:/Users/USER/OneDrive/Desktop/Websites/GDPortfolio/FIREBASE_SETUP.md) for details.
