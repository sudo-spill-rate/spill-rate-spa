import React, { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Star, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
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
    <article className="group flex flex-col bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs transition-colors">
      <Link
        to={businessHref}
        className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-xl"
      >
        <div>
          {/* Top Row: Rating & Name on Left, Logo on Right */}
          <div className="flex items-start justify-between gap-2.5 mb-1.5">
            <div className="flex-1 min-w-0">
              {/* Rating */}
              <div className="flex items-center gap-1.5 mb-1">
                {hasRating ? (
                  <>
                    <div className="flex items-center text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" aria-hidden="true" />
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
            </div>

            {/* Right Side: Business Logo */}
            <div className="shrink-0">
              {biz.image_url && !imgError ? (
                <img
                  src={biz.image_url}
                  alt={`${biz.name} logo`}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg object-cover border border-slate-200/90 shadow-2xs"
                  loading="lazy"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center font-bold text-teal-800 text-sm sm:text-base">
                  {biz.name ? biz.name.charAt(0).toUpperCase() : "B"}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="mt-1 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {biz.description || "Local establishment offering products and services."}
          </p>

          {/* Category & Verified Row */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            {biz.category && (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                {biz.category}
              </span>
            )}
            {biz.is_verified && (
              <span
                title="Verified Establishment"
                className="rounded bg-teal-50 text-teal-800 border border-teal-200/60 flex items-center gap-1 text-[11px] px-2 py-0.5 font-semibold"
              >
                <CheckCircle2 className="w-3 h-3 text-teal-700" aria-hidden="true" />
                <span>Verified</span>
              </span>
            )}
            {biz.address && (
              <span className="flex items-center gap-1 text-[11px] text-slate-500 line-clamp-1 ml-auto">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
                <span>{biz.address}</span>
              </span>
            )}
          </div>
        </div>

        {/* Action indicator */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:text-teal-800">
          <span>Read reviews and rate</span>
          <span aria-hidden="true" className="text-slate-400 group-hover:text-teal-700">Open →</span>
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
      const res = await businessService.getBusinesses({ limit: 15 });
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch featured businesses");
      }
      return res.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  // Deterministic daily rotation to pick 10 featured establishments per day from the 15 fetched
  const featuredTen = React.useMemo(() => {
    if (!businesses || businesses.length === 0) return [];
    if (businesses.length <= 10) return businesses;

    // Daily seed based on current date (YYYY-MM-DD)
    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    // Deterministic pseudo-random sort
    const shuffled = [...businesses].sort((a, b) => {
      const hashA = ((a.id || 0) * 9301 + 49297 + dateSeed) % 233280;
      const hashB = ((b.id || 0) * 9301 + 49297 + dateSeed) % 233280;
      return hashA - hashB;
    });

    return shuffled.slice(0, 10);
  }, [businesses]);

  return (
    <div className="w-full flex-1 flex flex-col">
      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4.5 flex-1" aria-busy="true">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-xs animate-pulse space-y-2.5"
            >
              <div className="flex justify-between items-start gap-2.5">
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-20 bg-slate-200 rounded" />
                  <div className="h-4.5 w-3/4 bg-slate-200 rounded" />
                </div>
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-slate-200 shrink-0" />
              </div>
              <div className="h-3 w-full bg-slate-200 rounded" />
              <div className="h-3.5 w-1/2 bg-slate-200 rounded" />
              <div className="pt-2 border-t border-slate-100 h-7 bg-slate-50 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="p-5 sm:p-6 text-center bg-white rounded-xl border border-slate-200 shadow-xs my-auto">
          <AlertCircle className="w-6 h-6 text-amber-600 mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm font-semibold text-slate-900">Unable to load featured businesses</p>
          <p className="text-xs text-slate-600 mt-1 mb-3.5">Please verify your connection and try again.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[38px] cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && businesses.length === 0 && (
        <div className="p-6 sm:p-8 text-center bg-white rounded-xl border border-slate-200 shadow-xs my-auto">
          <CheckCircle2 className="w-9 h-9 text-slate-400 mx-auto mb-2.5" aria-hidden="true" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            No businesses registered yet
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Be the first local merchant to register your establishment and start collecting authentic community feedback.
          </p>
          <div className="mt-3.5 sm:mt-4">
            <Link
              to="/dashboard/business/new"
              className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors min-h-[38px] focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              Register Your Business
            </Link>
          </div>
        </div>
      )}

      {/* Real Data Cards Grid */}
      {!isLoading && !isError && featuredTen.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4.5 pb-4 sm:pb-6">
          {featuredTen.map((biz) => (
            <BusinessCard key={biz.id} biz={biz} />
          ))}
        </div>
      )}
    </div>
  );
}