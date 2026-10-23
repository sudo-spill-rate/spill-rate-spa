import React from "react";
import { useNavigate } from "react-router";
import { AlertTriangle } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import AdminOverviewSection from "../components/overview/AdminOverviewSection";
import { useAdmin } from "../../../hooks/useAdmin";

export default function AdminOverviewPage() {
  const navigate = useNavigate();
  const { overview, overviewError } = useAdmin();

  return (
    <AdminLayout>
      <div className="w-full max-w-full min-w-0 space-y-4 sm:space-y-6">
        {overviewError && (
          <div className="p-3.5 sm:p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <span>Failed to load platform overview: {overviewError}</span>
          </div>
        )}

        <AdminOverviewSection
          overview={overview}
          onNavigateTab={(tab) => {
            const routeMap = {
              reports: "/admin/platform/reports",
              businesses: "/admin/platform/storefronts",
              categories: "/admin/platform/categories",
            };
            navigate(routeMap[tab] || "/admin");
          }}
        />
      </div>
    </AdminLayout>
  );
}
