import React, { useState } from "react";
import { Link } from "react-router";
import {
  CheckCircle2,
  MapPin,
  Star,
  ArrowRight,
} from "lucide-react";

export default function OwnerBusinessCard({ business }) {
  const [imageError, setImageError] = useState(false);

  if (!business) return null;

  const rawAvg = business?.rating_breakdown?.average_rating ?? business?.average_rating;
  const hasRating = typeof rawAvg === "number" && rawAvg > 0;
  const reviewCount = business?.rating_breakdown?.total_reviews ?? business?.total_reviews ?? 0;

  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-xs transition-colors">
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Top Row: Rating & Name on Left, Logo/Avatar on Right */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              {/* Rating */}
              <div className="flex items-center gap-1.5 mb-1.5">
                {hasRating ? (
                  <>
                    <div className="flex items-center text-amber-600">
                      <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-500 text-amber-500" aria-hidden="true" />
                      <span className="ml-1 text-xs sm:text-sm font-bold text-slate-900 tabular-nums">
                        {Number(rawAvg).toFixed(1)}
                      </span>
                    </div>
                    <span className="text-[11px] sm:text-xs text-slate-500 font-normal tabular-nums">
                      ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] sm:text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    No ratings yet
                  </span>
                )}
              </div>

              {/* Business Name */}
              <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-teal-800 transition-colors line-clamp-1">
                <Link to={`/dashboard/business/${business.slug}`} className="hover:underline focus:outline-none focus:ring-1 focus:ring-teal-600 rounded">
                  {business.name}
                </Link>
              </h3>
            </div>

            {/* Right: Storefront Logo / Fallback Avatar Thumbnail */}
            <div className="shrink-0">
              {business.image_url && !imageError ? (
                <img
                  src={business.image_url}
                  alt={`${business.name} logo`}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-slate-200/90 shadow-2xs"
                  loading="lazy"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-teal-50 border border-teal-100/80 flex items-center justify-center font-bold text-teal-800 text-base sm:text-lg">
                  {business.name ? business.name.charAt(0).toUpperCase() : "B"}
                </div>
              )}
            </div>
          </div>

          {/* Description clamped to 2 lines */}
          <p className="mt-1 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {business.description || "No description provided."}
          </p>

          {/* Badges Row */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            {business.category && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-stone-100 text-stone-700 border border-stone-200/80">
                {business.category}
              </span>
            )}
            {business.is_verified ? (
              <span
                title="Verified Establishment"
                className="rounded-full bg-teal-50 text-teal-800 border border-teal-200/80 flex items-center gap-1 text-[11px] px-2.5 py-0.5 font-semibold"
              >
                <CheckCircle2 className="w-3 h-3 text-teal-700" aria-hidden="true" />
                <span>Verified</span>
              </span>
            ) : (
              <span
                title="Unverified Establishment"
                className="rounded-full bg-slate-50 text-slate-500 border border-slate-200/70 flex items-center gap-1 text-[11px] px-2.5 py-0.5 font-medium"
              >
                <span>Unverified</span>
              </span>
            )}
            {business.slug && (
              <span className="font-mono text-[11px] text-slate-400 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-full">
                /{business.slug}
              </span>
            )}
            {business.address && (
              <span className="flex items-center gap-1 text-[11px] text-slate-500 line-clamp-1 ml-auto">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
                <span className="truncate max-w-[180px] sm:max-w-xs">{business.address}</span>
              </span>
            )}
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
          <span className="text-xs font-medium text-emerald-800">Owner Controls</span>
          <Link
            to={`/dashboard/business/${business.slug}`}
            className="text-xs font-semibold text-slate-600 hover:text-teal-800 inline-flex items-center gap-1 transition-colors min-h-[36px]"
          >
            <span>Manage Storefront</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 transition-colors" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}