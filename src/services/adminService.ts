import { api } from "../lib/api";
import {
    AdminOverviewResponse,
    AdminReportsResponse,
    AdminReportsQuery,
    VerifyBusinessPayload,
    VerifyBusinessResponse,
    AddCategoryPayload,
    AddCategoryResponse,
    PromoteAdminPayload,
    PromoteAdminResponse,
} from "../types/admin";
import { ApiResponse } from "../types/api";

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
}

export const adminService = new AdminService();
export default adminService;
