import { AlertCircle, SearchX } from "lucide-react";
import BusinessCard from "../../../../components/common/BusinessCard";

export default function DirectorySearchResults({
  businesses = [],
  isLoading = false,
  isError = false,
  onRetry,
  onClearFilters,
  hasActiveFilters = false,
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4.5" aria-busy="true">
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
    );
  }

  if (isError) {
    return (
      <div className="p-5 sm:p-7 text-center bg-white rounded-xl border border-slate-200/90 shadow-xs">
        <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 text-amber-600 mx-auto mb-2" aria-hidden="true" />
        <h2 className="text-sm sm:text-base font-bold text-slate-900">Unable to Load Directory</h2>
        <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
          We could not retrieve businesses at this time. Please check your internet connection and try again.
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px] cursor-pointer"
          >
            Retry Loading Directory
          </button>
        )}
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="p-5 sm:p-7 text-center bg-white rounded-xl border border-slate-200/90 shadow-xs">
        <SearchX className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400 mx-auto mb-2" aria-hidden="true" />
        <h2 className="text-sm sm:text-base font-bold text-slate-900">No Businesses Found</h2>
        <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
          {hasActiveFilters
            ? "No establishments match your search criteria. Try using broader keywords or clearing the category filter."
            : "No businesses are currently listed in this directory."}
        </p>
        {hasActiveFilters && onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-3.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px] cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4.5">
      {businesses.map((biz) => (
        <BusinessCard key={biz.id} biz={biz} />
      ))}
    </div>
  );
}
