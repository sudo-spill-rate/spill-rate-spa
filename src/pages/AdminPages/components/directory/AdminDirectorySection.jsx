import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, X, AlertCircle, Building } from "lucide-react";
import AdminOwnerBusinessCard from "../storefronts/AdminOwnerBusinessCard";
import { businessService } from "../../../../services/businessService";
import { useCategories } from "../../../../hooks/useCategories";

export default function AdminDirectorySection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";

  const [searchInput, setSearchInput] = useState(searchParam);
  const { categories } = useCategories();

  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

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

  const handleCategorySelect = (categoryName) => {
    const nextParams = new URLSearchParams(searchParams);
    if (categoryParam === categoryName) {
      nextParams.delete("category");
    } else {
      nextParams.set("category", categoryName);
    }
    setSearchParams(nextParams);
  };

  return (
    <div className="space-y-5">
      {/* Search Bar & Stats */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search all platform storefronts by name, handle, or location..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:bg-white transition-colors min-h-[38px]"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Category Pills */}
        {categories && categories.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
            <button
              type="button"
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.delete("category");
                setSearchParams(next);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                !categoryParam
                  ? "bg-teal-700 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => {
              const isActive = categoryParam === cat.name;
              return (
                <button
                  key={cat.id || cat.slug || cat.name}
                  type="button"
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    isActive
                      ? "bg-teal-700 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong>{apiBusinesses.length}</strong> registered storefronts
        </span>
        {(searchParam || categoryParam) && (
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className="text-teal-700 hover:underline font-semibold cursor-pointer"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-28 bg-white rounded-xl border border-slate-200 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Failed to load platform directory.</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="font-semibold text-red-900 underline hover:no-underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Storefront List */}
      {!isLoading && !isError && apiBusinesses.length > 0 && (
        <div className="grid grid-cols-1 gap-3">
          {apiBusinesses.map((biz) => (
            <AdminOwnerBusinessCard key={biz.id || biz.slug} business={biz} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && apiBusinesses.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-2">
          <Building className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-semibold text-slate-700">No storefronts matched your criteria</p>
          <p className="text-xs text-slate-400">
            Try adjusting your search query or selecting a different category.
          </p>
        </div>
      )}
    </div>
  );
}
