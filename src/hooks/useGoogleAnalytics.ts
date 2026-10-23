import { useQuery } from "@tanstack/react-query";
import { googleAnalyticsService } from "../services/googleAnalyticsService";

/**
 * 30-Day Complete GA4 Dashboard Overview
 * Refetches every 30 seconds for live freshness
 */
export const useGAOverview = () => {
    return useQuery({
        queryKey: ["ga-overview"],
        queryFn: async () => {
            const res = await googleAnalyticsService.getOverview();
            if (!res.success) throw new Error(res.message || "Failed to fetch overview");
            return res.data;
        },
        refetchInterval: 30000,
        staleTime: 15000,
    });
};

/**
 * Realtime concurrent visitors in last 30 minutes
 * Refetches every 15 seconds
 */
export const useGARealtime = () => {
    return useQuery({
        queryKey: ["ga-realtime"],
        queryFn: async () => {
            const res = await googleAnalyticsService.getRealtime();
            if (!res.success) throw new Error(res.message || "Failed to fetch realtime data");
            return res.data;
        },
        refetchInterval: 15000,
        staleTime: 10000,
    });
};

/**
 * Day-by-day visitor and pageview trends
 */
export const useGAVisitors = (days = 30) => {
    return useQuery({
        queryKey: ["ga-visitors", days],
        queryFn: async () => {
            const res = await googleAnalyticsService.getVisitors(days);
            if (!res.success) throw new Error(res.message || "Failed to fetch visitor trends");
            return res.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Audience device distribution (mobile, desktop, tablet)
 */
export const useGADevices = () => {
    return useQuery({
        queryKey: ["ga-devices"],
        queryFn: async () => {
            const res = await googleAnalyticsService.getDevices();
            if (!res.success) throw new Error(res.message || "Failed to fetch device stats");
            return res.data;
        },
        staleTime: 1000 * 60 * 5,
    });
};

/**
 * Traffic acquisition sources
 */
export const useGASources = () => {
    return useQuery({
        queryKey: ["ga-sources"],
        queryFn: async () => {
            const res = await googleAnalyticsService.getSources();
            if (!res.success) throw new Error(res.message || "Failed to fetch traffic sources");
            return res.data;
        },
        staleTime: 1000 * 60 * 5,
    });
};

/**
 * Most viewed page URLs and screens
 */
export const useGAPages = (limit = 10) => {
    return useQuery({
        queryKey: ["ga-pages", limit],
        queryFn: async () => {
            const res = await googleAnalyticsService.getPages(limit);
            if (!res.success) throw new Error(res.message || "Failed to fetch top pages");
            return res.data;
        },
        staleTime: 1000 * 60 * 5,
    });
};

/**
 * Comprehensive bundle hook
 */
export const useGoogleAnalytics = () => {
    const overview = useGAOverview();
    const realtime = useGARealtime();
    const visitors = useGAVisitors();
    const devices = useGADevices();
    const sources = useGASources();
    const pages = useGAPages();

    return {
        overview,
        realtime,
        visitors,
        devices,
        sources,
        pages,
    };
};

export default useGoogleAnalytics;
