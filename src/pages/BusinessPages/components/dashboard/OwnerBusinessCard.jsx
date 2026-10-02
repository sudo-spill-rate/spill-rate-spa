import React, { useState } from "react";
import { Link } from "react-router";
import {
  Building,
  Star,
  CheckCircle2,
  MapPin,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";

export default function OwnerBusinessCard({ business }) {
  const [imageError, setImageError] = useState(false);

  if (!business) return null;

  const rawAvg = business?.rating_breakdown?.average_rating ?? business?.average_rating;
  const hasRating = typeof rawAvg === "number" && rawAvg > 0;
  const reviewCount = business?.rating_breakdown?.total_reviews ?? business?.total_reviews ?? 0;

  return (
    <article className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden">
      <div className="p-4 sm:p-5">
        {/* Header: Thumbnail + Name + Category */}
        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
            {business.image_url && !imageError ? (
              <img
                src={business.image_url}
                alt={`Logo of ${business.name}`}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <Building className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {business.name}
              </h3>
              {business.is_verified && (
                <span
                  title="Verified Business"
                  className="inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 shrink-0"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              )}
            </div>

            {business.category && (
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 truncate">
                {business.category}
              </p>
            )}

            {business.address && (
              <p className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1 mt-1 truncate">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{business.address}</span>
              </p>
            )}
          </div>
        </div>

        {/* Rating & Reviews Metric */}
        <div className="py-2.5 px-3 sm:py-3 sm:px-3.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-1.5">
            <Star
              className={`w-4 h-4 ${
                hasRating ? "text-amber-500 fill-amber-500" : "text-slate-300"
              }`}
            />
            {hasRating ? (
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                {rawAvg.toFixed(1)}
              </span>
            ) : (
              <span className="text-xs text-slate-500 font-medium">
                No reviews yet
              </span>
            )}
          </div>

          <span className="text-xs font-semibold text-slate-600">
            {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
          </span>
        </div>

        {/* Short Description */}
        {business.description && (
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {business.description}
          </p>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="px-3.5 sm:px-5 py-2.5 sm:py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          to={`/business/${business.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors min-h-[44px] px-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 shrink-0"
        >
          <span>Public Page</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>

        <Link
          to={`/dashboard/business/${business.slug}`}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors min-h-[44px] shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-600 flex-1 sm:flex-initial"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Manage & Moderate</span>
        </Link>
      </div>
    </article>
  );
}