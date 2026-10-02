import React from "react";
import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Building,
  CheckCircle2,
  Compass,
} from "lucide-react";
import { useBusinessDirectory } from "../../../../hooks/useBusinessDirectory";

export default function DashboardSidebar({ activeBusinessSlug }) {
  const location = useLocation();
  const { businesses } = useBusinessDirectory();
  const businessCount = businesses?.length || 0;
  const quotaLimit = 5;
  const quotaPercentage = Math.min(100, Math.round((businessCount / quotaLimit) * 100));

  return (
    <aside
      className="hidden lg:block w-64 shrink-0 space-y-6"
      aria-label="Dashboard secondary navigation"
    >
      {/* Navigation Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">
          Navigation
        </h2>
        <nav className="space-y-1">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors min-h-[44px] ${
              location.pathname === "/dashboard"
                ? "bg-teal-50 text-teal-800 font-semibold border border-teal-200"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-slate-500" />
            <span>Dashboard Overview</span>
          </Link>

          <Link
            to="/dashboard/explore"
            className={`flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors min-h-[44px] ${
              location.pathname === "/dashboard/explore"
                ? "bg-teal-50 text-teal-800 font-semibold border border-teal-200"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Compass className="w-4 h-4 text-slate-500" />
            <span>Directory Explorer</span>
          </Link>
        </nav>
      </div>

      {/* Registered Businesses Quick List */}
      {businesses && businesses.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3 px-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Your Businesses
            </h2>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {businessCount}
            </span>
          </div>

          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            {businesses.map((biz) => {
              const isSelected =
                activeBusinessSlug === biz.slug ||
                location.pathname.includes(`/dashboard/business/${biz.slug}`);

              return (
                <Link
                  key={biz.id || biz.slug}
                  to={`/dashboard/business/${biz.slug}`}
                  className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors min-h-[40px] ${
                    isSelected
                      ? "bg-slate-100 text-slate-900 font-semibold border-l-2 border-teal-600"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{biz.name}</span>
                  </div>
                  {biz.is_verified && (
                    <CheckCircle2
                      className="w-3.5 h-3.5 text-teal-600 shrink-0"
                      aria-label="Verified business"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Quota Usage Meter */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700">Account Quota</span>
          <span className="text-xs font-semibold text-slate-600">
            {businessCount} of {quotaLimit} used
          </span>
        </div>

        {/* Progress Track */}
        <div
          className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-2.5"
          role="progressbar"
          aria-valuenow={businessCount}
          aria-valuemin={0}
          aria-valuemax={quotaLimit}
          aria-label="Business quota usage"
        >
          <div
            className={`h-full transition-all duration-300 ${
              businessCount >= quotaLimit ? "bg-amber-600" : "bg-teal-600"
            }`}
            style={{ width: `${quotaPercentage}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          {businessCount >= quotaLimit
            ? "You have reached the maximum free limit of 5 business profiles."
            : `You can register ${quotaLimit - businessCount} more business profiles under your account.`}
        </p>
      </div>
    </aside>
  );
}