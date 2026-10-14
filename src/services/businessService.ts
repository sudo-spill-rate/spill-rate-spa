import { api } from "../lib/api";
import {
    Business,
    Category,
    CategoryListResponse,
    CreateBusinessPayload,
    UpdateBusinessPayload,
    BusinessListQuery,
    BusinessListResponse,
    BusinessDetailResponse,
    BusinessAnalyticsData,
    BusinessAnalyticsResponse,
    UpdateBusinessResponse,
    DeleteBusinessResponse,
} from "../types/business";
import { ApiResponse, PaginatedApiResponse } from "../types/api";

class BusinessService {
    /**
     * Kumuha ng listahan ng mga negosyo na may cursor pagination at search/category filter
     * GET /v1/api/businesses
     */
    async getBusinesses(query?: BusinessListQuery): Promise<PaginatedApiResponse<Business>> {
        try {
            const params = new URLSearchParams();
            if (query?.cursor) params.append("cursor", query.cursor);
            if (query?.limit) params.append("limit", String(query.limit));
            if (query?.category?.trim()) params.append("category", query.category.trim());
            if (query?.search?.trim()) params.append("search", query.search.trim());
            if (query?.user_id?.trim()) params.append("user_id", query.user_id.trim());

            const queryString = params.toString() ? `?${params.toString()}` : "";
            const response = await api.get<BusinessListResponse>(`/businesses${queryString}`);

            return {
                success: true,
                data: response.data.data || [],
                pagination: response.data.pagination,
            };
        } catch (error: any) {
            return {
                success: false,
                data: [],
                pagination: { limit: 10, has_more: false, next_cursor: null },
                message: error.response?.data?.message || "Failed to fetch businesses",
            };
        }
    }

    /**
     * Kumuha ng mga negosyo na pag-aari ng kasalukuyang naka-log in na business owner
     * GET /v1/api/business/owner (o fallback sa GET /businesses?user_id=...)
     */
    async getOwnerBusinesses(query?: BusinessListQuery): Promise<PaginatedApiResponse<Business>> {
        try {
            const params = new URLSearchParams();
            if (query?.cursor) params.append("cursor", query.cursor);
            if (query?.limit) params.append("limit", String(query.limit));
            if (query?.category?.trim()) params.append("category", query.category.trim());
            if (query?.search?.trim()) params.append("search", query.search.trim());
            if (query?.user_id?.trim()) params.append("user_id", query.user_id.trim());

            const queryString = params.toString() ? `?${params.toString()}` : "";
            try {
                const response = await api.get<BusinessListResponse>(`/business/owner${queryString}`);
                return {
                    success: true,
                    data: response.data.data || [],
                    pagination: response.data.pagination,
                };
            } catch {
                return await this.getBusinesses(query);
            }
        } catch (error: any) {
            return {
                success: false,
                data: [],
                pagination: { limit: 10, has_more: false, next_cursor: null },
                message: error.response?.data?.message || "Failed to fetch owner businesses",
            };
        }
    }

    /**
     * Kumuha ng profile ng isang negosyo gamit ang slug kasama ang computed rating breakdown
     * GET /v1/api/businesses/:slug
     */
    async getBusinessBySlug(slug: string): Promise<ApiResponse<Business | null>> {
        try {
            const response = await api.get<BusinessDetailResponse>(`/businesses/${encodeURIComponent(slug)}`);
            return {
                success: true,
                data: response.data.data,
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || "Business profile not found",
            };
        }
    }

    /**
     * Kumuha ng lahat ng active categories mula sa database
     * GET /v1/api/categories
     */
    async getCategories(): Promise<ApiResponse<Category[]>> {
        try {
            const response = await api.get<CategoryListResponse>("/categories");
            return {
                success: true,
                data: response.data.data || [],
            };
        } catch (error: any) {
            return {
                success: false,
                data: [],
                message: error.response?.data?.message || "Failed to fetch categories",
            };
        }
    }

