import React from "react";
import {
  BarChart3,
  Users,
  Eye,
  Activity,
  FileText,
  Smartphone,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import StatCard from "../../../components/common/StatCard";
import MobileMetricsList from "../../../components/common/MobileMetricsList";
import { useGAOverview, useGARealtime } from "../../../hooks/useGoogleAnalytics";

/**
 * Normalizes verbose page document titles into clean, concise screen labels.
 * E.g., "SpillRate - Discover, Review, and Rate Trusted Businesses" -> "Homepage"
 */
function formatScreenTitle(rawScreen = "") {
  if (!rawScreen || rawScreen === "None" || rawScreen === "(not set)") {
    return "None active";
  }

  const s = rawScreen.trim();

  // Primary Landing & Homepage detection
  if (
    s === "/" ||
    s.toLowerCase().includes("discover, review") ||
    s.toLowerCase().includes("trusted businesses") ||
    s.toLowerCase() === "homepage" ||
    s.toLowerCase() === "home" ||
    s.toLowerCase() === "spillrate"
  ) {
    return "Homepage";
  }

  // Strip brand prefix/suffix
  let cleaned = s
    .replace(/^SpillRate\s*[-|:]\s*/i, "")
    .replace(/\s*[-|:]\s*SpillRate$/i, "")
    .trim();

  // Clean specific routes
  if (cleaned.startsWith("/business/")) {
    const slug = cleaned.replace("/business/", "").split(/[?#]/)[0];
    return slug ? slug.replace(/[-_]/g, " ") : "Storefront";
  }
  if (cleaned.startsWith("/explore")) return "Explore Directory";
  if (cleaned.startsWith("/admin")) return "Admin Console";
  if (cleaned.startsWith("/auth") || cleaned.startsWith("/login") || cleaned.startsWith("/register")) return "Authentication";
  if (cleaned.startsWith("/about")) return "About SpillRate";
  if (cleaned.startsWith("/contact")) return "Contact Us";
  if (cleaned.startsWith("/faq")) return "FAQ";

  if (cleaned.length > 24) {
    return cleaned.slice(0, 22).trim() + "...";
  }

  return cleaned || "Homepage";
}

export default function AdminGoogleOverviewPage() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-G4Y4VXXVTF";
  const propertyId = import.meta.env.VITE_GA_PROPERTY_ID || "559884291";

  const {
    data: gaData,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
    error: overviewError,
    refetch: refetchOverview,
  } = useGAOverview();

  const {
    data: realtimeData,
    isLoading: isRealtimeLoading,
    isError: isRealtimeError,
    error: realtimeError,
    refetch: refetchRealtime,
  } = useGARealtime();

  const isLoading = isOverviewLoading && isRealtimeLoading;
  const isError = isOverviewError && isRealtimeError;
  const isConnected = Boolean(gaData?.isConfigured || gaData?.last_30_days || realtimeData);

  // Resilient variable extraction (supports both GA4 snake_case spec & camelCase fallback)
  const activeNow =
    realtimeData?.active_users ??
    gaData?.realtime_active_users ??
    gaData?.realtime?.activeUsers ??
    0;

  const rawTopScreen =
    realtimeData?.top_pages?.[0]?.page_path ||
    gaData?.realtime?.topScreen ||
    "None";
  const displayTopScreen = formatScreenTitle(rawTopScreen);

  const pageviewsPerMinute =
    gaData?.realtime?.pageviewsPerMinute ??
    Math.round(((gaData?.last_30_days?.pageviews || 0) / (30 * 24 * 60)) * 10) / 10;

  const topDevice =
    gaData?.realtime?.topDevice ||
    (gaData?.last_30_days ? "Mobile / Desktop" : "None");

  const overviewMetrics = [
    {
      title: "Active Visitors Now",
      value: isLoading ? "--" : String(activeNow),
      subtitle: "Live on site (last 30m)",
      icon: Activity,
      trend: "Real-time",
      trendType: "positive",
    },
    {
      title: "Pageviews / Min",
      value: isLoading ? "--" : String(pageviewsPerMinute),
      subtitle: "Current velocity",
      icon: Eye,
      trend: "Live",
      trendType: "neutral",
    },
    {
      title: "Top Active Screen",
      value: isLoading ? "--" : displayTopScreen,
      subtitle: rawTopScreen !== "None" && rawTopScreen !== displayTopScreen ? "Primary landing" : "Current active focus",
      icon: FileText,
      tooltip: rawTopScreen,
    },
    {
      title: "Top Device",
      value: isLoading ? "--" : topDevice,
      subtitle: "Primary platform",
      icon: Smartphone,
    },
  ];

  // Normalized realtime pages stream
  const realtimeStream =
    realtimeData?.top_pages?.map((p) => ({
      screen: p.page_path,
      device: "All Devices",
      users: p.active_users,
    })) ||
    gaData?.realtime?.stream ||
    [];

  return (
    <AdminLayout>
      <div className="w-full max-w-full min-w-0 space-y-3.5 sm:space-y-5">
        {/* Error Banner */}
        {isError && (
          <div className="p-3 sm:p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{overviewError?.message || realtimeError?.message || "Failed to load Google Analytics data."}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                refetchOverview();
                refetchRealtime();
              }}
              className="font-bold underline hover:no-underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Telemetry Metrics: Mobile List & Desktop Grid */}
        <div>
          {/* Mobile: Unified High-Density Key-Value Telemetry List */}
          <MobileMetricsList items={overviewMetrics} />

          {/* Desktop: 4 Real-time Stat Cards Grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
            {overviewMetrics.map((m, idx) => (
              <StatCard
                key={idx}
                title={m.title}
                value={m.value}
                subtitle={m.subtitle}
                icon={m.icon}
                trend={m.trend}
                trendType={m.trendType}
              />
            ))}
          </div>
        </div>

        {/* Live Real-Time Activity Stream Table */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 sm:p-4.5 shadow-xs space-y-2.5 sm:space-y-3">
          <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-700 animate-pulse" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Live Real-Time Activity Stream
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 sm:px-2.5 py-0.5 rounded-full border border-teal-200/90">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-ping" />
              <span>GA4 Polling</span>
            </span>
          </div>

          {realtimeStream.length > 0 ? (
            <div className="divide-y divide-slate-100 text-xs">
              {realtimeStream.map((item, idx) => {
                const screenLabel = formatScreenTitle(item.screen);
                return (
                  <div key={idx} className="py-2 sm:py-2.5 flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0" title={item.screen}>
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-teal-500 shrink-0 animate-pulse" />
                      <span className="font-mono text-[11px] sm:text-xs font-semibold text-slate-900 truncate">
                        {screenLabel}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200/60 shrink-0">
                        {item.device}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[11px] sm:text-xs text-slate-900 tabular-nums px-1.5 sm:px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200/70 shrink-0">
                      {item.users} {item.users === 1 ? "visitor" : "visitors"}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-5 sm:py-6 text-center text-xs text-slate-500 space-y-1">
              <p className="font-medium text-slate-700 text-xs">Awaiting live visitor events</p>
              <p className="text-[11px] text-slate-400">
                Browse your website in another tab or device to visualize incoming real-time hits.
              </p>
            </div>
          )}
        </div>

        {/* GA4 Property & Tagging Credentials Status Card */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs space-y-2.5 sm:space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-700" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Google Analytics 4 Telemetry Status
              </h3>
            </div>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isConnected
                  ? "bg-teal-50 text-teal-800 border-teal-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-teal-600" />
              <span>{isConnected ? "Active" : "Syncing"}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 text-xs pt-0.5">
            <div className="p-2 sm:p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex sm:block items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Measurement Tag
              </span>
              <code className="font-mono text-teal-800 font-bold text-xs mt-0 sm:mt-0.5 block">
                {measurementId}
              </code>
            </div>

            <div className="p-2 sm:p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex sm:block items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                GA4 Property ID
              </span>
              <code className="font-mono text-slate-800 font-bold text-xs mt-0 sm:mt-0.5 block">
                {propertyId}
              </code>
            </div>

            <div className="p-2 sm:p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex sm:block items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Protocol & Polling
              </span>
              <span className="font-mono text-slate-700 text-xs font-semibold mt-0 sm:mt-0.5 block">
                Data API v1beta / 15s-30s
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
