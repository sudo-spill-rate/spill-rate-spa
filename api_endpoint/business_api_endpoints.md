# 🏢 Business API Endpoints Reference

> **Base URL:** `http://localhost:3000/v1/api` (or configured via `VITE_API_BASE_URL` in `.env`)  
> **Backend Service:** Express 5 + Supabase PostgreSQL + Cloudinary

---

## 📑 Endpoints Overview

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/v1/api/businesses` | Public | List all businesses with cursor pagination, category filter & search |
| `GET` | `/v1/api/businesses/:slug` | Public | Get single business by slug or ID with star rating breakdown |
| `GET` | `/v1/api/categories` | Public | List all available business categories |
| `POST` | `/v1/api/business` | Authenticated | Create a new business with logo/image upload |
| `GET` | `/v1/api/business/owner` | Authenticated | List all businesses owned by current user |
| `PATCH` | `/v1/api/business/:id` | Authenticated (Owner) | Update business information and optional image replacement |
| `DELETE` | `/v1/api/business/:id` | Authenticated (Owner) | Delete business, associated reviews, and Cloudinary assets |
| `GET` | `/v1/api/business/:id/analytics` | Authenticated (Owner) | Comprehensive business owner analytics dashboard metrics |
| `GET` | `/v1/api/business/:id/reviews/export` | Authenticated (Owner) | Export all reviews to downloadable CSV file |

---

## 1. List All Businesses (Directory)
### `GET /v1/api/businesses`

Public directory listing registered businesses with keyword search, category filter, and cursor-based infinite scrolling.

* **Query Parameters:**
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `limit` | number | No (Default: 10, Max: 50) | Number of records to return |
  | `cursor` | string | No | `created_at` timestamp from previous page for infinite scroll |
  | `category` | string | No | Case-insensitive category filter |
  | `search` | string | No | Search query matching business name |
  | `user_id` | string | No | Filter businesses by owner UUID |

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "7b8e1f24-3a5c-4e89-91a2-c48d95123456",
        "name": "Kape Balangay",
        "description": "Artisanal coffee shop serving local beans.",
        "slug": "kape-balangay-00001",
        "image_url": "https://res.cloudinary.com/.../logo.png",
        "category": "Food & Beverage",
        "address": "123 Rizal St., Poblacion, Makati City",
        "phone": "+63 917 123 4567",
        "website": "https://kapebalangay.ph",
        "is_verified": true,
        "total_reviews": 128,
        "average_rating": 4.8,
        "created_at": "2026-10-01T08:30:00.000Z"
      }
    ],
    "pagination": {
      "limit": 10,
      "has_more": true,
      "next_cursor": "2026-10-01T08:30:00.000Z"
    }
  }
  ```

---

## 2. Get Single Business Details
### `GET /v1/api/businesses/:slug`

Fetches business details and star rating breakdown by slug or UUID.

* **URL Parameters:**
  * `:slug` – Business slug (e.g. `kape-balangay-00001`) or business UUID.

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "id": "7b8e1f24-3a5c-4e89-91a2-c48d95123456",
      "name": "Kape Balangay",
      "description": "Artisanal coffee shop.",
      "slug": "kape-balangay-00001",
      "image_url": "https://res.cloudinary.com/.../logo.png",
      "category": "Food & Beverage",
      "address": "123 Rizal St., Makati",
      "phone": "+63 917 123 4567",
      "website": "https://kapebalangay.ph",
      "is_verified": true,
      "total_reviews": 45,
      "average_rating": 4.6,
      "rating_breakdown": {
        "5": 30,
        "4": 10,
        "3": 3,
        "2": 1,
        "1": 1
      },
      "created_at": "2026-10-01T08:30:00.000Z"
    }
  }
  ```

---

## 3. Get Business Categories
### `GET /v1/api/categories`

Returns all active categories from the database.

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "c1a2b3c4-...",
        "name": "Food & Beverage",
        "slug": "food-beverage",
        "icon": "utensils"
      },
      {
        "id": "c2b3c4d5-...",
        "name": "Technology",
        "slug": "technology",
        "icon": "cpu"
      }
    ]
  }
  ```

---

