import React from "react";
import { ArrowRight, CheckCircle2, Users, Building, MessageSquare, AlertCircle } from "lucide-react";
import StatCard from "../../../../components/common/StatCard";

export default function AdminOverviewSection({ overview, onNavigateTab }) {
  const stats = overview?.stats || {};
  const recentBusinesses = overview?.recent_businesses || [];
  const recentFlagged = overview?.recent_flagged_reviews || [];

  return (
    <div className="space-y-6">
      {/* 4 Clean Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Registered Users"
          value={stats.total_users ?? "0"}
          subtitle="Consumer & Merchant"
          icon={Users}
        />
        <StatCard
          title="Active Storefronts"
          value={stats.total_businesses ?? "0"}
          subtitle="Directory Listings"
          icon={Building}
        />
        <StatCard
          title="Verified Reviews"
          value={stats.total_reviews ?? "0"}
          subtitle="Public Ratings"
          icon={MessageSquare}
        />
        <StatCard
          title="Pending Reports"
          value={stats.pending_reports ?? "0"}
          subtitle={
            stats.pending_reports > 0
              ? "Requires Moderation"
              : "All clear"
          }
          icon={AlertCircle}
          trend={stats.pending_reports > 0 ? "Action Needed" : "All Clear"}
          trendType={stats.pending_reports > 0 ? "warning" : "positive"}
        />
      </div>

      {/* Two Columns: Recent Storefronts & Recent Flagged Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Storefronts */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Newly Registered Storefronts
              </h2>
              <button
                type="button"
                onClick={() => onNavigateTab("businesses")}
                className="text-xs text-teal-700 hover:text-teal-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View all</span>
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
                    className="py-2.5 flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900 truncate">
                          {biz.name}
                        </span>
                        {biz.is_verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {biz.category || "General"} &bull; /{biz.slug}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono shrink-0">
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

        {/* Recent Flagged Reports */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Recent Flagged Reviews
              </h2>
              <button
                type="button"
                onClick={() => onNavigateTab("reports")}
                className="text-xs text-teal-700 hover:text-teal-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Moderate queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentFlagged.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                No open moderation reports.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentFlagged.map((r) => (
                  <div
                    key={r.id}
                    className="py-2.5 flex items-center justify-between text-xs gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 truncate">
                        {r.reason}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        Store: <span className="font-medium text-slate-700">{r.business_name}</span> &bull; By: {r.reporter_email || "User"}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                      {r.status || "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
