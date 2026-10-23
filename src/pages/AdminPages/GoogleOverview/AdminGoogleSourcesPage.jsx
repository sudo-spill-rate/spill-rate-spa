import React from "react";
import {
  Globe,
  Share2,
  Compass,
  AlertCircle,
  Link2,
  ArrowUpRight,
  PieChart,
} from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import StatCard from "../../../components/common/StatCard";
import MobileMetricsList from "../../../components/common/MobileMetricsList";
import { useGASources, useGAOverview } from "../../../hooks/useGoogleAnalytics";

export default function AdminGoogleSourcesPage() {
  const {
    data: sourcesData = [],
    isLoading: isSourcesLoading,
    isError: isSourcesError,
    error: sourcesError,
    refetch: refetchSources,
  } = useGASources();

  const {
    data: gaData,
    isLoading: isOverviewLoading,
  } = useGAOverview();

  const isLoading = isSourcesLoading && isOverviewLoading;

  // Resilient source list
  const sourcesList =
    Array.isArray(sourcesData) && sourcesData.length > 0
      ? sourcesData
      : Array.isArray(gaData?.sources)
      ? gaData.sources
      : [];

  const isError = isSourcesError && sourcesList.length === 0;

  // Group metrics (support sessions or users count)
  const getWeight = (s) => (typeof s.sessions === "number" ? s.sessions : s.users || 0);

  const organicCount = sourcesList
    .filter((s) => s.medium === "organic" || s.source?.toLowerCase().includes("google") || s.source?.toLowerCase().includes("bing"))
    .reduce((acc, s) => acc + getWeight(s), 0);

  const directCount = sourcesList
    .filter((s) => s.source === "(direct)" || s.medium === "(none)")
    .reduce((acc, s) => acc + getWeight(s), 0);

  const socialCount = sourcesList
    .filter((s) => s.medium === "social" || /facebook|tiktok|instagram|twitter|x\.com|linkedin|reddit/i.test(s.source || ""))
    .reduce((acc, s) => acc + getWeight(s), 0);

  const referralCount = sourcesList
    .filter((s) => s.medium === "referral")
    .reduce((acc, s) => acc + getWeight(s), 0);

  const totalSessions = sourcesList.reduce((acc, s) => acc + getWeight(s), 0);
  const totalUsers = sourcesList.reduce((acc, s) => acc + (s.users || 0), 0);

  const organicPct = totalSessions > 0 ? Math.round((organicCount / totalSessions) * 100) : 0;
  const directPct = totalSessions > 0 ? Math.round((directCount / totalSessions) * 100) : 0;
  const socialPct = totalSessions > 0 ? Math.round((socialCount / totalSessions) * 100) : 0;
  const referralPct = totalSessions > 0 ? Math.round((referralCount / totalSessions) * 100) : 0;

  const sourcesMetrics = [
    {
      title: "Organic Search",
      value: isLoading ? "--" : organicCount.toLocaleString(),
      subtitle: totalSessions > 0 ? `${organicPct}% of total sessions` : "Search engines",
      icon: Globe,
      trend: organicCount > 0 ? "SEO Active" : undefined,
      trendType: "positive",
    },
    {
      title: "Direct Traffic",
      value: isLoading ? "--" : directCount.toLocaleString(),
      subtitle: totalSessions > 0 ? `${directPct}% direct URL access` : "Direct navigation",
      icon: ArrowUpRight,
      trend: directCount > 0 ? "Navigated" : undefined,
      trendType: "neutral",
    },
    {
      title: "Social Referrals",
      value: isLoading ? "--" : socialCount.toLocaleString(),
      subtitle: totalSessions > 0 ? `${socialPct}% via social networks` : "Social networks",
      icon: Share2,
    },
    {
      title: "Referrals & Links",
      value: isLoading ? "--" : referralCount.toLocaleString(),
      subtitle: totalSessions > 0 ? `${referralPct}% external domains` : "External domains & QR",
      icon: Link2,
    },
  ];

  // Helper to categorize channel tags
  const getChannelBadge = (source = "", medium = "") => {
    const s = source.toLowerCase();
    const m = medium.toLowerCase();

    if (m === "organic" || s.includes("google") || s.includes("bing") || s.includes("yahoo")) {
      return { label: "Search", bg: "bg-teal-50 text-teal-800 border-teal-200" };
    }
    if (s === "(direct)" || m === "(none)") {
      return { label: "Direct", bg: "bg-slate-100 text-slate-800 border-slate-200" };
    }
    if (m === "social" || /facebook|tiktok|instagram|twitter|x\.com|linkedin|reddit/i.test(s)) {
      return { label: "Social", bg: "bg-sky-50 text-sky-800 border-sky-200" };
    }
    if (m === "referral") {
      return { label: "Referral", bg: "bg-emerald-50 text-emerald-800 border-emerald-200" };
    }
    return { label: "Other", bg: "bg-slate-50 text-slate-600 border-slate-200" };
  };

  return (
    <AdminLayout>
      <div className="w-full max-w-full min-w-0 space-y-3.5 sm:space-y-5">
        {/* Error Banner */}
        {isError && (
          <div className="p-3 sm:p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{sourcesError?.message || "Failed to load traffic sources."}</span>
            </div>
            <button
              type="button"
              onClick={() => refetchSources()}
              className="font-bold underline hover:no-underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Telemetry Metrics: Mobile List & Desktop Grid */}
        <div>
          <MobileMetricsList items={sourcesMetrics} />

          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
            {sourcesMetrics.map((m, idx) => (
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

        {sourcesList.length > 0 ? (
          <>
            {/* Visual Channel Share Bar */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 sm:p-4.5 shadow-xs space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-teal-700" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Channel Acquisition Split
                  </h2>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 tabular-nums">
                  {totalSessions.toLocaleString()} Total Sessions
                </span>
              </div>

              <div className="space-y-1 sm:space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 flex-wrap gap-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-700" />
                    <span>Search ({organicPct}%)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-600" />
                    <span>Direct ({directPct}%)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-600" />
                    <span>Social ({socialPct}%)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>Referrals ({referralPct}%)</span>
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-teal-700 transition-all duration-300"
                    style={{ width: `${organicPct}%` }}
                    title={`Search: ${organicPct}%`}
                  />
                  <div
                    className="h-full bg-slate-600 transition-all duration-300"
                    style={{ width: `${directPct}%` }}
                    title={`Direct: ${directPct}%`}
                  />
                  <div
                    className="h-full bg-sky-600 transition-all duration-300"
                    style={{ width: `${socialPct}%` }}
                    title={`Social: ${socialPct}%`}
                  />
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300"
                    style={{ width: `${referralPct}%` }}
                    title={`Referrals: ${referralPct}%`}
                  />
                </div>
              </div>
            </div>

            {/* Inbound Acquisition Sources Breakdown Table */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Inbound Traffic Sources Breakdown
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Detailed performance per referrer domain, UTM campaign medium, and session count.
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 tabular-nums">
                  {sourcesList.length} distinct source(s)
                </span>
              </div>

              {/* Responsive Table / Card View */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="py-2.5 sm:py-3 px-3.5 sm:px-4">Channel / Source</th>
                      <th className="py-2.5 sm:py-3 px-3 sm:px-4">Medium</th>
                      <th className="py-2.5 sm:py-3 px-3 sm:px-4 text-right">Users</th>
                      <th className="py-2.5 sm:py-3 px-3.5 sm:px-4 text-right">Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {sourcesList.map((item, idx) => {
                      const badge = getChannelBadge(item.source, item.medium);
                      const volume = getWeight(item);
                      const pct = totalSessions > 0 ? ((volume / totalSessions) * 100).toFixed(1) : "0.0";

                      return (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2.5 sm:py-3 px-3.5 sm:px-4 font-mono font-semibold text-slate-900">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider shrink-0 ${badge.bg}`}
                              >
                                {badge.label}
                              </span>
                              <span className="truncate max-w-[180px] sm:max-w-xs">{item.source || "(direct)"}</span>
                            </div>
                          </td>
                          <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-slate-500 font-mono text-[11px]">
                            {item.medium || "(none)"}
                          </td>
                          <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-right tabular-nums font-mono">
                            {(item.users || 0).toLocaleString()}
                          </td>
                          <td className="py-2.5 sm:py-3 px-3.5 sm:px-4 text-right tabular-nums font-mono font-bold text-slate-900">
                            <div className="flex items-center justify-end gap-1.5">
                              <span>{volume.toLocaleString()}</span>
                              <span className="text-[10px] text-slate-400 font-normal">({pct}%)</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* High-Density Empty State */
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-8 sm:p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-500">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Awaiting Traffic Acquisition Data
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                GA4 property has not logged external campaign channels or referrer domains yet. Search engine, direct, and referral statistics will show up once organic visitors browse the site.
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
