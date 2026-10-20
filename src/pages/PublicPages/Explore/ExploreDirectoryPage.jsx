import { useState } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import PublicPageHeader from "../components/layout/PublicPageHeader";
import DirectorySearchResults from "../components/explore/DirectorySearchResults";
import { businessService } from "../../../services/businessService";
import { useCategories } from "../../../hooks/useCategories";

export default function ExploreDirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";

  const [searchInput, setSearchInput] = useState(searchParam);
  const [prevSearchParam, setPrevSearchParam] = useState(searchParam);
  const { categories: fetchedCategories } = useCategories();

  // Sync state with URL params
  if (searchParam !== prevSearchParam) {
    setPrevSearchParam(searchParam);
    setSearchInput(searchParam);
  }

  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ["businesses-directory", searchParam, categoryParam],
    queryFn: () =>
      businessService.getBusinesses({
        search: searchParam || undefined,
        category: categoryParam || undefined,
        limit: 20,
      }),
  });

  const displayBusinesses = response?.data || [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set("search", searchInput.trim());
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("search");
    setSearchParams(newParams);
  };

  const handleSelectCategory = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category) {
      // Toggle off if already selected
      if (categoryParam.toLowerCase() === category.toLowerCase()) {
        newParams.delete("category");
      } else {
        newParams.set("category", category);
      }
    } else {
      newParams.delete("category");
    }
    setSearchParams(newParams);
  };

  const handleClearAllFilters = () => {
    setSearchInput("");
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(searchParam || categoryParam);

  return (
    <div>
      <PublicPageHeader
        title="Business Directory"
        description="Explore verified local establishments, read genuine feedback, and discover trusted services across your community."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Directory" },
        ]}
        compact={true}
      />

      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2.5 sm:py-5 w-full">
        {/* Search & Category Filter Command Bar */}
        <div className="mb-4 sm:mb-5">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 max-w-4xl"
          >
            {/* Search Input with Integrated Clear Icon */}
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
              <label htmlFor="directory-search" className="sr-only">
                Search businesses
              </label>
              <input
                id="directory-search"
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
                  className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="relative sm:w-56 shrink-0">
              <label htmlFor="directory-category-select" className="sr-only">
                Filter by Category
              </label>
              <select
                id="directory-category-select"
                value={categoryParam}
                onChange={(e) => handleSelectCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm font-medium bg-white text-slate-800 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-colors min-h-[40px] cursor-pointer appearance-none pr-8 truncate"
              >
                <option value="">All Categories</option>
                {fetchedCategories.map((cat) => {
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
                className="flex-1 sm:flex-initial px-4 py-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors min-h-[40px] focus:outline-none focus:ring-2 focus:ring-teal-600 inline-flex items-center justify-center cursor-pointer shadow-2xs"
              >
                Search
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-lg transition-colors min-h-[40px] focus:outline-none focus:ring-2 focus:ring-teal-600 inline-flex items-center justify-center cursor-pointer border border-slate-200/80"
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
                  onClick={() => handleSelectCategory("")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-medium hover:bg-teal-100 transition-colors cursor-pointer text-[11px]"
                >
                  <span>Category: {categoryParam}</span>
                  <X className="w-3 h-3 text-teal-700" />
                </button>
              )}
              {searchParam && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-medium hover:bg-slate-200 transition-colors cursor-pointer text-[11px]"
                >
                  <span>Search: "{searchParam}"</span>
                  <X className="w-3 h-3 text-slate-500" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Search Results Area */}
        <main className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm font-medium text-slate-600">
              {displayBusinesses.length} {displayBusinesses.length === 1 ? "establishment" : "establishments"} found
              {categoryParam && ` in ${categoryParam}`}
              {searchParam && ` matching "${searchParam}"`}
            </p>
          </div>

          <DirectorySearchResults
            businesses={displayBusinesses}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            onClearFilters={handleClearAllFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </main>
      </div>
    </div>
  );
}