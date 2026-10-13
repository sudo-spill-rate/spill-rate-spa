import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  X,
  AlertCircle,
  PlusCircle,
  Building,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import StorefrontFeedCard from "../components/explore/StorefrontFeedCard";
import { businessService } from "../../../services/businessService";
import { useBusiness } from "../../../context/business/useBusiness";

const CATEGORIES = [
  "Food & Beverage",
  "Technology",
  "Health & Wellness",
  "Retail",
  "Automotive",
  "Professional Services",
];

export default function BusinessExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";

  const [searchInput, setSearchInput] = useState(searchParam);
  const { businesses: ownerBusinesses } = useBusiness();

  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["community-feed-businesses", searchParam, categoryParam],
    queryFn: () =>
      businessService.getBusinesses({
        search: searchParam || undefined,
        category: categoryParam || undefined,
        limit: 50,
      }),
    staleTime: 30000,
  });

  const apiBusinesses =
    response?.success && Array.isArray(response.data) ? response.data : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      nextParams.set("search", searchInput.trim());
    } else {
      nextParams.delete("search");
    }
    setSearchParams(nextParams);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("search");
    setSearchParams(nextParams);
  };

  const handleCategorySelect = (category) => {
    const nextParams = new URLSearchParams(searchParams);
    if (category) {
      if (categoryParam.toLowerCase() === category.toLowerCase()) {
        nextParams.delete("category");
      } else {
        nextParams.set("category", category);
      }
    } else {
      nextParams.delete("category");
    }
    setSearchParams(nextParams);
  };

  const handleClearAllFilters = () => {
    setSearchInput("");
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(searchParam || categoryParam);

  const isBusinessOwned = (biz) => {
    if (!ownerBusinesses || ownerBusinesses.length === 0) return false;
    return ownerBusinesses.some(
      (b) => b.id === biz.id || (b.slug && b.slug === biz.slug)
    );
  };

  return (
    <DashboardLayout
      title="Directory Explorer"
      description="Inspect active business profiles, explore industry ratings, and review customer sentiment across the platform."
    >
      <div className="space-y-4">
        {/* Search & Category Filter Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Active Storefronts ({apiBusinesses.length})
            </h2>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Filter by name or keyword..."
                aria-label="Filter registered storefronts"
                className="w-full pl-9 pr-14 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 min-h-[38px]"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
            <button
              type="button"
              onClick={() => handleCategorySelect("")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                !categoryParam
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200"
              }`}
            >
              All Storefronts
            </button>

            {CATEGORIES.map((cat) => {
              const isSelected =
                categoryParam.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                    isSelected
                      ? "bg-slate-900 text-white font-semibold shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Active Filter Notification */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>
                Filtered by{" "}
                {searchParam && <strong className="text-slate-800">"{searchParam}"</strong>}
                {searchParam && categoryParam && " in "}
                {categoryParam && <span className="text-teal-700 font-semibold">[{categoryParam}]</span>}
              </span>
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="text-teal-700 hover:text-teal-800 font-semibold underline cursor-pointer ml-2"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-4" aria-busy="true" aria-label="Loading storefronts">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3 animate-pulse"
              >
                <div className="flex items-start gap-3 sm:gap-3.5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-40 bg-slate-200 rounded" />
                    <div className="h-3 w-28 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <div className="h-3 w-full bg-slate-200 rounded" />
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between">
                  <div className="h-3 w-32 bg-slate-200 rounded" />
                  <div className="h-3 w-24 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-xs space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" aria-hidden="true" />
            <h3 className="text-base font-bold text-slate-900">
              Unable to Load Storefront Directory
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              We couldn't retrieve the storefront directory right now. Please check your connection.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && apiBusinesses.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto mb-2">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {hasActiveFilters ? "No storefronts found" : "No storefronts registered yet"}
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              {hasActiveFilters
                ? `No businesses match your filter "${searchInput || categoryParam}".`
                : "Be the first business owner to register a storefront and collect authentic customer reviews."}
            </p>
            <div className="pt-2">
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="px-4 py-2 text-xs font-semibold text-teal-700 hover:text-teal-800 underline cursor-pointer"
                >
                  Clear search filter
                </button>
              ) : (
                <Link
                  to="/dashboard/business/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Register Business</span>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Storefront Cards Grid (Identical to Active Storefronts) */}
        {!isLoading && !isError && apiBusinesses.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {apiBusinesses.map((biz) => (
              <StorefrontFeedCard
                key={biz.id || biz.slug}
                business={biz}
                isOwner={isBusinessOwned(biz)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
