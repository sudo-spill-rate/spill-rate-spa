# 🔐 Authentication API Endpoints Reference

> **Base URL:** `http://localhost:3000/v1/api/auth` (or configured via `VITE_API_BASE_URL` in `.env`)  
> **Auth Strategy:** Supabase Google OAuth 2.0 with Bearer JWT tokens.

---

## 📑 Endpoints Overview

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/v1/api/auth/callback` | Public | Exchange Google OAuth code for session & sync profile |
| `GET` | `/v1/api/auth/me` | Authenticated | Get currently authenticated user profile & role |
| `PATCH` | `/v1/api/auth/profile` | Authenticated | Update user profile details |
| `POST` | `/v1/api/auth/logout` | Authenticated | Terminate session on Supabase Auth |
| `DELETE` | `/v1/api/auth/account` | Authenticated | Delete account & cascade delete owned businesses |

---

## 1. Exchange OAuth Code for Session
### `GET /v1/api/auth/callback`

Exchanges the temporary OAuth authorization `code` returned by Google into a Supabase session. Automatically synchronizes user profile into the `profiles` table and detects if user is in `platform_admins` to assign role (`founder`, `admin`, or `user`).

* **Query Parameters:**
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `code` | string | Yes | Authorization code returned by Google OAuth redirect |

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Authentication successful",
    "data": {
      "session": {
        "access_token": "eyJhbGciOi...",
        "refresh_token": "...",
        "expires_in": 3600
      },
      "user": {
        "id": "e8a1b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
        "email": "user@example.com",
        "user_metadata": {
          "full_name": "Juan Dela Cruz",
          "avatar_url": "https://lh3.googleusercontent.com/a/..."
        }
      }
    }
  }
  ```

---

## 2. Get Current Authenticated Profile
### `GET /v1/api/auth/me`

Retrieves the authenticated profile, role, and admin status of the currently logged-in user.

* **Headers:**  
  `Authorization: Bearer <access_token>`

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "user": {
      "id": "e8a1b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
      "email": "faboradanathaniel@gmail.com",
      "name": "Nathaniel Faborada",
      "avatar_url": "https://lh3.googleusercontent.com/a/...",
      "provider": "google",
      "role": "founder",
      "is_admin": true
    }
  }
  ```

* **Response (`401 Unauthorized`):**
  ```json
  {
    "success": false,
    "message": "Unauthorized: Bearer token is required"
  }
  ```

---

## 3. Update Profile
### `PATCH /v1/api/auth/profile`

Updates the user's name, avatar URL, or phone number. Automatically synchronizes with Supabase Auth metadata and the `public.profiles` table.

* **Headers:**  
  `Authorization: Bearer <access_token>`  
  `Content-Type: application/json`

* **Request Body:**
  ```json
  {
    "name": "Nathaniel F.",
    "avatar_url": "https://res.cloudinary.com/.../new-avatar.jpg",
    "phone": "+63 917 123 4567"
  }
  ```

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Profile updated successfully.",
    "user": {
      "id": "e8a1b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
      "email": "faboradanathaniel@gmail.com",
      "name": "Nathaniel F.",
      "avatar_url": "https://res.cloudinary.com/.../new-avatar.jpg"
    }
  }
  ```

---

## 4. Logout
### `POST /v1/api/auth/logout`

Revokes the user's session token on Supabase Auth.

* **Headers:**  
  `Authorization: Bearer <access_token>`

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

---

## 5. Delete Account
### `DELETE /v1/api/auth/account`

Permanently deletes the authenticated user's account from Supabase Auth and cascade deletes all owned businesses and reviews.

* **Headers:**  
  `Authorization: Bearer <access_token>`

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Account and all associated businesses and reviews deleted successfully."
  }
  ```