## 4. Create Business
### `POST /v1/api/business`

Registers a new business under the authenticated user. Maximum 5 businesses allowed per owner. Rate limited via IP protection.

* **Headers:**  
  `Authorization: Bearer <access_token>`  
  `Content-Type: multipart/form-data`

* **Form Fields:**
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `name` | string | Yes | 2-100 characters |
  | `category` | string | Yes | Category name |
  | `description` | string | No | Maximum 300 characters |
  | `address` | string | No | Physical address |
  | `phone` | string | No | Contact number |
  | `website` | string | No | Website URL |
  | `image` (or `logo` / `file`) | file | No | JPEG, PNG, or WebP (max 5MB) |

* **Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Business created successfully.",
    "data": {
      "id": "7b8e1f24-3a5c-4e89-91a2-c48d95123456",
      "name": "Kape Balangay",
      "slug": "kape-balangay-89412",
      "category": "Food & Beverage",
      "image_url": "https://res.cloudinary.com/.../business/logo.jpg",
      "total_reviews": 0,
      "average_rating": 0
    }
  }
  ```

---

## 5. Get Owner Businesses
### `GET /v1/api/business/owner`

Returns all businesses owned by the authenticated user.

* **Headers:** `Authorization: Bearer <access_token>`
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "7b8e1f24-3a5c-4e89-91a2-c48d95123456",
        "name": "Kape Balangay",
        "slug": "kape-balangay-89412",
        "total_reviews": 24,
        "average_rating": 4.7
      }
    ]
  }
  ```

---

## 6. Update Business
### `PATCH /v1/api/business/:id`

Updates business fields and replaces image in Cloudinary if a new file is uploaded.

* **Headers:**  
  `Authorization: Bearer <access_token>`  
  `Content-Type: multipart/form-data` or `application/json`

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Business updated successfully.",
    "data": { "id": "7b8e1f24...", "name": "Kape Balangay Updated" }
  }
  ```

---

## 7. Delete Business
### `DELETE /v1/api/business/:id`

Deletes the business, removes its Cloudinary image, and cascades deletion to all associated customer reviews.

* **Headers:** `Authorization: Bearer <access_token>`
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Business and its associated reviews deleted successfully."
  }
  ```

---

## 8. Business Owner Analytics Dashboard
### `GET /v1/api/business/:id/analytics`

Provides deep reputation analytics, rating distributions, monthly trends, and review response rates. Computed in Node.js backend.

* **Headers:** `Authorization: Bearer <access_token>`
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Business analytics retrieved successfully.",
    "data": {
      "business": {
        "id": "7b8e1f24-3a5c-4e89-91a2-c48d95123456",
        "name": "Kape Balangay",
        "slug": "kape-balangay-89412",
        "created_at": "2026-10-01T08:30:00.000Z"
      },
      "summary": {
        "total_reviews": 120,
        "average_rating": 4.7,
        "public_reviews": 115,
        "private_reviews": 5,
        "pinned_reviews": 3,
        "last_30_days_count": 28
      },
      "response_metrics": {
        "replied_count": 96,
        "pending_reply_count": 24,
        "response_rate_percent": 80.0
      },
      "rating_distribution": {
        "5": { "count": 85, "percentage": 70.8 },
        "4": { "count": 25, "percentage": 20.8 },
        "3": { "count": 6, "percentage": 5.0 },
        "2": { "count": 2, "percentage": 1.7 },
        "1": { "count": 2, "percentage": 1.7 }
      },
      "monthly_trends": [
        { "month": "2026-08", "reviews": 35, "average_rating": 4.6 },
        { "month": "2026-09", "reviews": 42, "average_rating": 4.8 },
        { "month": "2026-10", "reviews": 43, "average_rating": 4.7 }
      ]
    }
  }
  ```

---

## 9. Export Reviews to CSV
### `GET /v1/api/business/:id/reviews/export`

Exports all business reviews into a downloadable `.csv` file.

* **Headers:** `Authorization: Bearer <access_token>`
* **Response (`200 OK`):**
  * **Content-Type:** `text/csv; charset=utf-8`
  * **Content-Disposition:** `attachment; filename="kape-balangay-reviews-2026-10-14.csv"`
