import { api } from "../lib/api";
import {
    Business,
    CreateBusinessPayload,
    BusinessListQuery,
    BusinessListResponse,
    BusinessDetailResponse,
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
}

export const businessService = new BusinessService();
export default businessService;