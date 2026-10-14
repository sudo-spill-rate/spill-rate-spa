import { createContext } from "react";
import {
    Business,
    CreateBusinessPayload,
    UpdateBusinessPayload,
    BusinessAnalyticsData,
} from "../../types/business";
import { PaginationMeta } from "../../types/api";

export interface BusinessContextType {
    businesses: Business[];
    selectedBusiness: Business | null;
    pagination: PaginationMeta | null;
    isLoading: boolean;
    isLoadingMore: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    error: string | null;

    // Actions
    fetchBusinesses: (reset?: boolean, limit?: number) => Promise<void>;
    loadMoreBusinesses: () => Promise<void>;
    fetchBusinessBySlug: (slug: string) => Promise<Business | null>;
    createBusiness: (payload: CreateBusinessPayload) => Promise<{ success: boolean; data?: Business; message?: string }>;
    updateBusiness: (id: string, payload: UpdateBusinessPayload) => Promise<{ success: boolean; data?: Partial<Business>; message?: string }>;
    deleteBusiness: (id: string) => Promise<{ success: boolean; message?: string }>;
    getAnalytics: (id: string) => Promise<{ success: boolean; data?: BusinessAnalyticsData | null; message?: string }>;
    exportReviews: (id: string, businessSlugOrName?: string) => Promise<{ success: boolean; message?: string }>;
    clearSelectedBusiness: () => void;
}

export const BusinessContext = createContext<BusinessContextType | undefined>(undefined);