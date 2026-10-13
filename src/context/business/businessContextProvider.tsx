import React, {
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from "react";
import { BusinessContext } from "./businessContext";
import { Business, CreateBusinessPayload } from "../../types/business";
import { PaginationMeta } from "../../types/api";
import { businessService } from "../../services/businessService";
import { useUserAuth } from "../../hooks/useUserAuth";

interface BusinessProviderProps {
    children: ReactNode;
}

export const BusinessProvider: React.FC<BusinessProviderProps> = ({ children }) => {
    const { user } = useUserAuth();
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Kumuha ng listahan ng negosyo para sa naka-log in na may-ari (owner)
    const fetchBusinesses = useCallback(async (reset = false, limit = 10): Promise<void> => {
        if (!user?.id) {
            setBusinesses([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const res = await businessService.getOwnerBusinesses({
                limit,
                user_id: user?.id,
            });

            if (res.success) {
                // I-filter para sigurado na ang sariling businesses lang ng naka-log in ang makikita
                const ownerBusinesses = user?.id
                    ? (res.data || []).filter((b) => b.user_id === user.id)
                    : res.data || [];
                setBusinesses(ownerBusinesses);
                setPagination(res.pagination);
            } else {
                setError(res.message || "Failed to load businesses.");
            }
        } catch (err: any) {
            setError(err?.message || "Failed to load businesses.");
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    // Load more gamit ang cursor
    const loadMoreBusinesses = useCallback(async (): Promise<void> => {
        if (!pagination?.has_more || !pagination?.next_cursor || isLoadingMore) return;

        try {
            setIsLoadingMore(true);
            const res = await businessService.getOwnerBusinesses({
                cursor: pagination.next_cursor,
                limit: pagination.limit || 10,
                user_id: user?.id,
            });

            if (res.success) {
                const ownerBusinesses = user?.id
                    ? (res.data || []).filter((b) => b.user_id === user.id)
                    : res.data || [];
                setBusinesses((prev) => [...prev, ...ownerBusinesses]);
                setPagination(res.pagination);
            }
        } catch (err: any) {
            console.error("Load more businesses error:", err);
        } finally {
            setIsLoadingMore(false);
        }
    }, [pagination, isLoadingMore, user?.id]);

    // Kumuha ng single profile gamit ang slug
    const fetchBusinessBySlug = useCallback(async (slug: string): Promise<Business | null> => {
        try {
            setIsLoading(true);
            setError(null);

            const res = await businessService.getBusinessBySlug(slug);

            if (res.success && res.data) {
                setSelectedBusiness(res.data);
                return res.data;
            }

            setError(res.message || "Business profile not found.");
            setSelectedBusiness(null);
            return null;
        } catch (err: any) {
            setError(err?.message || "Business profile not found.");
            setSelectedBusiness(null);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Lumikha ng bagong negosyo gamit ang businessService
    const createBusiness = useCallback(async (
        payload: CreateBusinessPayload
    ): Promise<{ success: boolean; data?: Business; message?: string }> => {
        try {
            setIsCreating(true);
            setError(null);

            const res = await businessService.createBusiness(payload);

            if (res.success && res.data) {
                setBusinesses((prev) => [res.data!, ...prev]);
                return {
                    success: true,
                    data: res.data,
                    message: res.message || "Business created successfully!",
                };
            }

            setError(res.message || "Failed to create business.");
            return {
                success: false,
                message: res.message || "Failed to create business.",
            };
        } catch (err: any) {
            const message = err?.message || "Failed to create business.";
            setError(message);
            return { success: false, message };
        } finally {
            setIsCreating(false);
        }
    }, []);

    const clearSelectedBusiness = useCallback((): void => {
        setSelectedBusiness(null);
    }, []);

    // Re-fetch tuwing magbago ang user account o mag-mount
    useEffect(() => {
        fetchBusinesses();
    }, [fetchBusinesses]);

    return (
        <BusinessContext.Provider
            value={{
                businesses,
                selectedBusiness,
                pagination,
                isLoading,
                isLoadingMore,
                isCreating,
                error,
                fetchBusinesses,
                loadMoreBusinesses,
                fetchBusinessBySlug,
                createBusiness,
                clearSelectedBusiness,
            }}
        >
            {children}
        </BusinessContext.Provider>
    );
};

export default BusinessProvider;