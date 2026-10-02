# 📡 Backend API Endpoints Reference

> **Base URL:** `http://localhost:3000/v1/api` (Configured in `.env` as `VITE_API_BASE_URL`)  
> **Backend Service:** `feedback-rating-api` (Express 5 + Supabase PostgreSQL + Cloudinary)

---

## 📑 Table of Contents
1. [Authentication (`/auth`)](#1-authentication-auth)
2. [Businesses (`/businesses`, `/business`)](#2-businesses-businesses-business)
3. [Customer Reviews (`/review`)](#3-customer-reviews-review)
4. [Review Moderation & B2B Actions (`/review/:reviewId`)](#4-review-moderation--b2b-actions)
5. [System Limits & Error Codes](#5-system-limits--error-codes)
6. [Frontend Services & Hooks Mapping](#6-frontend-services--hooks-mapping)

---

## 1. Authentication (`/auth`)

All user sessions are authenticated via **Google OAuth 2.0**. Tokens are managed via HttpOnly session cookies or standard Bearer authorization headers.

### `GET /auth/google`
Initiates the Google OAuth login workflow and returns the Google consent redirect URL.

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=..."
  }
  ```

---

### `GET /auth/me`
Retrieves the authenticated profile of the currently logged-in user.

* **Headers:** `Cookie: session=...` or `Authorization: Bearer <token>`
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "user": {
      "id": "usr-8a2b3c4d-5e6f",
      "email": "owner@example.com",
      "name": "Maria Clara",
      "picture": "https://lh3.googleusercontent.com/a/..."
    }
  }
  ```
* **Response (`401 Unauthorized`):** No active session or token expired.

---

### `POST /auth/logout`
Terminates the current session and clears authentication cookies.

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

---

## 2. Businesses (`/businesses`, `/business`)

### `GET /businesses`
Public directory listing all registered businesses with support for keyword search, category filtering, and cursor-based pagination.

* **Query Parameters:**
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `limit` | number | No (Default: 10, Max: 50) | Number of businesses per page |
  | `cursor` | string | No | `created_at` timestamp of the last item from the previous page |
  | `category` | string | No | Filter by category (e.g., `Food & Beverage`, `Technology`) |
  | `search` | string | No | Case-insensitive keyword search matching business name |

* **Example Request:**
  `GET /v1/api/businesses?category=Food%20%26%20Beverage&search=kape&limit=10`

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "7b8e1f24-3a5c-4e89-91a2-c48d95123456",
        "name": "Kape Balangay",
        "description": "Artisanal coffee shop and breakfast spot serving local beans.",
        "slug": "kape-balangay-00001",
        "image_url": "https://res.cloudinary.com/.../logo.png",
        "category": "Food & Beverage",
        "address": "123 Rizal St., Poblacion, Makati City",
        "phone": "+63 917 123 4567",
        "website": "https://kapebalangay.ph",
        "is_verified": true,
        "created_at": "2026-10-01T08:30:00.000Z",
        "total_reviews": 15,
        "average_rating": 4.8,
        "rating_breakdown": {
          "5": 12,
          "4": 2,
          "3": 1,
          "2": 0,
          "1": 0
        }
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

### `GET /businesses/:slug`
Fetches complete details for a single business using its unique slug or UUID, including real-time computed rating metrics.

* **Example Request:**
  `GET /v1/api/businesses/kape-balangay-00001`

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "id": "7b8e1f24-3a5c-4e89-91a2-c48d95123456",
      "name": "Kape Balangay",
      "description": "Artisanal coffee shop and breakfast spot serving local beans.",
      "slug": "kape-balangay-00001",
      "image_url": "https://res.cloudinary.com/.../logo.png",
      "category": "Food & Beverage",
      "address": "123 Rizal St., Poblacion, Makati City",
      "phone": "+63 917 123 4567",
      "website": "https://kapebalangay.ph",
      "is_verified": true,
      "created_at": "2026-10-01T08:30:00.000Z",
      "total_reviews": 15,
      "average_rating": 4.8,
      "rating_breakdown": {
        "5": 12,
        "4": 2,
        "3": 1,
        "2": 0,
        "1": 0
      }
    }
  }
  ```
* **Response (`404 Not Found`):** When no business matches the provided slug.

---

### `POST /business`
Registers a new business entity. **Requires Google Authentication**.  
*Enforces a strict maximum limit of **5 businesses** per account.*

* **Content-Type:** `multipart/form-data`
* **Form Fields:**
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `name` | string | Yes | Official business name |
  | `description` | string | Yes | Short overview (Maximum 300 characters) |
  | `category` | string | No | Business category |
  | `address` | string | No | Physical business location / store address |
  | `phone` | string | No | Contact telephone or mobile number |
  | `website` | string | No | External website or social link |
  | `image` | File | No | Logo or cover photo (max 5MB, JPG/PNG) |

* **Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Business created successfully",
    "data": {
      "id": "9c1a2b3c-...",
      "name": "New Business Enterprise",
      "slug": "new-business-enterprise-00003",
      "category": "Retail",
      "image_url": "https://res.cloudinary.com/.../image.jpg"
    }
  }
  ```
* **Response (`403 Forbidden` - Quota Exceeded):**
  ```json
  {
    "success": false,
    "message": "You have reached the maximum limit of 5 businesses for the Free tier.",
    "data": { "current_count": 5, "max_limit": 5 }
  }
  ```

---

## 3. Customer Reviews (`/review`)

### `GET /review/:id/eligibility`
Checks whether a client is eligible to submit a review based on their **Device ID** and **IP Address** (Anti-Spam Cooldown Verification).

* **Query / Header Parameters:**
  - `x-device-id`: Unique client browser fingerprint / UUID
* **Response (`200 OK` - Eligible):**
  ```json
  {
    "success": true,
    "eligible": true,
    "message": "You are eligible to review this business."
  }
  ```
* **Response (`200 OK` - Cooldown Active):**
  ```json
  {
    "success": true,
    "eligible": false,
    "cooldown_remaining_hours": 18,
    "message": "You recently reviewed this business. Please wait 18 hours before posting again."
  }
  ```

---

### `GET /review/:id`
Retrieves the paginated customer reviews feed for a business (`:id` can be slug or UUID).  
*Pinned reviews **always appear first** at the top of the feed.*

* **Query Parameters:**
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `limit` | number | No (Default: 10) | Reviews per page |
  | `cursor` | string | No | `created_at` timestamp for cursor pagination |
  | `rating` | number | No (1 to 5) | Filter by star rating |

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "business_id": "7b8e1f24-3a5c-4e89-91a2-c48d95123456",
    "business_slug": "kape-balangay-00001",
    "reviews": [
      {
        "id": "rev-101",
        "name": "Juan Dela Cruz",
        "rating": 5,
        "comment": "Best coffee in town! Great ambiance and fast WiFi.",
        "image_urls": [
          "https://res.cloudinary.com/.../img1.jpg",
          "https://res.cloudinary.com/.../img2.jpg"
        ],
        "is_pinned": true,
        "is_private": false,
        "pinned_at": "2026-10-01T12:00:00.000Z",
        "created_at": "2026-10-01T09:00:00.000Z",
        "reviewer_business": null
      },
      {
        "id": "rev-102",
        "name": "Tech Corp PH",
        "rating": 5,
        "comment": "Excellent catering service during our corporate event.",
        "image_urls": [],
        "is_pinned": false,
        "is_private": false,
        "created_at": "2026-09-29T14:00:00.000Z",
        "reviewer_business": {
          "id": "biz-555",
          "name": "Tech Corp PH",
          "slug": "tech-corp-ph-00010",
          "image_url": "https://res.cloudinary.com/.../techcorp.png"
        }
      }
    ],
    "pagination": {
      "limit": 10,
      "has_more": false,
      "next_cursor": null
    }
  }
  ```

---

### `POST /review/:id`
Submits a customer feedback review for a business.

* **Content-Type:** `multipart/form-data`
* **Form Fields:**
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `name` | string | Yes | Reviewer's full name |
  | `rating` | number | Yes | Integer rating between `1` and `5` |
  | `comment` | string | Yes | Feedback message (**Maximum 500 characters**) |
  | `device_id` | string | Yes | Unique client browser fingerprint |
  | `reviewer_business_id` | string (UUID) | No | For B2B endorsement (if reviewer owns a registered business) |
  | `images` | File[] | No | **Maximum of 2 images only** (max 5MB each) |

* **Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Review submitted successfully",
    "data": {
      "id": "rev-999",
      "rating": 5,
      "comment": "Outstanding customer service!",
      "created_at": "2026-10-02T08:00:00.000Z"
    }
  }
  ```
* **Validation Errors (`400 Bad Request`):**
  - Rating is outside 1 to 5.
  - Comment exceeds 500 characters.
  - Attached more than 2 photos.

---

## 4. Review Moderation & B2B Actions

> 🔒 **Requires Authentication:** Only the verified owner of the business that received the review is authorized to invoke these actions.

### `PATCH /review/:reviewId/pin`
Pins a review to the top of the reviews feed and ensures public visibility.

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Review pinned successfully",
    "data": { "id": "rev-101", "is_pinned": true }
  }
  ```

---

### `PATCH /review/:reviewId/unpin`
Unpins a previously pinned review.

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Review unpinned successfully",
    "data": { "id": "rev-101", "is_pinned": false }
  }
  ```

---

### `PATCH /review/:reviewId/visibility`
Toggles review visibility between public and private/hidden.

* **Request Body:**
  ```json
  { "is_private": true }
  ```
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Review visibility updated",
    "data": { "id": "rev-101", "is_private": true }
  }
  ```

---

### `DELETE /review/:reviewId`
Deletes a fraudulent or inappropriate review.

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Review deleted successfully"
  }
  ```

