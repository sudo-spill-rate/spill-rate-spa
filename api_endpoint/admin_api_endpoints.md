# 🛡️ Founder & Platform Admin API Endpoints Reference

> **Base URL:** `http://localhost:3000/v1/api/admin` (or configured via `VITE_API_BASE_URL` in `.env`)  
> **Auth Strategy:** Requires valid Bearer JWT where `req.user.is_admin === true` (`role: 'founder' | 'admin'`).

---

## 📑 Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/v1/api/admin/overview` | Platform-wide stats (total users, businesses, reviews, pending reports) |
| `PATCH` | `/v1/api/admin/business/:id/verify` | Grant or revoke official verified badge for any business |
| `DELETE` | `/v1/api/admin/business/:id` | Delete any fraudulent or spam business globally |
| `DELETE` | `/v1/api/admin/review/:reviewId` | Delete any toxic/abusive review across the platform |
| `GET` | `/v1/api/admin/reports` | View all flagged reports submitted across all businesses |
| `POST` | `/v1/api/admin/category` | Add a new business category |
| `DELETE` | `/v1/api/admin/category/:id` | Delete a business category |
| `POST` | `/v1/api/admin/promote` | Promote an email to platform admin directly in the database |

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

* **Response (`403 Forbidden`):**
  ```json
  {
    "success": false,
    "message": "Forbidden: Platform admin or founder access required."
  }
  ```

---

## 2. Verify or Unverify Business
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

## 3. Delete Business (Admin Override)
### `DELETE /v1/api/admin/business/:id`

Permanently deletes a fraudulent business and cascades reviews.

* **Headers:** `Authorization: Bearer <access_token>`
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Business deleted by admin successfully."
  }
  ```

---

## 4. Delete Review (Admin Override)
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

## 5. View Global Reports
### `GET /v1/api/admin/reports`

Retrieves all flagged reports across all platform businesses.

* **Headers:** `Authorization: Bearer <access_token>`
* **Query Parameters:**
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `status` | string | No | Filter by status (`all`, `pending`, `resolved`, `dismissed`) |
  | `limit` | number | No (Default: 50, Max: 100) | Number of reports |

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

## 6. Add Category
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

## 7. Delete Category
### `DELETE /v1/api/admin/category/:id`

Deletes a business category by ID.

* **Headers:** `Authorization: Bearer <access_token>`
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Category deleted successfully."
  }
  ```

---

## 8. Promote User to Admin
### `POST /v1/api/admin/promote`

Founder action to grant platform admin or founder access to an email directly in the `platform_admins` database table.

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
