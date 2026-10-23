# 🛡️ Founder & Platform Admin API Endpoints Reference

> **Base URL:** `http://localhost:3000/v1/api/admin` (or configured via `VITE_API_BASE_URL` in `.env`)  
> **Auth Strategy:** Requires valid Bearer JWT where `req.user.is_admin === true` (`role: 'founder' | 'admin'`).

---

## 📑 Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/v1/api/admin/overview` | Platform-wide stats (total users, businesses, reviews, pending reports) |
| `GET` | `/v1/api/admin/businesses` | Central businesses queue with filter (`status: unverified, verified, all`), search, & pagination |
| `PATCH` | `/v1/api/admin/business/:id/verify` | Grant or revoke official verified badge for any business |
| `DELETE` | `/v1/api/admin/business/:id` | Force delete any fraudulent or spam business globally |
| `GET` | `/v1/api/admin/reports` | View all flagged reports submitted across all businesses |
| `DELETE` | `/v1/api/admin/review/:reviewId` | Force delete any toxic/abusive review across the platform |
| `POST` | `/v1/api/admin/category` | Add a new business category |
| `PATCH` | `/v1/api/admin/category/:id` | Update / edit business category name or icon |
| `DELETE` | `/v1/api/admin/category/:id` | Delete a business category |
| `GET` | `/v1/api/admin/admins` | List all platform administrators and founders |
| `POST` | `/v1/api/admin/promote` | Promote an email to platform admin directly in the database |
| `DELETE` | `/v1/api/admin/admins/:email` | Revoke admin access for an account |
| `GET` | `/v1/api/admin/users` | List and search registered users with cursor pagination |
| `PATCH` | `/v1/api/admin/user/:id/ban` | Ban or unban user account (blocks access immediately) |

---

## 1. Platform Overview
### `GET /v1/api/admin/overview`

Returns high-level platform statistics and recent business registrations and reports.

* **Headers:** `Authorization: Bearer <access_token>`
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Platform overview retrieved successfully.",
    "founder": {
      "email": "faboradanathaniel@gmail.com",
      "role": "founder"
    },
    "data": {
      "stats": {
        "total_users": 1420,
        "total_businesses": 215,
        "total_reviews": 3840,
        "pending_reports": 6
      },
      "recent_businesses": [
        {
          "id": "7b8e1f24-...",
          "name": "Kape Balangay",
          "slug": "kape-balangay-89412",
          "category": "Food & Beverage",
          "is_verified": true,
          "total_reviews": 45,
          "average_rating": 4.8,
          "created_at": "2026-10-14T08:30:00.000Z"
        }
      ],
      "recent_reports": [
        {
          "id": "rep-abc-123",
          "review_id": "rev-12345",
          "business_id": "7b8e1f24-...",
          "reason": "spam",
          "status": "pending",
          "created_at": "2026-10-14T09:00:00.000Z"
        }
      ]
    }
  }
  ```

---

## 2. Admin Businesses Queue
### `GET /v1/api/admin/businesses`

Lists platform businesses for administrative verification, moderation, and auditing.

* **Headers:** `Authorization: Bearer <access_token>`
* **Query Parameters:**
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `status` | string | No | Filter by verification: `all` (default), `unverified`, or `verified` |
  | `search` | string | No | Search query for business name or slug |
  | `limit` | number | No | Number of records to return (Default: 20, Max: 100) |
  | `cursor` | string | No | `created_at` timestamp for cursor pagination |

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Admin businesses fetched successfully.",
    "data": [
      {
        "id": "7b8e1f24-...",
        "name": "Kape Balangay",
        "slug": "kape-balangay-89412",
        "category": "Food & Beverage",
        "is_verified": false,
        "total_reviews": 0,
        "average_rating": 0,
        "user_id": "user-uuid...",
        "phone": "+63 917 123 4567",
        "website": "https://kapebalangay.ph",
        "created_at": "2026-10-22T08:00:00.000Z"
      }
    ],
    "pagination": {
      "limit": 20,
      "has_more": false,
      "next_cursor": null
    }
  }
  ```

---

## 3. Verify or Unverify Business
### `PATCH /v1/api/admin/business/:id/verify`

Toggles the official `is_verified` badge on any business.

* **Headers:** `Authorization: Bearer <access_token>`
* **Request Body:**
  ```json
  {
    "is_verified": true
  }
  ```
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Business verified successfully.",
    "data": {
      "id": "7b8e1f24-...",
      "name": "Kape Balangay",
      "is_verified": true
    }
  }
  ```

---

## 4. Delete Business (Admin Override)
### `DELETE /v1/api/admin/business/:id`

Permanently deletes a fraudulent business and cascades all reviews and Cloudinary media assets.

* **Headers:** `Authorization: Bearer <access_token>`
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Business deleted by admin successfully."
  }
  ```

---

## 5. View Global Reports
### `GET /v1/api/admin/reports`

Retrieves all flagged reports across all platform businesses.

