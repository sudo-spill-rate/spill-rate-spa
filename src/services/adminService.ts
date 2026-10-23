import { api } from "../lib/api";
import {
    AdminOverviewResponse,
    AdminReportsResponse,
    AdminReportsQuery,
    VerifyBusinessPayload,
    VerifyBusinessResponse,
    AddCategoryPayload,
    AddCategoryResponse,
    UpdateCategoryPayload,
    UpdateCategoryResponse,
    PromoteAdminPayload,
    PromoteAdminResponse,
    AdminBusinessesQuery,
    AdminBusinessesResponse,
    PlatformAdminItem,
    PlatformAdminsResponse,
    RevokeAdminResponse,
    AdminUsersQuery,
    AdminUsersResponse,
    BanUserPayload,
    BanUserResponse,
} from "../types/admin";
import { ApiResponse, PaginatedApiResponse } from "../types/api";

class AdminService {
    /**
     * Kumuha ng platform-wide stats, recent businesses, at recent reports
     * GET /v1/api/admin/overview
     */
    async getOverview(): Promise<ApiResponse<AdminOverviewResponse["data"] | null>> {
        try {
            const response = await api.get<AdminOverviewResponse>("/admin/overview");
            return {
                success: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || "Failed to fetch admin overview",
            };
        }
    }

    /**
     * Kumuha ng businesses para sa moderation queue at verification
     * GET /v1/api/admin/businesses
     */
    async getBusinesses(query?: AdminBusinessesQuery): Promise<PaginatedApiResponse<AdminBusinessesResponse["data"][number]>> {
        try {
            const params = new URLSearchParams();
            if (query?.status && query.status !== "all") params.append("status", query.status);
            if (query?.search) params.append("search", query.search.trim());
            if (query?.limit) params.append("limit", String(query.limit));
            if (query?.cursor) params.append("cursor", query.cursor);

            const queryString = params.toString() ? `?${params.toString()}` : "";
            const response = await api.get<AdminBusinessesResponse>(`/admin/businesses${queryString}`);

            return {
                success: true,
                data: response.data.data || [],
                pagination: response.data.pagination || { limit: query?.limit || 20, has_more: false, next_cursor: null },
                message: response.data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                data: [],
                pagination: { limit: query?.limit || 20, has_more: false, next_cursor: null },
                message: error.response?.data?.message || "Failed to fetch admin businesses queue",
            };
        }
    }

    /**
     * I-toggle ang verified badge ng isang negosyo
     * PATCH /v1/api/admin/business/:id/verify
     */
    async verifyBusiness(id: string, isVerified: boolean): Promise<ApiResponse<VerifyBusinessResponse["data"] | null>> {
        try {
            const payload: VerifyBusinessPayload = { is_verified: isVerified };
            const response = await api.patch<VerifyBusinessResponse>(`/admin/business/${id}/verify`, payload);
            return {
                success: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || "Failed to update business verification status",
            };
        }
    }

    /**
     * Permanenteng i-delete ang spam o fraudulent business (Admin override)
     * DELETE /v1/api/admin/business/:id
     */
    async deleteBusiness(id: string): Promise<ApiResponse<null>> {
        try {
            const response = await api.delete(`/admin/business/${id}`);
            return {
                success: true,
                data: null,
                message: response.data?.message || "Business deleted by admin successfully.",
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || "Failed to delete business",
            };
        }
    }

    /**
     * Burahin ang toxic o mapanirang review sa buong platform (Admin override)
     * DELETE /v1/api/admin/review/:reviewId
     */
    async deleteReview(reviewId: string): Promise<ApiResponse<null>> {
        try {
            const response = await api.delete(`/admin/review/${reviewId}`);
            return {
                success: true,
                data: null,
                message: response.data?.message || "Review deleted by admin successfully.",
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || "Failed to delete review",
            };
        }
    }

    /**
     * Tingnan ang lahat ng flagged reports sa buong platform
     * GET /v1/api/admin/reports
     */
    async getReports(query?: AdminReportsQuery): Promise<ApiResponse<AdminReportsResponse["data"]>> {
        try {
            const params = new URLSearchParams();
            if (query?.status && query.status !== "all") params.append("status", query.status);
            if (query?.limit) params.append("limit", String(query.limit));

            const queryString = params.toString() ? `?${params.toString()}` : "";
            const response = await api.get<AdminReportsResponse>(`/admin/reports${queryString}`);

            return {
                success: true,
                data: response.data.data || [],
                message: response.data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                data: [],
                message: error.response?.data?.message || "Failed to fetch platform reports",
            };
        }
    }

