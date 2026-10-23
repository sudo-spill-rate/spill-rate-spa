/**
 * googleAnalytics.ts
 * Type contracts para sa Google Analytics 4 (GA4) Data API integration
 * Batay sa api_endpoint/google_analytics_api_endpoints.md
 */

// 1. Overview (/google-analytics/overview)
export interface GAOverviewLast30Days {
    active_users: number;
    new_users: number;
    pageviews: number;
    sessions: number;
    bounce_rate_pct: number;
    avg_session_duration_sec: number;
}

export interface GAOverviewData {
    realtime_active_users: number;
    last_30_days: GAOverviewLast30Days;
    // Fallback aliases kung sakaling monolithic legacy endpoint ang ibalik ng backend
    isConfigured?: boolean;
    realtime?: {
        activeUsers?: number;
        pageviewsPerMinute?: number;
        topScreen?: string;
        topDevice?: string;
        stream?: Array<{ screen: string; device: string; users: number }>;
    };
    visitors?: {
        totalUsers?: number;
        newUsers?: number;
        avgSessionDuration?: string;
        bounceRate?: string;
        mobilePct?: number;
        desktopPct?: number;
    };
    totalPageviews?: number;
    sources?: Array<{ source: string; medium: string; sessions: number; users: number }>;
    pages?: Array<{ path: string; screen: string; pageviews: number; users: number }>;
}

export interface GAOverviewResponse {
    success: true;
    message: string;
    data: GAOverviewData;
}

// 2. Realtime Active Visitors (/google-analytics/realtime)
export interface GARealtimePage {
    page_path: string;
    active_users: number;
}

export interface GARealtimeData {
    active_users: number;
    top_pages: GARealtimePage[];
}

export interface GARealtimeResponse {
    success: true;
    message: string;
    data: GARealtimeData;
}

// 3. Visitors & Pageviews Trends (/google-analytics/visitors)
export interface GAVisitorTrendItem {
    date: string; // YYYY-MM-DD
    active_users: number;
    new_users: number;
    pageviews: number;
}

export interface GAVisitorsResponse {
    success: true;
    message: string;
    data: GAVisitorTrendItem[];
}

// 4. Device Breakdown (/google-analytics/devices)
export interface GADeviceItem {
    device: "mobile" | "desktop" | "tablet" | string;
    users: number;
    sessions: number;
}

export interface GADevicesResponse {
    success: true;
    message: string;
    data: GADeviceItem[];
}

// 5. Traffic Acquisition Sources (/google-analytics/sources)
export interface GASourceItem {
    source: string;
    medium: string;
    users: number;
    sessions?: number;
}

export interface GASourcesResponse {
    success: true;
    message: string;
    data: GASourceItem[];
}

// 6. Top Pages & Content (/google-analytics/pages)
export interface GAPageItem {
    page_path: string;
    screen_name: string;
    views: number;
    users: number;
}

export interface GAPagesResponse {
    success: true;
    message: string;
    data: GAPageItem[];
}