* **Headers:** `Authorization: Bearer <access_token>`
* **Query Parameters:**
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `status` | string | No | Filter by status (`all`, `pending`, `resolved`, `dismissed`) |
  | `limit` | number | No | Number of reports (Default: 50, Max: 100) |

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "All platform reports fetched successfully.",
    "data": [
      {
        "id": "rep-abc-123",
        "reason": "offensive",
        "details": "Contains profanity.",
        "status": "pending",
        "reporter_ip": "192.168.1.1",
        "created_at": "2026-10-14T09:00:00.000Z",
        "business": { "id": "...", "name": "Kape Balangay", "slug": "kape-balangay" },
        "review": { "id": "...", "name": "Spammer", "comment": "..." }
      }
    ]
  }
  ```

---

## 6. Delete Review (Admin Override)
### `DELETE /v1/api/admin/review/:reviewId`

Moderator action to delete any toxic review anywhere on the platform.

* **Headers:** `Authorization: Bearer <access_token>`
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Review deleted by admin successfully."
  }
  ```

---

## 7. Add Category
### `POST /v1/api/admin/category`

Adds a new business category. Automatically generates a clean URL slug.

* **Headers:** `Authorization: Bearer <access_token>`
* **Request Body:**
  ```json
  {
    "name": "Automotive & Transport",
    "icon": "car"
  }
  ```
* **Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Category added successfully.",
    "data": {
      "id": "cat-uuid...",
      "name": "Automotive & Transport",
      "slug": "automotive-transport",
      "icon": "car"
    }
  }
  ```

---

## 8. Edit / Update Category
### `PATCH /v1/api/admin/category/:id`

Updates an existing business category name and/or icon.

* **Headers:** `Authorization: Bearer <access_token>`
* **Request Body:**
  ```json
  {
    "name": "Automotive & Car Repair",
    "icon": "wrench"
  }
  ```
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Category updated successfully.",
    "data": {
      "id": "cat-uuid...",
      "name": "Automotive & Car Repair",
      "slug": "automotive-car-repair",
      "icon": "wrench"
    }
  }
  ```

---

## 9. Delete Category
### `DELETE /v1/api/admin/category/:id`

Deletes a business category by ID.

* **Headers:** `Authorization: Bearer <access_token>`
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Category deleted successfully.",
    "data": {
      "id": "cat-uuid..."
    }
  }
  ```

---

## 10. List Platform Admins
### `GET /v1/api/admin/admins`

Retrieves all users with platform administrative roles (`founder` or `admin`).

* **Headers:** `Authorization: Bearer <access_token>`
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Platform administrators fetched successfully.",
    "data": [
      {
        "email": "faboradanathaniel@gmail.com",
        "role": "founder",
        "created_at": "2026-10-01T00:00:00.000Z"
      }
    ]
  }
  ```

---

## 11. Promote User to Admin
### `POST /v1/api/admin/promote`

Founder action to grant platform admin access to an email address.

* **Headers:** `Authorization: Bearer <access_token>`
* **Request Body:**
  ```json
  {
    "email": "co-founder@gmail.com",
    "role": "admin"
  }
  ```
* **Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Account 'co-founder@gmail.com' granted 'admin' privileges successfully.",
    "data": {
      "email": "co-founder@gmail.com",
      "role": "admin"
    }
  }
  ```

---

## 12. Revoke Admin Privileges
### `DELETE /v1/api/admin/admins/:email`

Revokes admin access for an email address, reverting role to regular user. Cannot revoke own access.

* **Headers:** `Authorization: Bearer <access_token>`
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Administrator access for 'co-founder@gmail.com' has been revoked successfully.",
    "data": {
      "email": "co-founder@gmail.com"
    }
  }
  ```

---

## 13. List & Search Users
### `GET /v1/api/admin/users`

User management directory with search and cursor pagination.

* **Headers:** `Authorization: Bearer <access_token>`
* **Query Parameters:**
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `search` | string | No | Search email or full name |
  | `role` | string | No | Filter by role (`all`, `user`, `admin`, `founder`, `banned`) |
  | `limit` | number | No | Records to return (Default: 20, Max: 100) |
  | `cursor` | string | No | `created_at` timestamp for infinite scroll |

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Users fetched successfully.",
    "data": [
      {
        "id": "e69d0d34-...",
        "email": "customer@gmail.com",
        "full_name": "Juan Dela Cruz",
        "avatar_url": "https://...",
        "role": "user",
        "created_at": "2026-10-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "limit": 20,
      "has_more": false,
      "next_cursor": null
    }
  }
  ```

---

## 14. Ban or Unban User
### `PATCH /v1/api/admin/user/:id/ban`

Suspends or reinstates a user account. When banned, the API's `authenticate` middleware immediately rejects further requests with HTTP 403.

* **Headers:** `Authorization: Bearer <access_token>`
* **Request Body:**
  ```json
  {
    "is_banned": true
  }
  ```
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "User 'customer@gmail.com' has been banned and suspended.",
    "data": {
      "id": "e69d0d34-...",
      "email": "customer@gmail.com",
      "role": "banned"
    }
  }
  ```
