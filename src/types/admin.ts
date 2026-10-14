import { UserRole } from "./auth";

// 1. High-level platform statistics
export interface PlatformStats {
    total_users: number;
    total_businesses: number;
    total_reviews: number;
    pending_reports: number;
}

// 2. Business entity summary sa admin overview
export interface AdminBusinessItem {
    id: string;
    name: string;
    slug: string;
    category?: string | null;
    is_verified: boolean;
    total_reviews: number;
    average_rating: number;
    created_at: string;
}

// 3. Global flagged report entity
export interface AdminReportItem {
    id: string;
    review_id: string;
    business_id: string;
    reason: string;
    details?: string | null;
    status: "pending" | "resolved" | "dismissed";
    reporter_ip?: string | null;
    created_at: string;
    business?: {
        id: string;
        name: string;
        slug: string;
    } | null;
    review?: {
        id: string;
        name: string;
        comment?: string | null;
        rating?: number;
    } | null;
}

// 4. Response mula sa GET /v1/api/admin/overview
export interface AdminOverviewData {
    stats: PlatformStats;
    recent_businesses: AdminBusinessItem[];
    recent_reports: AdminReportItem[];
}

export interface AdminOverviewResponse {
    success: true;
    message: string;
    founder?: {
        email: string;
        role: UserRole;
    };
    data: AdminOverviewData;
}

// 5. Payload & Response para sa PATCH /v1/api/admin/business/:id/verify
export interface VerifyBusinessPayload {
    is_verified: boolean;
}

export interface VerifyBusinessResponse {
    success: true;
    message: string;
    data: {
        id: string;
        name: string;
        is_verified: boolean;
    };
}

// 6. Query para sa GET /v1/api/admin/reports
export interface AdminReportsQuery {
    status?: "all" | "pending" | "resolved" | "dismissed";
    limit?: number;
}

export interface AdminReportsResponse {
    success: true;
    message: string;
    data: AdminReportItem[];
}

// 7. Category management types (POST /v1/api/admin/category at DELETE /v1/api/admin/category/:id)
export interface AddCategoryPayload {
    name: string;
    icon?: string;
}

export interface AddCategoryResponse {
    success: true;
    message: string;
    data: {
        id: string;
        name: string;
        slug: string;
        icon?: string | null;
    };
}

// 8. Promote admin payload & response (POST /v1/api/admin/promote)
export interface PromoteAdminPayload {
    email: string;
    role: "admin" | "founder";
}

export interface PromoteAdminResponse {
    success: true;
    message: string;
    data: {
        email: string;
        role: "admin" | "founder";
    };
}
