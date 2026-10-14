# ⭐ Review API Endpoints Reference

> **Base URL:** `http://localhost:3000/v1/api` (or configured via `VITE_API_BASE_URL` in `.env`)  
> **Backend Service:** Express 5 + Supabase PostgreSQL + Cloudinary

---

## 📑 Endpoints Overview

### Public & Customer Actions
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/v1/api/review/:id` | Public | List public reviews for a business with pagination & rating filter |
| `POST` | `/v1/api/review/:id` | Public / Auth | Submit customer review (up to 3 images, anti-spam cooldown, B2B support) |
| `GET` | `/v1/api/review/:id/eligibility` | Public | Check if client device/IP can review the business today |
| `GET` | `/v1/api/review/:id/summary` | Public | Get star distribution breakdown & rating summary |
| `GET` | `/v1/api/review/detail/:reviewId` | Public / Auth | Get single review detail |
| `POST` | `/v1/api/review/:reviewId/vote` | Public / Auth | Toggle "Helpful" upvote on a review (+1 / -1) |
| `POST` | `/v1/api/review/:reviewId/report` | Public / Auth | Report/flag a fake, offensive, or spam review |

### Business Owner Management
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/v1/api/review/manage/:businessId` | Authenticated (Owner) | Manage reviews (filters: `all`, `public`, `private`, `pinned`) |
| `POST` | `/v1/api/review/:reviewId/reply` | Authenticated (Owner) | Post or update official business owner response to a review |
| `DELETE` | `/v1/api/review/:reviewId/reply` | Authenticated (Owner) | Remove owner response from a review |
| `PATCH` | `/v1/api/review/:reviewId/pin` | Authenticated (Owner) | Pin review to top of store (max 3 pinned reviews) |
| `PATCH` | `/v1/api/review/:reviewId/unpin` | Authenticated (Owner) | Unpin review |
| `PATCH` | `/v1/api/review/:reviewId/visibility` | Authenticated (Owner) | Toggle review between public and private |
| `DELETE` | `/v1/api/review/:reviewId` | Authenticated (Owner) | Delete review and purge Cloudinary assets |
| `GET` | `/v1/api/review/manage/:businessId/reports` | Authenticated (Owner) | View all flagged reports for this business |
| `PATCH` | `/v1/api/review/manage/report/:reportId` | Authenticated (Owner) | Update report status (`resolved`, `dismissed`, `pending`) |

---

## 1. List Public Reviews for Business
### `GET /v1/api/review/:id`

Returns public customer reviews. Pinned reviews are sorted to the top, followed by newest. Includes owner replies and helpful vote counts.

* **URL Parameters:**
  * `:id` – Business UUID or Slug

