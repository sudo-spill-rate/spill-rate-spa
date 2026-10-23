import React from "react";
import {
  FileText,
  Eye,
  Globe,
  Building2,
  ExternalLink,
  AlertCircle,
  Compass,
  Layers,
} from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import StatCard from "../../../components/common/StatCard";
import MobileMetricsList from "../../../components/common/MobileMetricsList";
import { useGAPages, useGAOverview } from "../../../hooks/useGoogleAnalytics";

export default function AdminGooglePagesPage() {
  const {
    data: pagesData = [],
    isLoading: isPagesLoading,
    isError: isPagesError,
    error: pagesError,
    refetch: refetchPages,
  } = useGAPages(50);

  const {
    data: gaData,
    isLoading: isOverviewLoading,
    refetch: refetchOverview,
  } = useGAOverview();

  const isLoading = isPagesLoading && isOverviewLoading;

  // Normalized resilient pages list
  const safePagesData = Array.isArray(pagesData) ? pagesData : [];
  const legacyPages = Array.isArray(gaData?.pages) ? gaData.pages : [];
  const rawList = safePagesData.length > 0 ? safePagesData : legacyPages;

  const isError = isPagesError && rawList.length === 0;

  const pagesList = rawList.map((p) => {
    const path = p.page_path || p.path || "/";
    const screen = p.screen_name || p.screen || path;
    const views = typeof p.views === "number" ? p.views : typeof p.pageviews === "number" ? p.pageviews : 0;
    const users = typeof p.users === "number" ? p.users : 0;
    return { path, screen, pageviews: views, users };
  });

  const totalPageviews =
    gaData?.last_30_days?.pageviews ||
    gaData?.totalPageviews ||
    pagesList.reduce((acc, p) => acc + (p.pageviews || 0), 0);

  const storefrontViews = pagesList
    .filter((p) => p.path?.startsWith("/business/"))
    .reduce((acc, p) => acc + (p.pageviews || 0), 0);

  const directoryViews = pagesList
    .filter((p) => p.path?.startsWith("/explore"))
    .reduce((acc, p) => acc + (p.pageviews || 0), 0);

  const homeViews = pagesList
    .filter((p) => p.path === "/" || p.path === "" || p.path === "/index.html")
    .reduce((acc, p) => acc + (p.pageviews || 0), 0);

  const storefrontPct = totalPageviews > 0 ? Math.round((storefrontViews / totalPageviews) * 100) : 0;
  const directoryPct = totalPageviews > 0 ? Math.round((directoryViews / totalPageviews) * 100) : 0;
  const homePct = totalPageviews > 0 ? Math.round((homeViews / totalPageviews) * 100) : 0;

  const pagesMetrics = [
    {
      title: "Total Pageviews",
      value: isLoading ? "--" : totalPageviews.toLocaleString(),
      subtitle: "Across all routes (30d)",
      icon: Eye,
      trend: totalPageviews > 0 ? "Indexed" : undefined,
      trendType: "positive",
    },
    {
      title: "Storefront Views",
      value: isLoading ? "--" : storefrontViews.toLocaleString(),
      subtitle: totalPageviews > 0 ? `${storefrontPct}% profile share` : "Merchant profiles",
      icon: Building2,
      trend: storefrontViews > 0 ? "High Intent" : undefined,
      trendType: "positive",
    },
    {
      title: "Explore Directory",
      value: isLoading ? "--" : directoryViews.toLocaleString(),
      subtitle: totalPageviews > 0 ? `${directoryPct}% catalog share` : "Discovery routes",
      icon: Compass,
    },
    {
      title: "Landing Page",
      value: isLoading ? "--" : homeViews.toLocaleString(),
      subtitle: totalPageviews > 0 ? `${homePct}% portal entries` : "Front entrance",
      icon: Globe,
    },
  ];

  // Helper to categorize route tags
  const getRouteCategory = (path = "") => {
    if (path.startsWith("/business/")) {
      return { label: "Storefront", bg: "bg-teal-50 text-teal-800 border-teal-200" };
    }
    if (path.startsWith("/explore")) {
      return { label: "Explore", bg: "bg-sky-50 text-sky-800 border-sky-200" };
    }
    if (path === "/" || path === "" || path === "/index.html") {
      return { label: "Homepage", bg: "bg-slate-100 text-slate-800 border-slate-200" };
    }
    if (path.startsWith("/admin")) {
      return { label: "Admin", bg: "bg-amber-50 text-amber-800 border-amber-200" };
    }
    if (path.startsWith("/about") || path.startsWith("/contact") || path.startsWith("/faq")) {
      return { label: "Legal/Info", bg: "bg-emerald-50 text-emerald-800 border-emerald-200" };
    }
    return { label: "General", bg: "bg-slate-50 text-slate-600 border-slate-200" };
  };

  return (
    <AdminLayout>
      <div className="w-full max-w-full min-w-0 space-y-3.5 sm:space-y-5">
        {/* Error Banner */}
        {isError && (
          <div className="p-3 sm:p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{pagesError?.message || "Failed to load page statistics."}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                refetchPages();
                refetchOverview();
              }}
              className="font-bold underline hover:no-underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Telemetry Metrics: Mobile List & Desktop Grid */}
        <div>
          <MobileMetricsList items={pagesMetrics} />

          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
            {pagesMetrics.map((m, idx) => (
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

        {/* Route Distribution Progress Bar */}
        {totalPageviews > 0 && (
          <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 sm:p-4.5 shadow-xs space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-700" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Route Traffic Allocation
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 tabular-nums">
                {totalPageviews.toLocaleString()} Total Pageviews
              </span>
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 flex-wrap gap-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-700" />
                  <span>Storefronts ({storefrontPct}%)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-600" />
                  <span>Directory ({directoryPct}%)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-600" />
                  <span>Homepage ({homePct}%)</span>
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-teal-700 transition-all duration-300"
                  style={{ width: `${storefrontPct}%` }}
                  title={`Storefronts: ${storefrontPct}%`}
                />
                <div
                  className="h-full bg-sky-600 transition-all duration-300"
                  style={{ width: `${directoryPct}%` }}
                  title={`Directory: ${directoryPct}%`}
                />
                <div
                  className="h-full bg-slate-600 transition-all duration-300"
                  style={{ width: `${homePct}%` }}
                  title={`Homepage: ${homePct}%`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Most Viewed URLs Table */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-3.5 sm:p-4.5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Most Viewed Routes (Last 30 Days)
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Ranked breakdown of routes with high user views and visitor density.
              </p>
            </div>
            {pagesList.length > 0 && (
              <span className="text-[11px] text-slate-500 font-medium">
                {pagesList.length} {pagesList.length === 1 ? "route" : "routes"}
              </span>
            )}
          </div>

          {pagesList.length > 0 ? (
            <>
              {/* Mobile View: High-density structured card list */}
              <div className="sm:hidden divide-y divide-slate-100">
                {pagesList.map((item, idx) => {
                  const category = getRouteCategory(item.path);
                  const sharePct =
                    totalPageviews > 0
                      ? Math.round(((item.pageviews || 0) / totalPageviews) * 100)
                      : 0;
                  return (
                    <div key={idx} className="p-3.5 space-y-2.5">
                      {/* Top Row: Path, Category, and Action Button */}
                      <div className="flex items-center justify-between gap-2 min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <code
                            className="font-mono text-slate-900 text-[11px] font-semibold bg-slate-100 px-2 py-0.5 rounded truncate max-w-[210px]"
                            title={item.path}
                          >
                            {item.path}
                          </code>
                          <span
                            className={`shrink-0 px-1.5 py-0.2 rounded text-[9px] font-semibold border ${category.bg}`}
                          >
                            {category.label}
                          </span>
                        </div>
                        <a
                          href={item.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 p-2 text-slate-500 hover:text-teal-700 active:bg-slate-100 rounded-lg cursor-pointer min-h-[44px] min-w-[44px] inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700"
                          title={`Open ${item.path} in new tab`}
                          aria-label={`Open ${item.path} in new tab`}
                        >
                          <ExternalLink className="w-4 h-4" aria-hidden="true" />
                          <span className="sr-only">(opens in new window)</span>
                        </a>
                      </div>

                      {/* Bottom Row: 3 Key Metrics Pills */}
                      <div className="grid grid-cols-3 gap-2 bg-slate-50/80 rounded-lg p-2 border border-slate-100 text-center">
                        <div>
                          <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Pageviews
                          </span>
                          <span className="text-xs font-bold text-slate-900 tabular-nums">
                            {(item.pageviews ?? 0).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Visitors
                          </span>
                          <span className="text-xs font-bold text-slate-700 tabular-nums">
                            {(item.users ?? 0).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Share
                          </span>
                          <span className="text-xs font-bold text-teal-800 tabular-nums">
                            {sharePct}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop / Tablet View: Full 5-column Data Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table
                  className="w-full text-left text-xs border-collapse"
                  aria-label="Top pages table"
                >
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
                      <th scope="col" className="px-3 sm:px-4 py-2.5 sm:py-3">
                        Route Path
                      </th>
                      <th
                        scope="col"
                        className="px-3 sm:px-4 py-2.5 sm:py-3 text-right"
                      >
                        Pageviews
                      </th>
                      <th
                        scope="col"
                        className="px-3 sm:px-4 py-2.5 sm:py-3 text-right"
                      >
                        Unique Visitors
                      </th>
                      <th
                        scope="col"
                        className="px-3 sm:px-4 py-2.5 sm:py-3 text-right"
                      >
                        Volume Share
                      </th>
                      <th
                        scope="col"
                        className="px-3 sm:px-4 py-2.5 sm:py-3 text-right"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px] sm:text-xs">
                    {pagesList.map((item, idx) => {
                      const category = getRouteCategory(item.path);
                      const sharePct =
                        totalPageviews > 0
                          ? Math.round(
                              ((item.pageviews || 0) / totalPageviews) * 100
                            )
                          : 0;
                      return (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="px-3 sm:px-4 py-2.5 sm:py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <code className="font-mono text-slate-900 text-[10px] sm:text-[11px] font-semibold bg-slate-100 px-1.5 sm:px-2 py-0.5 rounded">
                                {item.path}
                              </code>
                              <span
                                className={`px-1.5 sm:px-2 py-0.2 rounded text-[9px] sm:text-[10px] font-semibold border ${category.bg}`}
                              >
                                {category.label}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-2.5 sm:py-3.5 text-right font-mono tabular-nums text-slate-900 font-bold whitespace-nowrap">
                            {(item.pageviews || 0).toLocaleString()}
                          </td>
                          <td className="px-3 sm:px-4 py-2.5 sm:py-3.5 text-right font-mono tabular-nums text-slate-600 whitespace-nowrap">
                            {(item.users || 0).toLocaleString()}
                          </td>
                          <td className="px-3 sm:px-4 py-2.5 sm:py-3.5 text-right font-mono tabular-nums text-teal-800 font-semibold whitespace-nowrap">
                            {sharePct}%
                          </td>
                          <td className="px-3 sm:px-4 py-2.5 sm:py-3.5 text-right whitespace-nowrap">
                            <a
                              href={item.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-800 hover:underline p-1 min-h-[36px] items-center"
                              title={`Inspect live page ${item.path}`}
                            >
                              <span>Visit</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="bg-white p-8 sm:p-12 text-center max-w-md mx-auto space-y-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-500">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Awaiting Route Traffic Records
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  GA4 has not logged pageview records for this 30-day window yet. Top pages and route visit shares will appear as users interact with the app.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
