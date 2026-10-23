import { api } from "../lib/api";
import {
    GAOverviewData,
    GAOverviewResponse,
    GARealtimeData,
    GARealtimeResponse,
    GAVisitorTrendItem,
    GAVisitorsResponse,
    GADeviceItem,
    GADevicesResponse,
    GASourceItem,
    GASourcesResponse,
    GAPageItem,
    GAPagesResponse,
} from "../types/googleAnalytics";
import { ApiResponse } from "../types/api";

class GoogleAnalyticsService {
    /**
     * Kumuha ng 30-day complete dashboard overview + realtime snapshot
     * GET /v1/api/google-analytics/overview
     * (May backward compatibility fallback sa GET /v1/api/admin/google-overview)
     */
    async getOverview(): Promise<ApiResponse<GAOverviewData | null>> {
        try {
            try {
                const response = await api.get<GAOverviewResponse>("/google-analytics/overview");
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message,
                };
            } catch {
                // Fallback sa legacy monolithic admin overview endpoint
                const fallbackRes = await api.get<{ success: boolean; message?: string; data: any }>("/admin/google-overview");
                return {
                    success: true,
                    data: fallbackRes.data.data,
                    message: fallbackRes.data.message,
                };
            }
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || error.message || "Failed to fetch Google Analytics overview",
            };
        }
    }

    /**
     * Kumuha ng realtime active concurrent visitors sa nakaraang 30 minuto
     * GET /v1/api/google-analytics/realtime
     */
    async getRealtime(): Promise<ApiResponse<GARealtimeData | null>> {
        try {
            try {
                const response = await api.get<GARealtimeResponse>("/google-analytics/realtime");
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message,
                };
            } catch {
                // Fallback kung monolithic endpoint ang available
                const fallbackRes = await api.get<{ success: boolean; message?: string; data: any }>("/admin/google-overview");
                const rt = fallbackRes.data?.data?.realtime;
                return {
                    success: true,
                    data: {
                        active_users: rt?.activeUsers ?? 0,
                        top_pages: (rt?.stream || []).map((s: any) => ({
                            page_path: s.screen || "/",
                            active_users: s.users || 0,
                        })),
                    },
                    message: "Loaded from overview cache",
                };
            }
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || error.message || "Failed to fetch realtime analytics",
            };
        }
    }

    /**
     * Kumuha ng daily visitor & pageview trends over time
     * GET /v1/api/google-analytics/visitors?days=:days
     */
    async getVisitors(days = 30): Promise<ApiResponse<GAVisitorTrendItem[]>> {
        try {
            try {
                const response = await api.get<GAVisitorsResponse>(`/google-analytics/visitors?days=${days}`);
                return {
                    success: true,
                    data: response.data.data || [],
                    message: response.data.message,
                };
            } catch {
                // Fallback sa overview legacy format
                const fallbackRes = await api.get<{ success: boolean; data: any }>("/admin/google-overview");
                const v = fallbackRes.data?.data?.visitors;
                return {
                    success: true,
                    data: [
                        {
                            date: new Date().toISOString().split("T")[0],
                            active_users: v?.totalUsers ?? 0,
                            new_users: v?.newUsers ?? 0,
                            pageviews: fallbackRes.data?.data?.totalPageviews ?? 0,
                        },
                    ],
                };
            }
        } catch (error: any) {
            return {
                success: false,
                data: [],
                message: error.response?.data?.message || error.message || "Failed to fetch visitor trends",
            };
        }
    }

    /**
     * Kumuha ng audience device breakdown (mobile, desktop, tablet)
     * GET /v1/api/google-analytics/devices
     */
    async getDevices(): Promise<ApiResponse<GADeviceItem[]>> {
        try {
            try {
                const response = await api.get<GADevicesResponse>("/google-analytics/devices");
                return {
                    success: true,
                    data: response.data.data || [],
                    message: response.data.message,
                };
            } catch {
                const fallbackRes = await api.get<{ success: boolean; data: any }>("/admin/google-overview");
                const v = fallbackRes.data?.data?.visitors;
                const total = v?.totalUsers || 100;
                const mobPct = v?.mobilePct ?? 65;
                const deskPct = v?.desktopPct ?? 35;
                return {
                    success: true,
                    data: [
                        { device: "mobile", users: Math.round((total * mobPct) / 100), sessions: Math.round((total * mobPct) / 100) },
                        { device: "desktop", users: Math.round((total * deskPct) / 100), sessions: Math.round((total * deskPct) / 100) },
                    ],
                };
            }
        } catch (error: any) {
            return {
                success: false,
                data: [],
                message: error.response?.data?.message || error.message || "Failed to fetch device statistics",
            };
        }
    }

    /**
     * Kumuha ng traffic acquisition sources (organic, direct, referral)
     * GET /v1/api/google-analytics/sources
     */
    async getSources(): Promise<ApiResponse<GASourceItem[]>> {
        try {
            try {
                const response = await api.get<GASourcesResponse>("/google-analytics/sources");
                return {
                    success: true,
                    data: response.data.data || [],
                    message: response.data.message,
                };
            } catch {
                const fallbackRes = await api.get<{ success: boolean; data: any }>("/admin/google-overview");
                return {
                    success: true,
                    data: fallbackRes.data?.data?.sources || [],
                };
            }
        } catch (error: any) {
            return {
                success: false,
                data: [],
                message: error.response?.data?.message || error.message || "Failed to fetch traffic sources",
            };
        }
    }

    /**
     * Kumuha ng most visited pages & screen URLs
     * GET /v1/api/google-analytics/pages?limit=:limit
     */
    async getPages(limit = 10): Promise<ApiResponse<GAPageItem[]>> {
        try {
            try {
                const response = await api.get<GAPagesResponse>(`/google-analytics/pages?limit=${limit}`);
                return {
                    success: true,
                    data: response.data.data || [],
                    message: response.data.message,
                };
            } catch {
                const fallbackRes = await api.get<{ success: boolean; data: any }>("/admin/google-overview");
                const legacyPages = fallbackRes.data?.data?.pages || [];
                return {
                    success: true,
                    data: legacyPages.map((p: any) => ({
                        page_path: p.path || "/",
                        screen_name: p.screen || p.path || "/",
                        views: p.pageviews || 0,
                        users: p.users || 0,
                    })),
                };
            }
        } catch (error: any) {
            return {
                success: false,
                data: [],
                message: error.response?.data?.message || error.message || "Failed to fetch top pages",
            };
        }
    }
}

export const googleAnalyticsService = new GoogleAnalyticsService();
export default googleAnalyticsService;