* **Query Parameters:**
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `limit` | number | No (Default: 10, Max: 50) | Number of reviews per page |
  | `cursor` | string | No | `created_at` timestamp for infinite scroll |
  | `rating` | number | No | Filter by rating (1 to 5) |

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "business_id": "7b8e1f24-3a5c-4e89-91a2-c48d95123456",
    "business_slug": "kape-balangay",
    "data": [
      {
        "id": "rev-9c8d7e6f-5a4b",
        "name": "Alex Gonzaga",
        "rating": 5,
        "comment": "The espresso and barako blend are top notch!",
        "image_urls": ["https://res.cloudinary.com/.../photo1.jpg"],
        "is_pinned": true,
        "pinned_at": "2026-10-10T12:00:00.000Z",
        "helpful_count": 14,
        "reply_comment": "Salamat sa pagbisita, Alex! See you again soon.",
        "replied_at": "2026-10-10T14:30:00.000Z",
        "created_at": "2026-10-09T08:00:00.000Z"
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

## 2. Submit a Review
### `POST /v1/api/review/:id`

Submits customer review. Automatically protected by anti-spam device/IP cooldown and XSS sanitization. Supports up to 3 review images.

* **URL Parameters:**
  * `:id` – Business UUID or Slug

* **Form Fields (`multipart/form-data`):**
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `name` | string | Yes | Reviewer name |
  | `rating` | integer | Yes | 1 to 5 |
  | `comment` | string | Yes | Maximum 500 characters (XSS sanitized) |
  | `device_id` | string | No | Fingerprint/device ID for spam prevention |
  | `images` | file[] | No | Up to 3 images (JPEG, PNG, WebP, max 5MB each) |
  | `reviewer_business_id` | string | No | Business UUID if reviewing as a B2B business |

* **Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Review submitted successfully.",
    "is_b2b_review": false,
    "data": {
      "id": "rev-12345...",
      "business_id": "7b8e1f24...",
      "name": "Alex",
      "rating": 5,
      "comment": "Great experience!",
      "image_urls": ["https://res.cloudinary.com/.../img1.jpg"]
    }
  }
  ```

* **Response (`429 Too Many Requests`):**
  ```json
  {
    "success": false,
    "message": "You have already submitted a review for this business today. You can submit another review in 22 hours.",
    "data": {
      "cooldown_remaining_hours": 22,
      "reason": "device_cooldown"
    }
  }
  ```

---

## 3. Check Eligibility
### `GET /v1/api/review/:id/eligibility`

Validates whether the current user, network IP, or device is eligible to submit a review before rendering the review form.

* **Response (`200 OK` - Eligible):**
  ```json
  {
    "success": true,
    "canReview": true,
    "remainingHours": 0,
    "business": { "id": "...", "name": "Kape Balangay" }
  }
  ```

---

## 4. Toggle Helpful Vote
### `POST /v1/api/review/:reviewId/vote`

Toggles a helpful vote on a review. If not yet voted, increments count (+1). If already voted, removes vote (-1).

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Marked review as helpful.",
    "data": {
      "voted": true,
      "helpful_count": 15
    }
  }
  ```

---

## 5. Report a Review
### `POST /v1/api/review/:reviewId/report`

Allows customers or owners to report fake, abusive, or spam reviews. Rate limited to 1 report per IP per 24 hours.

* **Request Body (`application/json`):**
  ```json
  {
    "reason": "spam",
    "details": "This user is promoting competitor links."
  }
  ```
  *Allowed reasons:* `spam`, `offensive`, `fake`, `conflict_of_interest`, `other`.

* **Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Review reported successfully. Thank you for keeping the platform safe.",
    "data": {
      "report_id": "rep-abc-123",
      "review_id": "rev-12345",
      "status": "pending"
    }
  }
  ```

---

## 6. Business Owner Reply
### `POST /v1/api/review/:reviewId/reply`

Owner posts or updates an official response to a customer review.

* **Headers:** `Authorization: Bearer <access_token>`
* **Request Body:**
  ```json
  {
    "reply": "Maraming salamat po sa feedback! Asahan po namin ang muling pagbisita ninyo."
  }
  ```
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Reply posted successfully.",
    "data": {
      "id": "rev-12345",
      "reply_comment": "Maraming salamat po sa feedback! Asahan po namin ang muling pagbisita ninyo.",
      "replied_at": "2026-10-14T09:30:00.000Z"
    }
  }
  ```

### `DELETE /v1/api/review/:reviewId/reply`
Deletes the owner reply.

---

## 7. Pin / Unpin Review
### `PATCH /v1/api/review/:reviewId/pin`

Pins a review to the top of the business listing (maximum 3 pinned reviews). Automatically marks it public.

* **Headers:** `Authorization: Bearer <access_token>`
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Review pinned successfully.",
    "data": { "id": "rev-123", "is_pinned": true, "pinned_at": "2026-10-14T..." }
  }
  ```

### `PATCH /v1/api/review/:reviewId/unpin`
Unpins the review.

---

## 8. Toggle Visibility (Private / Public)
### `PATCH /v1/api/review/:reviewId/visibility`

* **Request Body:**
  ```json
  {
    "is_private": true
  }
  ```
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Review visibility updated successfully.",
    "data": { "id": "rev-123", "is_private": true, "is_pinned": false }
  }
  ```

---

## 9. Delete Review
### `DELETE /v1/api/review/:reviewId`

Owner deletes a review. Deletes images from Cloudinary and automatically recalculates average rating and total review counts on the business.

* **Headers:** `Authorization: Bearer <access_token>`
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Review deleted successfully."
  }
  ```
