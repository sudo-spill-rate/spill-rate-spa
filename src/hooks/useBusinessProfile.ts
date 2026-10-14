import { useContext } from "react";
import { BusinessContext } from "../context/business/businessContext";

export const useBusinessProfile = () => {
    const context = useContext(BusinessContext);

    if (!context) {
        throw new Error("useBusinessProfile must be used within a BusinessProvider");
    }

    return {
        selectedBusiness: context.selectedBusiness,
        isLoading: context.isLoading,
        isCreating: context.isCreating,
        isUpdating: context.isUpdating,
        isDeleting: context.isDeleting,
        error: context.error,
        fetchBusinessBySlug: context.fetchBusinessBySlug,
        createBusiness: context.createBusiness,
        updateBusiness: context.updateBusiness,
        deleteBusiness: context.deleteBusiness,
        getAnalytics: context.getAnalytics,
        exportReviews: context.exportReviews,
        clearSelectedBusiness: context.clearSelectedBusiness,
    };
};

export default useBusinessProfile;