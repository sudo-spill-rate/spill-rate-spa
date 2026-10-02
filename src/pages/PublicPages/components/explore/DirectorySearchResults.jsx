import React, { useState } from "react";
import { Link } from "react-router";
import { Star, MapPin, CheckCircle2, Building, AlertCircle, SearchX } from "lucide-react";

function SearchResultCard({ biz }) {
  const [imgError, setImgError] = useState(false);

  // Safely extract real rating and review count from backend data
  const rawAvg =
    typeof biz?.average_rating === "number"
      ? biz.average_rating
      : typeof biz?.rating_breakdown?.average_rating === "number"
      ? biz.rating_breakdown.average_rating
      : null;
  const hasRating = rawAvg !== null && rawAvg > 0;
  const reviewCount = biz?.total_reviews ?? biz?.rating_breakdown?.total_reviews ?? 0;
  const businessHref = `/business/${biz.slug || biz.id}`;

  return (
    <article className="group flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-colors">
      <Link
        to={businessHref}
        className="block focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-xl"
      >
        {/* Responsive Image Cover: h-36 on mobile, h-40 on desktop */}
        <div className="relative h-36 sm:h-40 w-full bg-slate-100 overflow-hidden">
          {biz.image_url && !imgError ? (
            <img
              src={biz.image_url}
              alt={`Cover photo for ${biz.name}`}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
              <Building className="w-8 h-8 sm:w-10 sm:h-10" aria-hidden="true" />
            </div>
          )}

          {/* Category Pill Tag */}
          {biz.category && (
            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[11px] sm:text-xs font-semibold bg-white/95 text-slate-800 shadow-xs border border-slate-200/60">
              {biz.category}
            </span>
          )}

          {/* Verified Badge */}
          {biz.is_verified && (
            <span
              title="Verified Establishment"
              className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-teal-700 text-white shadow-xs flex items-center gap-1 text-[11px] font-medium"
            >
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Verified</span>
            </span>
          )}
        </div>

        {/* Content Details */}
        <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-1.5">
              {hasRating ? (
                <>
                  <div className="flex items-center text-amber-600">
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-500 text-amber-500" aria-hidden="true" />
                    <span className="ml-1 text-xs sm:text-sm font-bold text-slate-900">
                      {Number(rawAvg).toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[11px] sm:text-xs text-slate-500">
                    ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </>
              ) : (
                <span className="text-[11px] sm:text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  No reviews yet
                </span>
              )}
            </div>

            {/* Business Name */}
            <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-teal-800 transition-colors line-clamp-1">
              {biz.name}
            </h3>

            {/* Address */}
            {biz.address && (
              <p className="mt-1 flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 line-clamp-1">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
                <span>{biz.address}</span>
              </p>
            )}

            {/* Description */}
            <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {biz.description || "Local establishment offering products and services."}
            </p>
          </div>

          {/* Integrated Action Link Row */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:text-teal-800">
            <span>View details & reviews</span>
            <span aria-hidden="true" className="text-slate-400 group-hover:text-teal-700">Open</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5" aria-busy="true">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs animate-pulse"
          >
            <div className="h-36 sm:h-40 bg-slate-200" />
            <div className="p-4 sm:p-5 space-y-2.5">
              <div className="h-4 w-20 bg-slate-200 rounded" />
              <div className="h-5 w-3/4 bg-slate-200 rounded" />
              <div className="h-3.5 w-1/2 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 sm:p-10 text-center bg-white rounded-xl border border-slate-200 shadow-xs">
        <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 mx-auto mb-2.5" aria-hidden="true" />
        <h2 className="text-base sm:text-lg font-bold text-slate-900">Unable to Load Directory</h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
          We could not retrieve businesses at this time. Please check your internet connection and try again.
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px]"
          >
            Retry Loading Directory
          </button>
        )}
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="p-6 sm:p-10 text-center bg-white rounded-xl border border-slate-200 shadow-xs">
        <SearchX className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 mx-auto mb-2.5" aria-hidden="true" />
        <h2 className="text-base sm:text-lg font-bold text-slate-900">No Businesses Found</h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
          {hasActiveFilters
            ? "No establishments match your search criteria. Try using broader keywords or clearing the category filter."
            : "No businesses are currently listed in this directory."}
        </p>
        {hasActiveFilters && onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-4 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px]"
          >
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {businesses.map((biz) => (
        <SearchResultCard key={biz.id} biz={biz} />
      ))}
    </div>
  );
}