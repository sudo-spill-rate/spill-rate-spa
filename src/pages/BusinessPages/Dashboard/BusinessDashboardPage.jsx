import React, { useEffect } from "react";
import { Link, useLocation } from "react-router";
import {
  PlusCircle,
  Building,
  AlertTriangle,
  RotateCw,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import AdminLayout from "../../AdminPages/components/layout/AdminLayout";
import PortfolioStatsOverview from "../components/dashboard/PortfolioStatsOverview";
import BusinessLimitBanner from "../components/dashboard/BusinessLimitBanner";
import BusinessCard from "../../../components/common/BusinessCard";
import { useBusinessDirectory } from "../../../hooks/useBusinessDirectory";

export default function BusinessDashboardPage() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const Layout = isAdmin ? AdminLayout : DashboardLayout;
  const newStorefrontPath = isAdmin ? "/admin/my-store/new" : "/dashboard/business/new";
  const cardVariant = isAdmin ? "admin" : "merchant";

  const {
    businesses,
    pagination,
    isLoading,
    isLoadingMore,
    error,
    fetchBusinesses,
    loadMoreBusinesses,
  } = useBusinessDirectory();

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const businessList = businesses || [];
  const businessCount = businessList.length;
  const canCreateMore = businessCount < 5;

  return (
    <Layout
      title={isAdmin ? "My Storefronts" : "Business Dashboard"}
      description={
        isAdmin
          ? "Overview of your personal registered storefronts, community feedback, and customer ratings."
          : "Overview of your registered storefronts, community feedback, and customer ratings."
      }
      action={
        canCreateMore && businessCount > 0 ? (
          <Link
            to={newStorefrontPath}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors min-h-[44px] sm:min-h-[38px] w-full sm:w-auto shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isAdmin ? "Register Storefront" : "Register Business"}</span>
          </Link>
        ) : null
      }
    >
      {/* 1. Loading Skeleton */}
      {isLoading && (!businesses || businesses.length === 0) && (
        <div className="space-y-4 sm:space-y-6" aria-busy="true" aria-label="Loading your dashboard">
          {/* Skeleton Stats: 1:1 match with PortfolioStatsOverview (grid-cols-2 sm:grid-cols-3) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5 mb-4 sm:mb-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 animate-pulse">
              <div className="h-3 w-20 bg-slate-200 rounded mb-2" />
              <div className="h-7 w-16 bg-slate-200 rounded mb-1.5" />
              <div className="h-3 w-24 bg-slate-100 rounded" />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 animate-pulse">
              <div className="h-3 w-24 bg-slate-200 rounded mb-2" />
              <div className="h-7 w-14 bg-slate-200 rounded mb-1.5" />
              <div className="h-3 w-28 bg-slate-100 rounded" />
            </div>
            <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 animate-pulse">
              <div className="h-3 w-28 bg-slate-200 rounded mb-2" />
              <div className="h-7 w-20 bg-slate-200 rounded mb-1.5" />
              <div className="h-3 w-32 bg-slate-100 rounded" />
            </div>
          </div>

          {/* Skeleton Cards: 1:1 match with OwnerBusinessCard (grid-cols-1 md:grid-cols-2 gap-4) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 animate-pulse space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-28 bg-slate-200 rounded" />
                    <div className="h-5 w-48 bg-slate-200 rounded" />
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-200 rounded-xl shrink-0" />
                </div>
                <div className="h-3.5 w-3/4 bg-slate-100 rounded" />
                <div className="h-3.5 w-1/2 bg-slate-100 rounded" />
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="h-3 w-24 bg-slate-100 rounded" />
                  <div className="h-3 w-32 bg-slate-100 rounded" />
                </div>
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
            Register your storefront to start receiving honest ratings, verified receipts, and customer reviews from your community.
          </p>
          <div className="mt-6">
            <Link
              to={newStorefrontPath}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors min-h-[44px] shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isAdmin ? "Register First Storefront" : "Register Your First Business"}</span>
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

          {/* Section Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Active Storefronts ({businessCount} of 5)
            </h2>
          </div>

          {/* Business Cards Grid: 2-column layout on desktop (storefront 1 | storefront 2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {businessList.map((biz) => (
              <BusinessCard key={biz.id || biz.slug} business={biz} variant={cardVariant} />
            ))}
          </div>

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
    </Layout>
  );
}