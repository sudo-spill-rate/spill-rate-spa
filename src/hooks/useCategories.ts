import { useQuery } from "@tanstack/react-query";
import { businessService } from "../services/businessService";
import { Category } from "../types/business";

const FALLBACK_CATEGORIES: Category[] = [
    { id: "1", name: "Food & Beverage", slug: "food-beverage", icon: "utensils" },
    { id: "2", name: "Retail & Shopping", slug: "retail-shopping", icon: "shopping-bag" },
    { id: "3", name: "Health & Wellness", slug: "health-wellness", icon: "heart-pulse" },
    { id: "4", name: "Technology & IT", slug: "technology-it", icon: "cpu" },
    { id: "5", name: "Professional Services", slug: "professional-services", icon: "briefcase" },
    { id: "6", name: "Automotive", slug: "automotive", icon: "car" },
    { id: "7", name: "Hospitality & Tourism", slug: "hospitality-tourism", icon: "hotel" },
    { id: "8", name: "Beauty & Personal Care", slug: "beauty-personal-care", icon: "sparkles" },
    { id: "9", name: "Education", slug: "education", icon: "graduation-cap" },
    { id: "10", name: "Other", slug: "other", icon: "tag" },
];

export const useCategories = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["business-categories"],
        queryFn: async () => {
            const res = await businessService.getCategories();
            if (res.success && Array.isArray(res.data) && res.data.length > 0) {
                return res.data;
            }
            return FALLBACK_CATEGORIES;
        },
        staleTime: 1000 * 60 * 30, // 30 minutes
        initialData: FALLBACK_CATEGORIES,
    });

    return {
        categories: data || FALLBACK_CATEGORIES,
        isLoading,
        error,
        refetch,
    };
};

export default useCategories;
