import React, { useState } from "react";
import { Link, useLocation } from "react-router";

import { useUserAuth } from "../../../../hooks/useUserAuth";
import { useAdmin } from "../../../../hooks/useAdmin";
import PromoteAdminModal from "../promote/PromoteAdminModal";

export default function AdminDashboardSidebar({
  pendingReportsCount: propCount,
  onOpenPromoteModal,
}) {
  const location = useLocation();
  const { user } = useUserAuth();
  const { overview } = useAdmin();
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);

  const isFounder = user?.role === "founder";
  const pendingReportsCount =
    typeof propCount === "number" ? propCount : overview?.stats?.pending_reports || 0;

  const handleOpenPromote = () => {
    if (onOpenPromoteModal) {
      onOpenPromoteModal();
    } else {
      setIsPromoteModalOpen(true);
    }
  };

  const isOverviewActive =
    location.pathname === "/admin/overview" ||
    location.pathname === "/admin/dashboard" ||
    location.pathname === "/admin";

  const isReportsActive = location.pathname === "/admin/reports";
  const isStorefrontsActive = location.pathname === "/admin/storefronts";
  const isCategoriesActive = location.pathname === "/admin/categories";
  const isDirectoryActive = location.pathname === "/admin/directory";

  return (
    <aside
      className="w-full lg:w-64 shrink-0"
      aria-label="Admin sidebar navigation"
    >
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col divide-y divide-slate-100">
        {/* Top: Founder / Admin Platform Status */}
        <div className="p-3.5 bg-slate-50/50">
          <div className="px-3 py-2.5 rounded-xl bg-white border border-slate-200">
            <div>
              <span className="font-bold text-xs text-slate-900 block truncate">
                Platform Admin
              </span>
              <span className="text-[10px] text-slate-500 font-medium block truncate">
                SpillRate Governance
              </span>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Access Level</span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  isFounder
                    ? "bg-teal-50 text-teal-800 border border-teal-200"
                    : "bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                {isFounder ? "Founder" : "Admin"}
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Admin Dedicated Subroutes */}
        <div className="p-3">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Platform Workspace
          </div>
          <nav className="space-y-0.5 mt-1" aria-label="Admin routes">
            <Link
              to="/admin/overview"
              className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors min-h-[36px] ${
                isOverviewActive
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span>Overview</span>
            </Link>

            <Link
              to="/admin/reports"
              className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors min-h-[36px] ${
                isReportsActive
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span>Flagged Reports</span>
              {pendingReportsCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-red-600 text-white">
                  {pendingReportsCount}
                </span>
              )}
            </Link>

            <Link
              to="/admin/storefronts"
              className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors min-h-[36px] ${
                isStorefrontsActive
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span>Storefronts</span>
            </Link>

            <Link
              to="/admin/categories"
              className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors min-h-[36px] ${
                isCategoriesActive
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span>Categories</span>
            </Link>

            <Link
              to="/admin/directory"
              className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors min-h-[36px] ${
                isDirectoryActive
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span>Platform Directory</span>
            </Link>
          </nav>

          {/* Exclusive Founder Storefront Section */}
          <div className="my-2 border-t border-slate-100" />
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Founder Storefront
          </div>
          <nav className="space-y-0.5 mt-1" aria-label="Founder storefront routes">
            <Link
              to="/admin/my-store"
              className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors min-h-[36px] ${
                location.pathname.startsWith("/admin/my-store")
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span>My Storefront</span>
            </Link>
          </nav>
        </div>

        {/* Bottom: Founder Action & Status */}
        <div className="p-3.5 bg-slate-50/50 space-y-2">
          {isFounder && (
            <button
              type="button"
              onClick={handleOpenPromote}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold cursor-pointer min-h-[36px] transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700"
            >
              <span>Promote Admin</span>
            </button>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Founder Portal</span>
            <span className="font-mono text-[10px] text-slate-400">Platform v1.0</span>
          </div>
        </div>
      </div>

      <PromoteAdminModal
        isOpen={isPromoteModalOpen}
        onClose={() => setIsPromoteModalOpen(false)}
      />
    </aside>
  );
}
