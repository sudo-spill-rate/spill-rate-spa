import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  PlusCircle,
  Building,
  AlertTriangle,
  RotateCw,
  Search,
  CheckCircle2,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PortfolioStatsOverview from "../components/dashboard/PortfolioStatsOverview";
import BusinessLimitBanner from "../components/dashboard/BusinessLimitBanner";
import OwnerBusinessCard from "../components/dashboard/OwnerBusinessCard";
import { useBusinessDirectory } from "../../../hooks/useBusinessDirectory";

export default function BusinessDashboardPage() {
  const {
    businesses,
    pagination,
    isLoading,
    isLoadingMore,
    error,
    fetchBusinesses,
    loadMoreBusinesses,
  } = useBusinessDirectory();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const filteredBusinesses = (businesses || []).filter((b) => {
    if (!searchQuery.trim()) return true;
    return (
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const businessCount = businesses?.length || 0;
  const canCreateMore = businessCount < 5;

  return (
    <DashboardLayout
      title="Business Dashboard"
      description="Manage your registered business profiles, inspect real customer feedback, and moderate public testimonials."
      action={
        canCreateMore && businessCount > 0 ? (
          <Link
            to="/dashboard/business/new"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors min-h-[38px] w-full sm:w-auto shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Business</span>
          </Link>
        ) : null
      }
    >
      {/* 1. Loading Skeleton */}
      {isLoading && (!businesses || businesses.length === 0) && (
        <div className="space-y-6" aria-busy="true" aria-label="Loading your dashboard">
          {/* Skeleton Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse"
              >
                <div className="h-4 w-24 bg-slate-200 rounded mb-3" />
                <div className="h-8 w-16 bg-slate-200 rounded mb-2" />
                <div className="h-3 w-32 bg-slate-100 rounded" />
              </div>
            ))}
          </div>

          {/* Skeleton Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse space-y-4"
              >
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-slate-200 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-48 bg-slate-200 rounded" />
                    <div className="h-3 w-28 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="h-10 bg-slate-100 rounded-lg" />
                <div className="h-12 bg-slate-50 rounded" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Error State */}
      {!isLoading && error && (
        <div
          role="alert"
          className="p-6 rounded-xl bg-white border border-red-200 text-slate-800 shadow-sm mb-6"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-base font-bold text-slate-900">
                Failed to load your business dashboard
              </h2>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                {error}
              </p>
              <button
                type="button"
                onClick={() => fetchBusinesses()}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors min-h-[44px]"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Empty State (No businesses yet) */}
      {!isLoading && !error && businessCount === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto mb-4">
            <Building className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            No businesses registered yet
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Create your first business profile to get a public rating page, collect verified feedback, and moderate customer testimonials.
          </p>
          <div className="mt-6">
            <Link
              to="/dashboard/business/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors min-h-[44px] shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Your First Business</span>
            </Link>
          </div>
        </div>
      )}

      {/* 4. Active Portfolio Content */}
      {!isLoading && !error && businessCount > 0 && (
        <div>
          {/* Portfolio Metric Overview */}
          <PortfolioStatsOverview businesses={businesses} />

          {/* Quota Reached Alert only if at 5/5 */}
          {businessCount >= 5 && (
            <BusinessLimitBanner count={businessCount} maxLimit={5} />
          )}

          {/* Section Header & Local Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Active Storefronts ({filteredBusinesses.length} of {businessCount})
            </h2>

            {businessCount > 2 && (
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="dashboard-search-input"
                  name="search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by name or category..."
                  aria-label="Filter registered businesses"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 min-h-[44px]"
                />
              </div>
            )}
          </div>

          {/* Business Cards Grid */}
          {filteredBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredBusinesses.map((biz) => (
                <OwnerBusinessCard key={biz.id || biz.slug} business={biz} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <p className="text-xs text-slate-500">
                No businesses match your filter &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-2 text-xs font-semibold text-teal-700 hover:text-teal-800 underline"
              >
                Clear search filter
              </button>
            </div>
          )}

          {/* Cursor Pagination Button */}
          {pagination?.has_more && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={loadMoreBusinesses}
                disabled={isLoadingMore}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors min-h-[44px] shadow-sm disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-teal-600" />
                    <span>Loading more businesses...</span>
                  </>
                ) : (
                  <span>Load More Businesses</span>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}