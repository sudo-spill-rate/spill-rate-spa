import React, { useState } from "react";
import { Link } from "react-router";
import {
  Building,
  CheckCircle2,
  MapPin,
  Phone,
  Globe,
  Star,
} from "lucide-react";

export default function OwnerBusinessCard({ business }) {
  const [imageError, setImageError] = useState(false);

  if (!business) return null;

  const rawAvg = business?.rating_breakdown?.average_rating ?? business?.average_rating;
  const hasRating = typeof rawAvg === "number" && rawAvg > 0;
  const reviewCount = business?.rating_breakdown?.total_reviews ?? business?.total_reviews ?? 0;

  return (
    <article className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3 hover:border-slate-300 transition-colors">
      {/* Top Row: Storefront Info */}
      <div className="flex items-start gap-3 sm:gap-3.5">
        {/* Storefront Logo or Fallback */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
          {business.image_url && !imageError ? (
            <img
              src={business.image_url}
              alt={`Logo of ${business.name}`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <Building className="w-6 h-6 text-slate-400" aria-hidden="true" />
          )}
        </div>

        {/* Name, Verified Badge, Category, and Slug */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight break-words">
              {business.name}
            </h3>
            {business.is_verified && (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                <CheckCircle2 className="w-3 h-3 text-teal-600" aria-hidden="true" />
                <span>Verified</span>
              </span>
            )}
            {business.category && (
              <span className="text-[10px] sm:text-[11px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                {business.category}
              </span>
            )}
          </div>

          <p className="mt-0.5 text-xs text-slate-500">
            Slug: <span className="font-mono text-slate-700 break-all">{business.slug}</span>
          </p>
        </div>
      </div>

      {/* Short Description */}
      <div className="pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap break-words line-clamp-2">
          {business.description || "No description provided."}
        </p>
      </div>

      {/* Contact Details & Physical Location */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
        <span className="inline-flex items-center gap-1.5 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
          <span className="truncate max-w-xs">{business.address || "No physical address provided"}</span>
        </span>

        <span className="inline-flex items-center gap-1.5 min-w-0">
          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
          <span>{business.phone || "No phone registered"}</span>
        </span>

        {business.website ? (
          <a
            href={business.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-800 hover:underline min-w-0 truncate"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="truncate max-w-xs">{business.website.replace(/^https?:\/\//, "")}</span>
          </a>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-slate-400 min-w-0">
            <Globe className="w-3.5 h-3.5 text-slate-300 shrink-0" aria-hidden="true" />
            <span>No website registered</span>
          </span>
        )}
      </div>

      {/* Card Footer: Rating & Manage Storefront */}
      <div className="pt-2.5 sm:pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          {hasRating ? (
            <>
              <div className="flex items-center text-amber-600 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" aria-hidden="true" />
                <span>{Number(rawAvg).toFixed(1)}</span>
              </div>
              <span className="text-slate-500 text-[11px]">
                ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
              </span>
            </>
          ) : (
            <span className="text-[11px] text-slate-400">No reviews yet</span>
          )}
        </div>

        <Link
          to={`/dashboard/business/${business.slug}`}
          className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
        >
          <span>Manage Storefront</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}