import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../services/adminService";
import {
    AdminReportsQuery,
    AddCategoryPayload,
    UpdateCategoryPayload,
    PromoteAdminPayload,
    AdminBusinessesQuery,
    AdminUsersQuery,
} from "../types/admin";

export const useAdmin = (reportsQuery?: AdminReportsQuery) => {
    const queryClient = useQueryClient();

    // 1. Fetch Overview (KPIs, recent businesses & reports)
    const overviewQuery = useQuery({
        queryKey: ["admin-overview"],
        queryFn: async () => {
            const res = await adminService.getOverview();
            if (res.success && res.data) {
                return res.data;
            }
            throw new Error(res.message || "Failed to load overview");
        },
        staleTime: 1000 * 30, // 30s
    });

    // 2. Fetch Global Reports
    const reportsQueryData = useQuery({
        queryKey: ["admin-reports", reportsQuery?.status, reportsQuery?.limit],
        queryFn: async () => {
            const res = await adminService.getReports(reportsQuery);
            if (res.success) {
                return res.data;
            }
            throw new Error(res.message || "Failed to load reports");
        },
        staleTime: 1000 * 30,
    });

    // 3. Fetch Platform Admins List
    const adminsQuery = useQuery({
        queryKey: ["admin-admins-list"],
        queryFn: async () => {
            const res = await adminService.getAdmins();
            if (res.success) {
                return res.data;
            }
            throw new Error(res.message || "Failed to load platform admins");
        },
        staleTime: 1000 * 60,
    });

    // 4. Toggle Business Verification
    const verifyMutation = useMutation({
        mutationFn: async ({ businessId, isVerified }: { businessId: string; isVerified: boolean }) => {
            const res = await adminService.verifyBusiness(businessId, isVerified);
            if (!res.success) throw new Error(res.message || "Failed to update verification");
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
            queryClient.invalidateQueries({ queryKey: ["admin-businesses-queue"] });
            queryClient.invalidateQueries({ queryKey: ["community-feed-businesses"] });
        },
    });

    // 5. Admin Delete Business
    const deleteBusinessMutation = useMutation({
        mutationFn: async (businessId: string) => {
            const res = await adminService.deleteBusiness(businessId);
            if (!res.success) throw new Error(res.message || "Failed to delete business");
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
            queryClient.invalidateQueries({ queryKey: ["admin-businesses-queue"] });
            queryClient.invalidateQueries({ queryKey: ["community-feed-businesses"] });
        },
    });

    // 6. Admin Delete Toxic Review
    const deleteReviewMutation = useMutation({
        mutationFn: async (reviewId: string) => {
            const res = await adminService.deleteReview(reviewId);
            if (!res.success) throw new Error(res.message || "Failed to delete review");
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
            queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
        },
    });

    // 7. Add Category
    const addCategoryMutation = useMutation({
        mutationFn: async (payload: AddCategoryPayload) => {
            const res = await adminService.addCategory(payload);
            if (!res.success) throw new Error(res.message || "Failed to add category");
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["business-categories"] });
        },
    });

    // 8. Update Category
    const updateCategoryMutation = useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: UpdateCategoryPayload }) => {
            const res = await adminService.updateCategory(id, payload);
            if (!res.success) throw new Error(res.message || "Failed to update category");
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["business-categories"] });
        },
    });

    // 9. Delete Category
    const deleteCategoryMutation = useMutation({
        mutationFn: async (categoryId: string) => {
            const res = await adminService.deleteCategory(categoryId);
            if (!res.success) throw new Error(res.message || "Failed to delete category");
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["business-categories"] });
        },
    });

    // 10. Promote User to Admin
    const promoteMutation = useMutation({
        mutationFn: async (payload: PromoteAdminPayload) => {
            const res = await adminService.promoteAdmin(payload);
            if (!res.success) throw new Error(res.message || "Failed to promote account");
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-admins-list"] });
            queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
        },
    });

    // 11. Revoke Admin Access
    const revokeMutation = useMutation({
        mutationFn: async (email: string) => {
            const res = await adminService.revokeAdmin(email);
            if (!res.success) throw new Error(res.message || "Failed to revoke admin privileges");
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-admins-list"] });
            queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
        },
    });

    // 12. Ban / Unban User
    const banUserMutation = useMutation({
        mutationFn: async ({ userId, isBanned }: { userId: string; isBanned: boolean }) => {
            const res = await adminService.banUser(userId, isBanned);
            if (!res.success) throw new Error(res.message || "Failed to update user ban status");
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
            queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
        },
    });

    return {
        // Data & Loading States
        overview: overviewQuery.data,
        isLoadingOverview: overviewQuery.isLoading,
        overviewError: overviewQuery.error?.message,
        refetchOverview: overviewQuery.refetch,

        reports: reportsQueryData.data || [],
        isLoadingReports: reportsQueryData.isLoading,
        reportsError: reportsQueryData.error?.message,
        refetchReports: reportsQueryData.refetch,

        admins: adminsQuery.data || [],
        isLoadingAdmins: adminsQuery.isLoading,
        adminsError: adminsQuery.error?.message,
        refetchAdmins: adminsQuery.refetch,

        // Actions
        verifyBusiness: verifyMutation.mutateAsync,
        isVerifying: verifyMutation.isPending,

        deleteBusiness: deleteBusinessMutation.mutateAsync,
        isDeletingBusiness: deleteBusinessMutation.isPending,

        deleteReview: deleteReviewMutation.mutateAsync,
        isDeletingReview: deleteReviewMutation.isPending,

        addCategory: addCategoryMutation.mutateAsync,
        isAddingCategory: addCategoryMutation.isPending,

        updateCategory: updateCategoryMutation.mutateAsync,
        isUpdatingCategory: updateCategoryMutation.isPending,

        deleteCategory: deleteCategoryMutation.mutateAsync,
        isDeletingCategory: deleteCategoryMutation.isPending,

        promoteAdmin: promoteMutation.mutateAsync,
        isPromoting: promoteMutation.isPending,

        revokeAdmin: revokeMutation.mutateAsync,
        isRevoking: revokeMutation.isPending,

        banUser: banUserMutation.mutateAsync,
        isBanningUser: banUserMutation.isPending,
    };
};

/**
 * Hook para sa Admin Businesses Queue (GET /v1/api/admin/businesses)
 */
export const useAdminBusinesses = (query?: AdminBusinessesQuery) => {
    return useQuery({
        queryKey: ["admin-businesses-queue", query?.status, query?.search, query?.limit, query?.cursor],
        queryFn: async () => {
            const res = await adminService.getBusinesses(query);
            if (res.success) {
                return {
                    businesses: res.data || [],
                    pagination: res.pagination,
                };
            }
            throw new Error(res.message || "Failed to fetch admin businesses");
        },
        staleTime: 1000 * 30,
    });
};

/**
 * Hook para sa Platform User Directory & Moderation (GET /v1/api/admin/users)
 */
export const useAdminUsers = (query?: AdminUsersQuery) => {
    return useQuery({
        queryKey: ["admin-users-list", query?.search, query?.role, query?.limit, query?.cursor],
        queryFn: async () => {
            const res = await adminService.getUsers(query);
            if (res.success) {
                return {
                    users: res.data || [],
                    pagination: res.pagination,
                };
            }
            throw new Error(res.message || "Failed to fetch users");
        },
        staleTime: 1000 * 30,
    });
};

export default useAdmin;