    /**
     * Magdagdag ng bagong category sa database
     * POST /v1/api/admin/category
     */
    async addCategory(payload: AddCategoryPayload): Promise<ApiResponse<AddCategoryResponse["data"] | null>> {
        try {
            const response = await api.post<AddCategoryResponse>("/admin/category", payload);
            return {
                success: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || "Failed to add category",
            };
        }
    }

    /**
     * Mag-update ng pangalan o icon ng business category
     * PATCH /v1/api/admin/category/:id
     */
    async updateCategory(id: string, payload: UpdateCategoryPayload): Promise<ApiResponse<UpdateCategoryResponse["data"] | null>> {
        try {
            const response = await api.patch<UpdateCategoryResponse>(`/admin/category/${id}`, payload);
            return {
                success: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || "Failed to update category",
            };
        }
    }

    /**
     * Magbura ng category sa database
     * DELETE /v1/api/admin/category/:id
     */
    async deleteCategory(id: string): Promise<ApiResponse<null>> {
        try {
            const response = await api.delete(`/admin/category/${id}`);
            return {
                success: true,
                data: null,
                message: response.data?.message || "Category deleted successfully.",
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || "Failed to delete category",
            };
        }
    }

    /**
     * Ilista ang lahat ng platform administrators at founders
     * GET /v1/api/admin/admins
     */
    async getAdmins(): Promise<ApiResponse<PlatformAdminItem[]>> {
        try {
            const response = await api.get<PlatformAdminsResponse>("/admin/admins");
            return {
                success: true,
                data: response.data.data || [],
                message: response.data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                data: [],
                message: error.response?.data?.message || "Failed to fetch platform administrators",
            };
        }
    }

    /**
     * Mag-promote ng user email bilang admin o founder
     * POST /v1/api/admin/promote
     */
    async promoteAdmin(payload: PromoteAdminPayload): Promise<ApiResponse<PromoteAdminResponse["data"] | null>> {
        try {
            const response = await api.post<PromoteAdminResponse>("/admin/promote", payload);
            return {
                success: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || "Failed to promote account",
            };
        }
    }

    /**
     * Bawiin ang admin privileges ng isang account (Founder action)
     * DELETE /v1/api/admin/admins/:email
     */
    async revokeAdmin(email: string): Promise<ApiResponse<RevokeAdminResponse["data"] | null>> {
        try {
            const encodedEmail = encodeURIComponent(email);
            const response = await api.delete<RevokeAdminResponse>(`/admin/admins/${encodedEmail}`);
            return {
                success: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || "Failed to revoke admin privileges",
            };
        }
    }

    /**
     * Ilista at maghanap ng registered users na may cursor pagination
     * GET /v1/api/admin/users
     */
    async getUsers(query?: AdminUsersQuery): Promise<PaginatedApiResponse<AdminUserListItem>> {
        try {
            const params = new URLSearchParams();
            if (query?.search) params.append("search", query.search.trim());
            if (query?.role && query.role !== "all") params.append("role", query.role);
            if (query?.limit) params.append("limit", String(query.limit));
            if (query?.cursor) params.append("cursor", query.cursor);

            const queryString = params.toString() ? `?${params.toString()}` : "";
            const response = await api.get<AdminUsersResponse>(`/admin/users${queryString}`);

            return {
                success: true,
                data: response.data.data || [],
                pagination: response.data.pagination || { limit: query?.limit || 20, has_more: false, next_cursor: null },
                message: response.data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                data: [],
                pagination: { limit: query?.limit || 20, has_more: false, next_cursor: null },
                message: error.response?.data?.message || "Failed to fetch platform users",
            };
        }
    }

    /**
     * I-ban o i-unban ang user account
     * PATCH /v1/api/admin/user/:id/ban
     */
    async banUser(id: string, isBanned: boolean): Promise<ApiResponse<BanUserResponse["data"] | null>> {
        try {
            const payload: BanUserPayload = { is_banned: isBanned };
            const response = await api.patch<BanUserResponse>(`/admin/user/${id}/ban`, payload);
            return {
                success: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || "Failed to update user ban status",
            };
        }
    }

    /**
     * Kumuha ng totoong live at 30-day analytics mula sa Google Analytics 4
     * GET /v1/api/admin/google-overview
     */
    async getGoogleOverview(): Promise<ApiResponse<any>> {
        try {
            const response = await api.get<{ success: boolean; message: string; data: any }>("/admin/google-overview");
            return {
                success: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || error.message || "Failed to fetch Google Analytics metrics",
            };
        }
    }
}

export const adminService = new AdminService();
export default adminService;
