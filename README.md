# PROFESSIONAL DARK GRAPHIC DESIGN PORTFOLIO
### MUHAMMED SHIBILI — GRAPHIC DESIGNER & VISUAL STORYTELLER

A luxury dark-themed graphic design portfolio website combining **Luxury Creative Studio Aesthetics + Editorial Magazine Layout + Digital Art Archive**, featuring a public portfolio and an admin dashboard.

---

## ⚡ QUICK START (RUN LOCALLY)

The application is fully built, migrated, seeded, and ready to run.

### 1. Start Development Server
Run the following command in terminal:
```bash
npm run dev
```
Open your browser at:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 ADMIN DASHBOARD ACCESS

The Admin Dashboard allows full control over projects, stories, media uploads, categories, and theme settings.

- **Admin Login URL**: `http://localhost:3000/admin/login`
- **Default Email**: `admin@shibili.design`
- **Default Password**: `admin123456`

---

## 🗂️ APPLICATION STRUCTURE & URL ROUTING

| Page | URL Route | Description |
| :--- | :--- | :--- |
| **Homepage** | `/` | Cinematic Hero, Selected Works asymmetric grid, Latest Story, Services hover preview, Contact CTA |
| **Works Archive** | `/works` | All works gallery with live category filter bar and search input |
| **Work Detail** | `/works/[slug]` | Individual project case study with Overview, Challenge, Approach, Outcome & Gallery |
| **Stories / Essays** | `/stories` | Editorial numbered list of design essays with hover cover image reveal |
| **Story Detail** | `/stories/[slug]` | Full rich article page for design philosophy and process breakdowns |
| **About** | `/about` | Philosophy statement ("DESIGN IS NOT DECORATION. IT IS COMMUNICATION."), bio, Experience, Services, Tools, Approach |
| **Contact** | `/contact` | Project inquiry form, direct email, and social links |
| **Admin Login** | `/admin/login` | Secure JWT authentication portal |
| **Admin Overview** | `/admin` | Dashboard statistics (Total Works, Featured Works, Stories, Drafts) |
| **Manage Works** | `/admin/works` | Create, edit, publish/unpublish, feature, duplicate, and delete projects |
| **Manage Stories** | `/admin/stories` | Create, edit, draft, and publish editorial essays |
| **Media Library** | `/admin/media` | Upload files with drag-and-drop, automated Sharp AVIF/WebP optimization & blur data placeholders |
| **Categories** | `/admin/categories` | Manage project category taxonomy |
| **Settings** | `/admin/settings` | Dynamic Accent Color picker (`#C8FF3D`), Availability status toggle, designer metadata |

---

## 🔥 CONNECTING TO FIREBASE

The application comes pre-configured with **Firebase** SDK support (`firebase` & `firebase-admin`).

### Firebase Setup (Auth / Firestore / Cloud Storage)

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Register a Web App (`</>`) in your Firebase Console project settings to obtain your `firebaseConfig`.
3. Add your keys to `.env`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-app-id"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-app.appspot.com"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
   NEXT_PUBLIC_FIREBASE_APP_ID="1:1234567890:web:abcdef123456"
   ```
4. Firebase clients are exported and ready to use in `src/lib/firebase.ts` and `src/lib/firebaseAdmin.ts`.
5. For a complete guide, check [FIREBASE_SETUP.md](file:///c:/Users/USER/OneDrive/Desktop/Websites/GDPortfolio/FIREBASE_SETUP.md).

---

## 🛠️ USEFUL COMMANDS

| Action | Command |
| :--- | :--- |
| **Start Local Server** | `npm run dev` |
| **Build for Production** | `npm run build` |
| **Start Production Build** | `npm start` |
| **Push Database Schema** | `npx prisma db push` |
| **Seed Initial Sample Data** | `npx prisma db seed` |
| **Generate Prisma Client** | `npx prisma generate` |

---

## 🎨 DESIGN SYSTEM TOKENS

- **Primary Background**: `#0A0A0A`
- **Secondary Background**: `#111111`
- **Surfaces**: `#0D0D0D`, `#121212`, `#161616`, `#181818`
- **Primary Text**: `#F5F5F5`
- **Secondary Text**: `#9A9A9A`
- **Borders**: `#262626` / `rgba(255, 255, 255, 0.08)`
- **Accent Color**: `#C8FF3D` (lime/chartreuse, customizable via Admin Settings)
