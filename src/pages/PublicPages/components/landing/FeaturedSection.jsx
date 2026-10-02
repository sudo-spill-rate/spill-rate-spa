import React, { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Star, MapPin, CheckCircle2, Building, AlertCircle } from "lucide-react";
import { businessService } from "../../../../services/businessService";

function BusinessCard({ biz }) {
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
        {/* Responsive Image Cover: h-36 on mobile, h-44 on desktop */}
        <div className="relative h-36 sm:h-44 w-full bg-slate-100 overflow-hidden">
          {biz.image_url && !imgError ? (
            <img
              src={biz.image_url}
              alt={`Photo of ${biz.name}`}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
              <Building className="w-8 h-8 sm:w-10 sm:h-10" aria-hidden="true" />
            </div>
          )}

          {/* Category Tag */}
          {biz.category && (
            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[11px] sm:text-xs font-semibold bg-white/95 text-slate-800 shadow-xs border border-slate-200/60">
              {biz.category}
            </span>
          )}

          {/* Verified Badge */}
          {biz.is_verified && (
            <span
              title="Verified Establishment"
              className="absolute top-2.5 right-2.5 rounded bg-teal-700 text-white shadow-xs flex items-center gap-1 text-[11px] px-2 py-0.5 font-medium"
            >
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Verified</span>
            </span>
          )}
        </div>

        {/* Content Body: tight padding on mobile */}
        <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between">
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
                  <span className="text-[11px] sm:text-xs text-slate-500 font-normal">
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

          {/* Action indicator - clean, compact touch target */}
          <div className="mt-3 sm:mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:text-teal-800">
            <span>Read reviews and rate</span>
            <span aria-hidden="true" className="text-slate-400 group-hover:text-teal-700">Open</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default function FeaturedSection() {
  const {
    data: businesses = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["featured-businesses"],
    queryFn: async () => {
      const res = await businessService.getBusinesses({ limit: 4 });
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch featured businesses");
      }
      return res.data || [];
    },
    staleTime: 1000 * 60 * 2,
  });

  return (
    <section className="bg-white border-b border-slate-200/80 py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header: removed redundant top 'view all' link */}
        <div className="mb-5 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            Featured Establishments
          </h2>
          <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Verified local businesses with real customer ratings and active community feedback.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" aria-busy="true">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs animate-pulse"
              >
                <div className="h-36 sm:h-44 bg-slate-200" />
                <div className="p-4 sm:p-5 space-y-2.5">
                  <div className="h-4 w-20 bg-slate-200 rounded" />
                  <div className="h-5 w-3/4 bg-slate-200 rounded" />
                  <div className="h-3.5 w-1/2 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="p-6 sm:p-8 text-center bg-white rounded-xl border border-slate-200 shadow-xs">
            <AlertCircle className="w-7 h-7 text-amber-600 mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm sm:text-base font-semibold text-slate-900">Unable to load featured businesses</p>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-4">Please verify your connection and try again.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px]"
            >
              Retry Loading
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && businesses.length === 0 && (
          <div className="p-6 sm:p-10 text-center bg-slate-50/70 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-slate-200 text-slate-500 flex items-center justify-center mx-auto mb-3">
              <Building className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              No businesses registered yet
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Be the first local merchant to register your establishment and start collecting authentic community feedback.
            </p>
            <div className="mt-4 sm:mt-5">
              <Link
                to="/dashboard/business/new"
                className="inline-flex items-center justify-center px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                Register Your Business
              </Link>
            </div>
          </div>
        )}

        {/* Real Data Cards Grid */}
        {!isLoading && !isError && businesses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {businesses.map((biz) => (
              <BusinessCard key={biz.id} biz={biz} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}