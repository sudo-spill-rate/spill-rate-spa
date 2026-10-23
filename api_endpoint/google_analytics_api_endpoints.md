# 📈 Google Analytics API Endpoints Reference

> **Base URL:** `http://localhost:3000/v1/api/google-analytics` (or configured via `VITE_API_BASE_URL` in `.env`)  
> **Auth Strategy:** Requires valid Bearer JWT where `req.user.is_admin === true` (`role: 'founder' | 'admin'`).  
> **Service:** Google Analytics 4 (GA4) Data API v1beta integration.

---

## 📑 Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/v1/api/google-analytics/overview` | Complete 30-day dashboard overview + realtime snapshot |
| `GET` | `/v1/api/google-analytics/realtime` | Active concurrent visitors in the last 30 minutes |
| `GET` | `/v1/api/google-analytics/visitors` | Daily visitor & pageview trends over time (`?days=30`) |
| `GET` | `/v1/api/google-analytics/devices` | Audience device breakdown (mobile, desktop, tablet) |
| `GET` | `/v1/api/google-analytics/sources` | Traffic acquisition sources (organic, direct, referral) |
| `GET` | `/v1/api/google-analytics/pages` | Most visited pages & screen URLs |

---

## 1. Google Analytics Overview
### `GET /v1/api/google-analytics/overview`

Returns 30-day traffic KPIs and a real-time active user count.

* **Headers:** `Authorization: Bearer <access_token>`
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Google Analytics overview retrieved successfully.",
    "data": {
      "realtime_active_users": 12,
      "last_30_days": {
        "active_users": 1850,
        "new_users": 1420,
        "pageviews": 7650,
        "sessions": 2400,
        "bounce_rate_pct": 32.4,
        "avg_session_duration_sec": 145.2
      }
    }
  }
  ```

---

## 2. Realtime Active Visitors
### `GET /v1/api/google-analytics/realtime`

Returns real-time active users and top pages currently being browsed in the last 30 minutes.

* **Headers:** `Authorization: Bearer <access_token>`
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Realtime analytics retrieved successfully.",
    "data": {
      "active_users": 8,
      "top_pages": [
        { "page_path": "/", "active_users": 4 },
        { "page_path": "/businesses/kape-balangay", "active_users": 3 },
        { "page_path": "/explore", "active_users": 1 }
      ]
    }
  }
  ```

---

## 3. Visitors & Pageviews Trends
### `GET /v1/api/google-analytics/visitors`

Returns day-by-day time-series data for charting active users, new users, and pageviews.

* **Headers:** `Authorization: Bearer <access_token>`
* **Query Parameters:**
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `days` | number | No (Default: 30) | Days of historical data to retrieve |

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Visitors trends retrieved successfully.",
    "data": [
      {
        "date": "2026-10-20",
        "active_users": 110,
        "new_users": 85,
        "pageviews": 430
      },
      {
        "date": "2026-10-21",
        "active_users": 125,
        "new_users": 92,
        "pageviews": 490
      }
    ]
  }
  ```

---

## 4. Device Breakdown
### `GET /v1/api/google-analytics/devices`

Categorizes visitors by device platform for responsive UI analysis.

* **Headers:** `Authorization: Bearer <access_token>`
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Device statistics retrieved successfully.",
    "data": [
      { "device": "mobile", "users": 1200, "sessions": 1650 },
      { "device": "desktop", "users": 600, "sessions": 700 },
      { "device": "tablet", "users": 50, "sessions": 50 }
    ]
  }
  ```

---

## 5. Traffic Acquisition Sources
### `GET /v1/api/google-analytics/sources`

Identifies where traffic is originating from (search engines, direct links, social media).

* **Headers:** `Authorization: Bearer <access_token>`
* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Traffic sources retrieved successfully.",
    "data": [
      { "source": "google", "medium": "organic", "users": 980 },
      { "source": "(direct)", "medium": "(none)", "users": 520 },
      { "source": "facebook", "medium": "referral", "users": 210 }
    ]
  }
  ```

---

## 6. Top Pages & Content
### `GET /v1/api/google-analytics/pages`

Lists the most viewed URLs, titles, and engagement times across the website.

* **Headers:** `Authorization: Bearer <access_token>`
* **Query Parameters:**
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `limit` | number | No (Default: 10, Max: 50) | Number of pages to return |

* **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Top pages retrieved successfully.",
    "data": [
      {
        "page_path": "/",
        "screen_name": "SpillRate - Honest Business Reviews",
        "views": 3200,
        "users": 1400
      },
      {
        "page_path": "/explore",
        "screen_name": "Explore Businesses",
        "views": 1800,
        "users": 900
      }
    ]
  }
  ```
