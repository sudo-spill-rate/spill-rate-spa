import React from "react";
import { useNavigate } from "react-router";
import { RotateCw, AlertTriangle } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import AdminOverviewSection from "../components/overview/AdminOverviewSection";
import { useAdmin } from "../../../hooks/useAdmin";

export default function AdminOverviewPage() {
  const navigate = useNavigate();
  const { overview, isLoadingOverview, overviewError, refetchOverview } = useAdmin();

  return (
    <AdminLayout
      title="Platform Overview"
      description="Inspect cross-platform operational statistics, live user registrations, and system health."
      actions={
        <button
          type="button"
          onClick={() => refetchOverview()}
          disabled={isLoadingOverview}
          className="p-2 border border-slate-300 rounded-lg bg-white text-slate-700 hover:bg-slate-50 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
          title="Refresh overview metrics"
          aria-label="Refresh overview metrics"
        >
          <RotateCw className={`w-4 h-4 ${isLoadingOverview ? "animate-spin text-teal-700" : ""}`} />
        </button>
      }
    >
      <div className="space-y-6">
        {overviewError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <span>Failed to load platform overview: {overviewError}</span>
          </div>
        )}

        <AdminOverviewSection
          overview={overview}
          onNavigateTab={(tab) => {
            const routeMap = {
              reports: "/admin/reports",
              businesses: "/admin/storefronts",
              categories: "/admin/categories",
            };
            navigate(routeMap[tab] || "/admin/overview");
          }}
        />
      </div>
    </AdminLayout>
  );
}
