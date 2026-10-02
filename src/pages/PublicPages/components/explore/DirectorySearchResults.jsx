import React, { useState } from "react";
import { Link } from "react-router";
import { Star, MapPin, CheckCircle2, Building, AlertCircle, SearchX } from "lucide-react";

function SearchResultCard({ biz }) {
  const [imgError, setImgError] = useState(false);

  // Strictly reflect real rating, no fabricated 4.8 fallback (R-17 compliance)
  const rawAvg = biz?.rating_breakdown?.average_rating ?? biz?.average_rating;
  const hasRating = typeof rawAvg === "number" && rawAvg > 0;
  const reviewCount = biz?.rating_breakdown?.total_reviews ?? biz?.total_reviews ?? 0;
  const businessHref = `/business/${biz.slug || biz.id}`;

  return (
    <article className="flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-colors">
      {/* Image Cover */}
      <Link to={businessHref} className="relative h-40 w-full bg-slate-100 block overflow-hidden focus:outline-none focus:ring-2 focus:ring-teal-600">
        {biz.image_url && !imgError ? (
          <img
            src={biz.image_url}
            alt={`Cover photo for ${biz.name}`}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
            <Building className="w-10 h-10" />
          </div>
        )}

        {/* Category Pill Tag */}
        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-white text-slate-800 shadow-xs border border-slate-200/60">
          {biz.category || "General"}
        </span>

        {/* Verified Badge */}
        {biz.is_verified && (
          <span
            title="Verified Establishment"
            className="absolute top-2.5 right-2.5 px-2 py-1 rounded-md bg-teal-700 text-white shadow-xs flex items-center gap-1 text-[11px] font-medium"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified</span>
          </span>
        )}
      </Link>

      {/* Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1.5">
            {hasRating ? (
              <>
                <div className="flex items-center text-amber-600">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="ml-1 text-sm font-bold text-slate-900">
                    {Number(rawAvg).toFixed(1)}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                </span>
              </>
            ) : (
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                No reviews yet
              </span>
            )}
          </div>

          {/* Business Name */}
          <h3 className="font-bold text-base text-slate-900 line-clamp-1">
            <Link
              to={businessHref}
              className="hover:text-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
            >
              {biz.name}
            </Link>
          </h3>

          {/* Address */}
          {biz.address && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 line-clamp-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{biz.address}</span>
            </p>
          )}

          {/* Description */}
          <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {biz.description || "Local establishment offering products and services."}
          </p>
        </div>

        {/* Card Action Link */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <Link
            to={businessHref}
            className="w-full flex items-center justify-center py-2 px-3 rounded-lg bg-slate-100 hover:bg-teal-700 hover:text-white text-slate-800 font-semibold text-xs sm:text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px]"
          >
            View Details & Reviews
          </Link>
        </div>
      </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" aria-busy="true">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs animate-pulse"
          >
            <div className="h-40 bg-slate-200" />
            <div className="p-5 space-y-3">
              <div className="h-4 w-20 bg-slate-200 rounded" />
              <div className="h-5 w-3/4 bg-slate-200 rounded" />
              <div className="h-4 w-1/2 bg-slate-200 rounded" />
              <div className="h-9 w-full bg-slate-200 rounded-lg mt-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 sm:p-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs">
        <AlertCircle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Unable to Load Directory</h2>
        <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
          We could not retrieve businesses at this time. Please check your internet connection and try again.
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px]"
          >
            Retry Loading Directory
          </button>
        )}
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="p-8 sm:p-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs">
        <SearchX className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">No Businesses Found</h2>
        <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
          {hasActiveFilters
            ? "No establishments match your search criteria. Try using broader keywords or clearing the category filter."
            : "No businesses are currently listed in this directory."}
        </p>
        {hasActiveFilters && onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-5 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px]"
          >
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {businesses.map((biz) => (
        <SearchResultCard key={biz.id} biz={biz} />
      ))}
    </div>
  );
}