    /**
     * Lumikha ng bagong negosyo gamit ang FormData (May 5-business quota check at logo upload)
     * POST /v1/api/business
     */
    async createBusiness(payload: CreateBusinessPayload): Promise<ApiResponse<Business | null>> {
        try {
            const formData = new FormData();
            formData.append("name", payload.name.trim());
            if (payload.description?.trim()) {
                formData.append("description", payload.description.trim());
            }
            if (payload.category?.trim()) {
                formData.append("category", payload.category.trim());
            }
            if (payload.address?.trim()) {
                formData.append("address", payload.address.trim());
            }
            if (payload.phone?.trim()) {
                formData.append("phone", payload.phone.trim());
            }
            if (payload.website?.trim()) {
                formData.append("website", payload.website.trim());
            }
            if (payload.image) {
                formData.append("image", payload.image);
            }

            const response = await api.post<ApiResponse<Business>>("/business", formData);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || error.message || "Failed to create business",
            };
        }
    }

    /**
     * I-update ang business information at logo image
     * PATCH /v1/api/business/:id
     */
    async updateBusiness(id: string, payload: UpdateBusinessPayload): Promise<ApiResponse<Partial<Business> | null>> {
        try {
            // Gumamit ng FormData kung may logo file na kasama, kundi json
            let data: FormData | UpdateBusinessPayload;
            if (payload.image) {
                const formData = new FormData();
                if (payload.name?.trim()) formData.append("name", payload.name.trim());
                if (payload.description !== undefined) formData.append("description", payload.description.trim());
                if (payload.category?.trim()) formData.append("category", payload.category.trim());
                if (payload.address !== undefined) formData.append("address", payload.address.trim());
                if (payload.phone !== undefined) formData.append("phone", payload.phone.trim());
                if (payload.website !== undefined) formData.append("website", payload.website.trim());
                formData.append("image", payload.image);
                data = formData;
            } else {
                data = payload;
            }

            const response = await api.patch<UpdateBusinessResponse>(`/business/${id}`, data);
            return {
                success: true,
                data: response.data.data,
                message: response.data.message || "Business updated successfully.",
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || error.message || "Failed to update business",
            };
        }
    }

    /**
     * I-delete ang negosyo, kasamang reviews, at Cloudinary assets
     * DELETE /v1/api/business/:id
     */
    async deleteBusiness(id: string): Promise<ApiResponse<null>> {
        try {
            const response = await api.delete<DeleteBusinessResponse>(`/business/${id}`);
            return {
                success: true,
                data: null,
                message: response.data.message || "Business and its associated reviews deleted successfully.",
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || error.message || "Failed to delete business",
            };
        }
    }

    /**
     * Kumuha ng Business Owner Analytics Dashboard metrics
     * GET /v1/api/business/:id/analytics
     */
    async getBusinessAnalytics(id: string): Promise<ApiResponse<BusinessAnalyticsData | null>> {
        try {
            const response = await api.get<BusinessAnalyticsResponse>(`/business/${id}/analytics`);
            return {
                success: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || error.message || "Failed to fetch analytics",
            };
        }
    }

    /**
     * I-export ang lahat ng reviews sa CSV file
     * GET /v1/api/business/:id/reviews/export
     */
    async exportReviewsCsv(id: string, businessSlugOrName = "reviews"): Promise<{ success: boolean; message?: string }> {
        try {
            const response = await api.get(`/business/${id}/reviews/export`, {
                responseType: "blob",
            });

            // Lumikha ng downloadable URL mula sa blob
            const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            const dateStr = new Date().toISOString().split("T")[0];
            link.setAttribute("download", `${businessSlugOrName}-reviews-${dateStr}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            return {
                success: true,
                message: "Reviews exported successfully.",
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to export reviews.",
            };
        }
    }
}

export const businessService = new BusinessService();
export default businessService;