import React from "react";
import { Link, useLocation } from "react-router";
import { Shield } from "lucide-react";
import { useBusinessDirectory } from "../../../../hooks/useBusinessDirectory";
import { useUserAuth } from "../../../../hooks/useUserAuth";

export default function MerchantDashboardSidebar() {
  const location = useLocation();
  const { businesses } = useBusinessDirectory();
  const { user } = useUserAuth();

  const businessList = businesses || [];
  const businessCount = businessList.length;
  const quotaLimit = 5;

  return (
    <aside
      className="hidden lg:block w-64 shrink-0"
      aria-label="Merchant sidebar navigation"
    >
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col divide-y divide-slate-100">
        {/* Navigation Menu */}
        <div className="p-3">
          <nav className="space-y-0.5" aria-label="Main merchant navigation">
            <Link
              to="/dashboard"
              className={`flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors min-h-[36px] ${
                location.pathname === "/dashboard"
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span>Dashboard Overview</span>
            </Link>

            <Link
              to="/dashboard/explore"
              className={`flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors min-h-[36px] ${
                location.pathname === "/dashboard/explore"
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span>Explore Directory</span>
            </Link>

            {(user?.is_admin || user?.role === "admin" || user?.role === "founder") && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 transition-colors min-h-[36px] mt-2"
              >
                <Shield className="w-3.5 h-3.5 text-teal-700" />
                <span>Admin Portal</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Bottom: Quota Indicator */}
        <div className="p-3.5 bg-slate-50/50">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="font-semibold text-slate-700">Quota Limit</span>
            <span className="text-slate-500 font-medium">
              {businessCount} of {quotaLimit} active
            </span>
          </div>
          <div
            className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden"
            role="progressbar"
            aria-valuenow={businessCount}
            aria-valuemin={0}
            aria-valuemax={quotaLimit}
          >
            <div
              className={`h-full transition-all duration-300 ${
                businessCount >= quotaLimit ? "bg-amber-600" : "bg-teal-700"
              }`}
              style={{
                width: `${Math.min(100, (businessCount / quotaLimit) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
