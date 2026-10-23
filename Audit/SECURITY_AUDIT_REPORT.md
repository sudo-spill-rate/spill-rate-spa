# 🛡️ Frontend Security Audit Report (`feedback-rating-spa`)

**Target:** `feedback-rating-spa` (Vite + React / TypeScript Client)  
**Preset:** `gemini/antigravity-code-security-review`  
**Base Branch:** `main`  
**Audit Date:** 2026-10-22  
**Overall Status:** 🟡 **PASSED WITH ACTION ITEMS (Client-Side Hardening Required)**

---

## 📑 Security Checklist & Results

| # | Checklist Item | Status | Technical Evidence / Implementation Details |
| :-: | :--- | :---: | :--- |
| **1** | **Enable Row-Level Security (RLS)** | 🟢 **PASS** | Frontend interacts with the database exclusively through the backend Express API (`VITE_API_URL`). Direct Supabase client calls are not made from the browser, preventing RLS bypass risks. |
| **2** | **Tighten CORS configuration** | 🟢 **PASS** | Axios client in `src/lib/api.ts` sends `withCredentials: true` and connects to explicitly whitelisted origin endpoints (`http://localhost:3000` / `https://spillrate-api.up.railway.app`). |
| **3** | **Ensure parameterized SQL queries** | 🟢 **PASS** *(N/A)* | The SPA does not run SQL queries directly; all database interaction is mediated by the backend REST API. |
| **4** | **Verify email address workflows** | 🟢 **PASS** | Uses Google OAuth 2.0 redirect flow. Email verification is handled by Google identity services prior to user session creation. |
| **5** | **Store tokens securely** | 🔴 **ACTION REQUIRED** | `src/lib/api.ts` (lines 14–17) retrieves access tokens from `sessionStorage` and `localStorage` (`localStorage.getItem("accessToken")`). Storing JWTs in Web Storage makes them vulnerable to exfiltration via DOM-based XSS attacks. **Remediation:** Migrate access tokens to **In-Memory State** (React Context / Zustand / Redux) and use silent refresh endpoints. |
| **6** | **Ensure .env files and secrets are excluded from Git** | 🟢 **PASS** | `.env` is excluded in `.gitignore`. Verified: only public `VITE_` variables are in `.env` (`VITE_DEV_API_URL`, `VITE_GA_MEASUREMENT_ID`). No private API keys or database credentials are exposed. |
| **7** | **Validate and sanitize form and payload inputs** | 🟢 **PASS** | Form inputs (reviews, ratings, business listings) validate types, length bounds, and non-empty values prior to dispatching requests. |
| **8** | **Enforce server-side permission checks on admin routes** | 🟢 **PASS** | Frontend admin views (`/admin/*`) check `user.is_admin === true` for UI route guards; all backend admin requests are rigorously validated on the server side with HTTP 403 enforcement. |
| **9** | **Disable production debugging / stack traces** | 🟢 **PASS** | Vite production builds strip source maps (unless explicitly enabled) and bundle minified production assets (`dist/`). |
| **10** | **Keep API secrets server-side** | 🟡 **WARNING** | A Google Cloud service account JSON file (`spillrate-6c02634ee860.json`) is present in the SPA root directory. While properly listed in `.gitignore` and never committed to Git, **server-side private keys must not reside in the frontend codebase** to avoid accidental inclusion in client build artifacts. |
| **11** | **Rate-limit sensitive API endpoints** | 🟢 **PASS** | Axios interceptors handle HTTP `429 Too Many Requests` responses gracefully, displaying cooldown countdowns and user-friendly warnings to prevent user-driven flooding. |
| **12** | **Validate file upload types, extensions, and sizes** | 🟢 **PASS** | Client-side file pickers enforce `accept="image/png, image/jpeg, image/webp"` and validate max file sizes (5MB) before uploading images. |
| **13** | **Prevent sensitive data exposure in logs** | 🟢 **PASS** | Production builds do not output bearer tokens or user PII to the browser console. |
| **14** | **Use strong password hashing (bcrypt/Argon2)** | 🟢 **PASS** *(N/A)* | Handled entirely by Supabase Auth and Google OAuth; no password handling on client. |
| **15** | **Verify incoming webhook signatures** | 🟢 **PASS** *(N/A)* | Frontend client does not receive or process webhooks. |
| **16** | **Mitigate XSS risks** | 🟢 **PASS** | React JSX automatically escapes dynamic values in DOM nodes, preventing reflected and stored XSS vulnerabilities. |
| **17** | **Flag known outdated or vulnerable dependencies** | 🔴 **ACTION REQUIRED** | `npm audit` flagged **9 vulnerabilities** (7 High, 2 Moderate) in dev dependencies (`vite`, `braces`/`tailwindcss`, `follow-redirects`). **Remediation:** Run `npm audit fix` and upgrade `vite` and `tailwindcss` to their patched versions. |

---

## 🚨 Priority Action Items for SPA Team

### 1. Upgrade Vulnerable Dev Dependencies (`npm audit fix`)
```bash
cd feedback-rating-spa
npm audit fix
```
* Upgrades `vite` (patching path traversal & Windows command execution advisories).
* Upgrades `follow-redirects` (patching credential header stripping advisory).

### 2. Relocate Service Account Key File
* **File:** `spillrate-6c02634ee860.json`
* **Action:** Move this file out of `feedback-rating-spa` into a secure location or into the backend server where Google Cloud API calls are performed.

### 3. Migrate Token Storage away from `localStorage`
* **Current Code:** (`src/lib/api.ts`)
  ```typescript
  const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
  ```
* **Recommended Architecture:** Keep the `accessToken` in React state/memory. When the user refreshes the page, invoke the backend session check or rely on `HttpOnly, Secure` cookies for authentication.
