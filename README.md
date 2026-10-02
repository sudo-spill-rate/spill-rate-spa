# 🚀 Feedback & Rating Platform (Frontend SPA)

A modern, responsive Single Page Application (SPA) built with **React**, **Vite**, **TypeScript**, **React Router v7**, **Tailwind CSS**, and **TanStack Query**.

---

## 📚 Documentation Links
* 📡 **[Full Backend API Endpoints Reference](./API_ENDPOINTS.md)** — Comprehensive documentation covering all API endpoints (`/auth`, `/businesses`, `/review`, and moderation).

---

## 🛠️ Tech Stack & Architecture
* **Framework:** React 19 + Vite
* **Routing:** React Router v7 (Modular route files: `Routes.auth.tsx`, `Routes.public.tsx`, `Routes.business.tsx`, `Routes.review.tsx`)
* **State & Data Fetching:** TanStack React Query (`@tanstack/react-query`) + React Context API
* **HTTP Client:** Axios (Custom configured instance with base URL `/v1/api` and token interceptors)
* **Styling:** Tailwind CSS + PostCSS
* **Backend:** Express 5 + Supabase PostgreSQL + Cloudinary

---

## 📂 Project Structure

```text
src/
├── context/               # React Context Providers (Auth, Business, Review, ManageReview)
├── hooks/                 # Custom React Hooks (useUserAuth, useBusinessProfile, useCustomerReviews, etc.)
├── lib/                   # API Axios client instance and utility helpers
├── pages/
│   ├── PublicPages/       # Landing, Directory, About, Contact, FAQ, Legal
│   ├── BusinessPages/     # Owner Dashboard, Business Profile, Moderation Hub
│   ├── ReviewPages/       # Public Business View, 1-5 Star Review Submission Form
│   └── SignIn/            # Google OAuth Login & Callback
├── routes/                # Modular route configs and ProtectedRoute guard
├── services/              # API Service layer (authService, businessService, reviewService, manageReviewService)
└── types/                 # Strict TypeScript models and API contracts
```

---

## 🚦 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables (`.env`):**
   ```env
   VITE_API_BASE_URL=http://localhost:3000/v1/api
   VITE_APP_URL=http://localhost:5173
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```
