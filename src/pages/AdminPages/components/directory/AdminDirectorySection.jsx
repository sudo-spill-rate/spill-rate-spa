import { useState } from "react";
import { useSearchParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  X,
  AlertCircle,
  PlusCircle,
  Building,
} from "lucide-react";
import BusinessCard from "../../../../components/common/BusinessCard";
import { businessService } from "../../../../services/businessService";
import { useBusiness } from "../../../../hooks/useBusiness";
import { useCategories } from "../../../../hooks/useCategories";

export default function AdminDirectorySection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";

  const [searchInput, setSearchInput] = useState(searchParam);
  const [prevSearchParam, setPrevSearchParam] = useState(searchParam);
  const { businesses: ownerBusinesses } = useBusiness();
  const { categories } = useCategories();

  // Sync state when URL search param changes
  if (searchParam !== prevSearchParam) {
    setPrevSearchParam(searchParam);
    setSearchInput(searchParam);
  }

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin-directory-feed", searchParam, categoryParam],
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
    <div className="w-full">
      {/* Search & Category Filter Command Bar (Identical to Dashboard Explorer) */}
      <div className="mb-4 sm:mb-5">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 max-w-4xl"
        >
          {/* Search Input with Integrated Clear Icon */}
          <div className="relative flex-1 flex items-center">
            <Search
              className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none"
              aria-hidden="true"
            />
            <label htmlFor="admin-directory-search" className="sr-only">
              Search businesses
            </label>
            <input
              id="admin-directory-search"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by business name or keyword..."
              className="w-full pl-9 sm:pl-10 pr-9 py-2 text-slate-900 placeholder-slate-400 bg-white border border-slate-300 rounded-lg text-base sm:text-sm focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-colors min-h-[44px] sm:min-h-[40px]"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown (All Categories + specific list) */}
          <div className="relative sm:w-56 shrink-0">
            <label htmlFor="admin-category-select" className="sr-only">
              Filter by Category
            </label>
            <select
              id="admin-category-select"
              value={categoryParam}
              onChange={(e) => handleCategorySelect(e.target.value)}
              className="w-full px-3 py-2 text-base sm:text-sm font-medium bg-white text-slate-800 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-colors min-h-[44px] sm:min-h-[40px] cursor-pointer appearance-none pr-8 truncate"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => {
                const catName = typeof cat === "string" ? cat : cat.name;
                const catKey = typeof cat === "string" ? cat : cat.id || cat.slug || cat.name;
                return (
                  <option key={catKey} value={catName}>
                    {catName}
                  </option>
                );
              })}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>

          {/* Action Buttons: Search + Reset */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="submit"
              className="flex-1 sm:flex-initial px-4 py-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors min-h-[44px] sm:min-h-[40px] focus:outline-none focus:ring-2 focus:ring-teal-600 inline-flex items-center justify-center cursor-pointer shadow-2xs"
            >
              Search
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-lg transition-colors min-h-[44px] sm:min-h-[40px] focus:outline-none focus:ring-2 focus:ring-teal-600 inline-flex items-center justify-center cursor-pointer border border-slate-200/80"
              >
                Reset
              </button>
            )}
          </div>
        </form>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-slate-500 font-medium">Active filters:</span>
            {categoryParam && (
              <button
                type="button"
                onClick={() => handleCategorySelect("")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-medium hover:bg-teal-100 transition-colors cursor-pointer text-[11px] min-h-[30px]"
              >
                <span>Category: {categoryParam}</span>
                <X className="w-3 h-3 text-teal-700" />
              </button>
            )}
            {searchParam && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-medium hover:bg-slate-200 transition-colors cursor-pointer text-[11px] min-h-[30px]"
              >
                <span>Search: "{searchParam}"</span>
                <X className="w-3 h-3 text-slate-500" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Feed Content Area */}
      <div className="space-y-3 sm:space-y-4">
        {/* Results Summary Counter */}
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm font-medium text-slate-600">
            {apiBusinesses.length} {apiBusinesses.length === 1 ? "establishment" : "establishments"} found
            {categoryParam && ` in ${categoryParam}`}
            {searchParam && ` matching "${searchParam}"`}
          </p>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4.5" aria-busy="true" aria-label="Loading storefronts">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-xs animate-pulse space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-3/4 bg-slate-200 rounded" />
                    <div className="h-3.5 w-1/2 bg-slate-100 rounded" />
                  </div>
                  <div className="w-16 h-16 sm:w-14 sm:h-14 rounded-xl bg-slate-200 shrink-0" />
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-2/3 bg-slate-100 rounded" />
                    <div className="h-3 w-4/5 bg-slate-100 rounded" />
                    <div className="h-3 w-1/2 bg-slate-100 rounded" />
                  </div>
                  <div className="w-16 h-16 rounded-lg bg-slate-100 shrink-0" />
                </div>
                <div className="pt-2 border-t border-slate-100 h-5 bg-slate-50 rounded" />
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
              className="mt-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer min-h-[44px]"
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
                  className="px-4 py-2 text-xs font-semibold text-teal-700 hover:text-teal-800 underline cursor-pointer min-h-[44px] inline-flex items-center"
                >
                  Clear search filter
                </button>
              ) : (
                <Link
                  to="/admin/my-store/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-colors min-h-[44px]"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Register Storefront</span>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Storefront Cards Grid: Responsive 1 col on mobile, 2 cols on tablet, 2 or 3 cols on large desktop */}
        {!isLoading && !isError && apiBusinesses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4.5">
            {apiBusinesses.map((biz) => (
              <BusinessCard
                key={biz.id || biz.slug}
                business={biz}
                isOwner={isBusinessOwned(biz)}
                variant="explore"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
