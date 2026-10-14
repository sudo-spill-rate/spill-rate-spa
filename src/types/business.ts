import { PaginationMeta } from './api';

// 1. Star Rating Distribution (Kinalkula ng backend mula sa reviews)
export interface RatingBreakdown {
    1: number; // Bilang ng 1-star reviews
    2: number; // Bilang ng 2-star reviews
    3: number; // Bilang ng 3-star reviews
    4: number; // Bilang ng 4-star reviews
    5: number; // Bilang ng 5-star reviews
}

// 2. Main Business Model Entity
export interface Business {
    id: string; // UUID
    name: string;
    description: string | null;
    slug: string; // Halimbawa: "kape-balangay-00001"
    image_url: string | null; // Cloudinary secure URL
    image_public_id?: string | null; // Cloudinary asset ID
    user_id?: string; // Owner User UUID
    created_at: string; // ISO timestamp
    category?: string | null; // e.g. "Food & Beverage", "Technology", "Retail"
    address?: string | null; // Physical address
    phone?: string | null; // Contact telephone or mobile number
    website?: string | null; // External website link
    is_verified?: boolean; // Verified Business Badge status

    // Aggregated rating statistics (Ibinabalik ng GET /businesses at GET /businesses/:slug)
    total_reviews?: number;
    average_rating?: number; // 0 to 5.0 (1 decimal place)
    rating_breakdown?: RatingBreakdown;
}

// 3. Payload para sa paglikha ng Business (POST /v1/api/business)
// Note: Kung may image upload, ipinapadala ito bilang FormData
export interface CreateBusinessPayload {
    name: string;
    description?: string;
    category?: string;
    address?: string;
    phone?: string;
    website?: string;
    image?: File | Blob | null; // Single business logo/cover image (max 5MB)
}

// 3.1 Payload para sa pag-update ng Business (PATCH /v1/api/business/:id)
export interface UpdateBusinessPayload {
    name?: string;
    description?: string;
    category?: string;
    address?: string;
    phone?: string;
    website?: string;
    image?: File | Blob | null; // Bagong logo kung papalitan
}

// 3.2 Category Entity (GET /v1/api/categories)
export interface Category {
    id: string;
    name: string;
    slug: string;
    icon?: string | null;
    business_count?: number;
}

export interface CategoryListResponse {
    success: true;
    data: Category[];
}

// 3.3 Analytics Entities (GET /v1/api/business/:id/analytics)
export interface BusinessAnalyticsSummary {
    total_reviews: number;
    average_rating: number;
    public_reviews: number;
    private_reviews: number;
    pinned_reviews: number;
    last_30_days_count: number;
}

export interface BusinessResponseMetrics {
    replied_count: number;
    pending_reply_count: number;
    response_rate_percent: number;
}

export interface RatingDistributionItem {
    count: number;
    percentage: number;
}

export interface MonthlyTrendItem {
    month: string; // e.g. "2026-10"
    reviews: number;
    average_rating: number;
}

export interface BusinessAnalyticsData {
    business: {
        id: string;
        name: string;
        slug: string;
        created_at: string;
    };
    summary: BusinessAnalyticsSummary;
    response_metrics: BusinessResponseMetrics;
    rating_distribution: {
        5: RatingDistributionItem;
        4: RatingDistributionItem;
        3: RatingDistributionItem;
        2: RatingDistributionItem;
        1: RatingDistributionItem;
    };
    monthly_trends: MonthlyTrendItem[];
}

export interface BusinessAnalyticsResponse {
    success: true;
    message?: string;
    data: BusinessAnalyticsData;
}

// 4. Response mula sa POST /v1/api/business
export interface CreateBusinessResponse {
    success: true;
    data: Business;
    message: string;
}

// 4.1 Response mula sa PATCH /v1/api/business/:id
export interface UpdateBusinessResponse {
    success: true;
    message: string;
    data: Partial<Business> & { id: string };
}

// 4.2 Response mula sa DELETE /v1/api/business/:id
export interface DeleteBusinessResponse {
    success: true;
    message: string;
}

// 5. Response kapag umabot na sa 5-business quota (HTTP 403 Limit Error)
export interface BusinessQuotaLimitError {
    current_count: number;
    max_limit: 5;
}

// 6. Query Parameters para sa Business Directory (GET /v1/api/businesses)
export interface BusinessListQuery {
    cursor?: string; // created_at ISO string para sa pagination
    limit?: number;  // Default: 10, Max: 50
    category?: string; // Filter by business category
    search?: string;   // Filter by business name keyword
    user_id?: string;  // Filter by owner user id
}

// 7. Response mula sa Business Directory (GET /v1/api/businesses)
export interface BusinessListResponse {
    success: true;
    data: Business[];
    pagination: PaginationMeta;
}

// 8. Response mula sa Single Business Profile (GET /v1/api/businesses/:slug)
export interface BusinessDetailResponse {
    success: true;
    data: Business;
}