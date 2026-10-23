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

// 9. Admin Businesses Queue types (GET /v1/api/admin/businesses)
export interface AdminBusinessQueueItem {
    id: string;
    name: string;
    slug: string;
    category?: string | null;
    is_verified: boolean;
    total_reviews: number;
    average_rating: number;
    user_id?: string;
    phone?: string | null;
    website?: string | null;
    created_at: string;
}

export interface AdminBusinessesQuery {
    status?: "all" | "unverified" | "verified";
    search?: string;
    limit?: number;
    cursor?: string;
}

export interface AdminBusinessesResponse {
    success: true;
    message: string;
    data: AdminBusinessQueueItem[];
    pagination: {
        limit: number;
        has_more: boolean;
        next_cursor: string | null;
    };
}

// 10. Category Update types (PATCH /v1/api/admin/category/:id)
export interface UpdateCategoryPayload {
    name?: string;
    icon?: string;
}

export interface UpdateCategoryResponse {
    success: true;
    message: string;
    data: {
        id: string;
        name: string;
        slug: string;
        icon?: string | null;
    };
}

// 11. Platform Admin List & Revoke types (GET /v1/api/admin/admins & DELETE /v1/api/admin/admins/:email)
export interface PlatformAdminItem {
    email: string;
    role: "founder" | "admin";
    created_at: string;
}

export interface PlatformAdminsResponse {
    success: true;
    message: string;
    data: PlatformAdminItem[];
}

export interface RevokeAdminResponse {
    success: true;
    message: string;
    data: {
        email: string;
    };
}

// 12. Admin Users Directory & Moderation (GET /v1/api/admin/users & PATCH /v1/api/admin/user/:id/ban)
export interface AdminUsersQuery {
    search?: string;
    role?: "all" | "user" | "admin" | "founder" | "banned";
    limit?: number;
    cursor?: string;
}

export interface AdminUserListItem {
    id: string;
    email: string;
    full_name?: string | null;
    avatar_url?: string | null;
    role: "user" | "admin" | "founder" | "banned";
    created_at: string;
}

export interface AdminUsersResponse {
    success: true;
    message: string;
    data: AdminUserListItem[];
    pagination: {
        limit: number;
        has_more: boolean;
        next_cursor: string | null;
    };
}

export interface BanUserPayload {
    is_banned: boolean;
}

export interface BanUserResponse {
    success: true;
    message: string;
    data: {
        id: string;
        email: string;
        role: "banned" | "user";
    };
}

