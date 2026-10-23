import React from "react";
import { ArrowRight, Users, Building, MessageSquare, AlertCircle } from "lucide-react";
import StatCard from "../../../../components/common/StatCard";
import MobileMetricsList from "../../../../components/common/MobileMetricsList";

export default function AdminOverviewSection({ overview, onNavigateTab }) {
  const stats = overview?.stats || {};
  const recentBusinesses = overview?.recent_businesses || [];

  const platformMetrics = [
    {
      title: "Registered Users",
      value: (stats.total_users ?? 0).toLocaleString(),
      subtitle: "Consumer & Merchant accounts",
      icon: Users,
    },
    {
      title: "Active Storefronts",
      value: (stats.total_businesses ?? 0).toLocaleString(),
      subtitle: "Directory Listings",
      icon: Building,
    },
    {
      title: "Verified Reviews",
      value: (stats.total_reviews ?? 0).toLocaleString(),
      subtitle: "Public Ratings",
      icon: MessageSquare,
    },
    {
      title: "Pending Reports",
      value: (stats.pending_reports ?? 0).toLocaleString(),
      subtitle:
        stats.pending_reports > 0
          ? "Requires moderation attention"
          : "All reports cleared",
      icon: AlertCircle,
      trend: stats.pending_reports > 0 ? "Action Needed" : "All Clear",
      trendType: stats.pending_reports > 0 ? "warning" : "positive",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Telemetry Metrics: Mobile List & Desktop Grid */}
      <div>
        {/* Mobile: Unified High-Density Key-Value Telemetry List */}
        <MobileMetricsList items={platformMetrics} />

        {/* Desktop: 4 Clean Stat Cards */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
          {platformMetrics.map((m, idx) => (
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

      {/* Newly Registered Storefronts */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 sm:p-5 shadow-xs">
        <div className="space-y-2.5 sm:space-y-3">
          <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Newly Registered Storefronts
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Latest merchants onboarded across the directory.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("businesses")}
              className="text-xs text-teal-700 hover:text-teal-800 font-semibold inline-flex items-center gap-1 cursor-pointer min-h-[44px] sm:min-h-[36px] px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-teal-700"
            >
              <span>View all storefronts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentBusinesses.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              No recent storefront registrations.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentBusinesses.map((biz) => (
                <div
                  key={biz.id || biz.slug}
                  className="py-3 flex items-center justify-between text-xs gap-3"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-900 truncate">
                        {biz.name}
                      </span>
                      {biz.is_verified && (
                        <img
                          src="/assets/verified-shield.png"
                          alt="Verified Storefront"
                          className="w-3.5 h-3.5 object-contain inline-block shrink-0 drop-shadow-2xs"
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {biz.category || "General"} &bull; /{biz.slug}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono shrink-0">
                    {biz.created_at
                      ? new Date(biz.created_at).toLocaleDateString()
                      : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