---

## 5. System Limits & Error Codes

| Feature | Constraint / Business Rule | HTTP Status Code |
| :--- | :--- | :--- |
| **Business Registration** | Maximum 5 businesses per Google account | `403 Forbidden` |
| **Business Description** | Maximum 300 characters | `400 Bad Request` |
| **Review Rating** | Integer from 1 to 5 | `400 Bad Request` |
| **Review Comment** | Maximum 500 characters | `400 Bad Request` |
| **Review Attachments** | Maximum 2 photos per review (5MB each) | `400 Bad Request` |
| **Anti-Spam Verification** | 1 review per 24 hours per Device ID / IP | `200 OK (eligible: false)` |
| **Moderation Access** | Authenticated owner of the target business only | `403 Forbidden` |

---

## 6. Frontend Services & Hooks Mapping

All endpoints are mapped directly to frontend services and hooks in `src/`:

| Backend Route | Frontend Service Method | React Hook |
| :--- | :--- | :--- |
| `GET /auth/me` | `authService.getMe()` | `useUserAuth()` |
| `GET /auth/google` | `authService.getGoogleLoginUrl()` | `useUserAuth()` |
| `GET /businesses` | `businessService.getBusinesses(query)` | `useBusinessDirectory(query)` |
| `GET /businesses/:slug` | `businessService.getBusinessBySlug(slug)` | `useBusinessProfile(slug)` |
| `POST /business` | `businessService.createBusiness(payload)` | `useBusinessDirectory().createBusiness` |
| `GET /review/:id/eligibility`| `reviewService.checkEligibility(id, deviceId)` | `useCustomerReviews(id)` |
| `GET /review/:id` | `reviewService.getReviews(id, query)` | `useCustomerReviews(id)` |
| `POST /review/:id` | `reviewService.submitReview(id, payload)`| `useCustomerReviews(id)` |
| `PATCH /review/:id/pin` | `manageReviewService.pinReview(id)` | `useManageReview()` |
| `PATCH /review/:id/unpin` | `manageReviewService.unpinReview(id)` | `useManageReview()` |
| `PATCH /review/:id/visibility`| `manageReviewService.toggleVisibility(id, v)`| `useManageReview()` |
| `DELETE /review/:id` | `manageReviewService.deleteReview(id)` | `useManageReview()` |
