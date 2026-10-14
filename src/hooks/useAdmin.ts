import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../services/adminService";
import { AdminReportsQuery, AddCategoryPayload, PromoteAdminPayload } from "../types/admin";

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
        queryKey: ["admin-reports", reportsQuery?.status],
        queryFn: async () => {
            const res = await adminService.getReports(reportsQuery);
            if (res.success) {
                return res.data;
            }
            throw new Error(res.message || "Failed to load reports");
        },
        staleTime: 1000 * 30,
    });

    // 3. Toggle Business Verification
    const verifyMutation = useMutation({
        mutationFn: async ({ businessId, isVerified }: { businessId: string; isVerified: boolean }) => {
            const res = await adminService.verifyBusiness(businessId, isVerified);
            if (!res.success) throw new Error(res.message || "Failed to update verification");
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
            queryClient.invalidateQueries({ queryKey: ["community-feed-businesses"] });
        },
    });

    // 4. Admin Delete Business
    const deleteBusinessMutation = useMutation({
        mutationFn: async (businessId: string) => {
            const res = await adminService.deleteBusiness(businessId);
            if (!res.success) throw new Error(res.message || "Failed to delete business");
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
            queryClient.invalidateQueries({ queryKey: ["community-feed-businesses"] });
        },
    });

    // 5. Admin Delete Toxic Review
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

    // 6. Add Category
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

    // 7. Delete Category
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

    // 8. Promote User to Admin
    const promoteMutation = useMutation({
        mutationFn: async (payload: PromoteAdminPayload) => {
            const res = await adminService.promoteAdmin(payload);
            if (!res.success) throw new Error(res.message || "Failed to promote account");
            return res.data;
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

        // Actions
        verifyBusiness: verifyMutation.mutateAsync,
        isVerifying: verifyMutation.isPending,

        deleteBusiness: deleteBusinessMutation.mutateAsync,
        isDeletingBusiness: deleteBusinessMutation.isPending,

        deleteReview: deleteReviewMutation.mutateAsync,
        isDeletingReview: deleteReviewMutation.isPending,

        addCategory: addCategoryMutation.mutateAsync,
        isAddingCategory: addCategoryMutation.isPending,

        deleteCategory: deleteCategoryMutation.mutateAsync,
        isDeletingCategory: deleteCategoryMutation.isPending,

        promoteAdmin: promoteMutation.mutateAsync,
        isPromoting: promoteMutation.isPending,
    };
};

export default useAdmin;
