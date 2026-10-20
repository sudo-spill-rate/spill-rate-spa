import { useState, useContext } from "react";
import { Link } from "react-router";
import {
  Star,
  MapPin,
  Phone,
  Globe,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { BusinessContext } from "../../context/business/businessContext";
import { AuthContext } from "../../context/auth/authContext";
import BusinessQrThumbnail from "./BusinessQrThumbnail";

/**
 * Unified BusinessCard Component
 * Consolidates OwnerBusinessCard, AdminOwnerBusinessCard, StorefrontFeedCard, and BusinessCard.
 *
 * @param {Object} props
 * @param {Object} [props.business] - Business entity
 * @param {Object} [props.biz] - Alias for business entity
 * @param {"public"|"merchant"|"admin"|"explore"} [props.variant="public"] - Card display & routing variant
 * @param {boolean} [props.isOwner] - Explicit flag indicating the current user owns this storefront
 * @param {string} [props.className] - Additional CSS classes
 */
export default function BusinessCard({
  business,
  biz,
  variant = "public",
  isOwner = false,
  className = "",
}) {
  const b = business || biz;
  const [imgError, setImgError] = useState(false);

  // Optional context access (safe when mounted outside providers)
  const businessCtx = useContext(BusinessContext);
  const authCtx = useContext(AuthContext);

  const ownerBusinesses = businessCtx?.businesses || [];
  const user = authCtx?.user;

  const isFounderOrAdmin = user?.role === "founder" || user?.role === "admin";
  const isActualOwner =
    isOwner ||
    (ownerBusinesses || []).some((item) => item.id === b?.id || item.slug === b?.slug);

  const eligibleEndorsingBiz = (ownerBusinesses || []).find(
    (item) => item.id !== b?.id && item.slug !== b?.slug
  );

  const rawAvg =
    typeof b?.average_rating === "number"
      ? b.average_rating
      : typeof b?.rating_breakdown?.average_rating === "number"
      ? b.rating_breakdown.average_rating
      : null;
  const hasRating = rawAvg !== null && rawAvg > 0;
  const reviewCount = b?.total_reviews ?? b?.rating_breakdown?.total_reviews ?? 0;

  const slug = b?.slug || b?.id;
  const publicHref = `/business/${slug}`;
  const manageHref = isFounderOrAdmin
    ? `/admin/my-store/${slug}`
    : `/dashboard/business/${slug}`;
  const exploreHref = `/dashboard/explore/business/${slug}`;

  // Determine target navigation URL based on variant & permissions
  let targetHref = publicHref;
  if (variant === "merchant") {
    targetHref = `/dashboard/business/${slug}`;
  } else if (variant === "admin") {
    targetHref = `/admin/my-store/${slug}`;
  } else if (variant === "explore") {
    targetHref = isActualOwner || isFounderOrAdmin ? manageHref : exploreHref;
  }

  const cleanWebsite = b?.website
    ? b.website.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : "";

  if (!b) return null;

  return (
    <article
      className={`group w-full h-full flex flex-col bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 shadow-xs transition-colors ${className}`}
    >
      <Link
        to={targetHref}
        className="w-full p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-3 active:bg-slate-50/70 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-xl transition-colors min-h-[44px]"
      >
        <div className="w-full flex-1 flex flex-col justify-between">
          {/* 1. Top Header: Left (Name, Verified badge, Storefront status, Category & Rating) | Right (Brand Logo) */}
          <div className="w-full flex items-start justify-between gap-3 pb-3">
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 sm:gap-1.5">
              {/* Row 1: Business Name + Badges */}
              <div className="w-full flex items-center gap-1.5 min-w-0 flex-wrap">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-teal-700 transition-colors truncate leading-snug tracking-tight">
                  {b.name}
                </h3>

                {b.is_verified && (
                  <span
                    className="inline-flex items-center gap-1 shrink-0"
                    title="Verified Establishment"
                    aria-label="Verified Establishment"
                  >
                    <span className="text-slate-300 font-light text-xs" aria-hidden="true">
                      |
                    </span>
                    <CheckCircle2
                      className="w-4 h-4 text-teal-700 inline-block drop-shadow-2xs shrink-0"
                      aria-hidden="true"
                    />
                  </span>
                )}

                {(variant === "merchant" || (variant === "explore" && isActualOwner)) && (
                  <span className="text-[10px] sm:text-[11px] font-semibold bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded border border-teal-200 shrink-0">
                    Your Storefront
                  </span>
                )}
              </div>

              {/* Row 2: Category + Star Rating */}
              <div className="w-full flex flex-col items-start gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2 sm:gap-y-1 text-xs min-w-0">
                {b.category && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80 truncate max-w-full">
                    {b.category}
                  </span>
                )}

                <div className="inline-flex items-center gap-1 min-w-0">
                  <Star
                    className="w-3.5 h-3.5 fill-amber-500 text-amber-600 shrink-0"
                    aria-hidden="true"
                  />
                  {hasRating ? (
                    <>
                      <span className="font-bold text-slate-900 tabular-nums">
                        {Number(rawAvg).toFixed(1)}
                      </span>
                      <span className="text-slate-600 font-normal">
                        ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                      </span>
                    </>
                  ) : (
                    <span className="font-medium text-slate-600">No reviews yet</span>
                  )}
                </div>
              </div>
            </div>

            {/* Top-Right: Brand Logo / Initial Fallback */}
            <div className="shrink-0">
              {b.image_url && !imgError ? (
                <img
                  src={b.image_url}
                  alt={`${b.name} logo`}
                  crossOrigin="anonymous"
                  className="w-16 h-16 sm:w-14 sm:h-14 rounded-xl object-cover border border-slate-200/90 shadow-2xs bg-white"
                  loading="lazy"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-16 h-16 sm:w-14 sm:h-14 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center font-bold text-teal-800 text-lg shadow-2xs">
                  {b.name ? b.name.charAt(0).toUpperCase() : "B"}
                </div>
              )}
            </div>
          </div>

          {/* Optional Short Description for Admin / Detailed variants */}
          {variant === "admin" && b.description && (
            <p className="pb-3 text-xs text-slate-600 leading-relaxed whitespace-pre-wrap break-words line-clamp-2">
              {b.description}
            </p>
          )}

          {/* 2. Horizontal Divider */}
          <div className="w-full border-t border-slate-200/80" />

          {/* 3. Bottom Body: Two-Column Layout (Left: Contact Details | Right: Scannable Storefront QR Code) */}
          <div className="w-full pt-3 flex items-center justify-between gap-3">
            {/* Left Column: Contact Details */}
            <div className="flex-1 min-w-0 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Phone className="w-3.5 h-3.5 text-teal-700 shrink-0" aria-hidden="true" />
                <span
                  className={
                    b.phone ? "truncate text-slate-800 font-medium" : "truncate text-slate-600"
                  }
                >
                  {b.phone || "No contact number"}
                </span>
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <Globe className="w-3.5 h-3.5 text-teal-700 shrink-0" aria-hidden="true" />
                <span
                  className={
                    cleanWebsite
                      ? "truncate text-teal-700 font-medium"
                      : "truncate text-slate-600"
                  }
                >
                  {cleanWebsite || "No website"}
                </span>
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" aria-hidden="true" />
                <span
                  className={
                    b.address ? "truncate text-slate-700" : "truncate text-slate-600"
                  }
                >
                  {b.address || "No address listed"}
                </span>
              </div>
            </div>

            {/* Right Column: Scannable Storefront QR Code */}
            <BusinessQrThumbnail
              url={typeof window !== "undefined" ? `${window.location.origin}${publicHref}` : `https://spillrate.com${publicHref}`}
              businessName={b.name}
            />
          </div>
        </div>

        {/* 4. Bottom Action Row */}
        <div className="w-full pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:text-teal-800">
          {variant === "merchant" ? (
            <>
              <span className="text-slate-600 font-medium">Your Storefront</span>
              <span className="inline-flex items-center gap-1 font-semibold text-teal-700 group-hover:text-teal-800 transition-colors">
                <span>Manage Storefront</span>
                <span aria-hidden="true">&rarr;</span>
              </span>
            </>
          ) : variant === "admin" ? (
            <>
              <span className="text-slate-500 font-normal">
                Slug: <span className="font-mono text-slate-700">{b.slug}</span>
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-teal-700 group-hover:text-teal-800 transition-colors">
                <span>Manage Storefront</span>
                <span aria-hidden="true">&rarr;</span>
              </span>
            </>
          ) : variant === "explore" ? (
            isActualOwner || isFounderOrAdmin ? (
              <>
                <span className="text-slate-600 font-medium">Your Storefront</span>
                <span className="inline-flex items-center gap-1 font-semibold text-teal-700 group-hover:text-teal-800 transition-colors">
                  <span>Manage Storefront</span>
                  <span aria-hidden="true">&rarr;</span>
                </span>
              </>
            ) : (
              <>
                {eligibleEndorsingBiz ? (
                  <span className="inline-flex items-center gap-1 text-slate-600 font-normal">
                    <Briefcase className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                    <span>Verified Partner</span>
                  </span>
                ) : (
                  <span className="text-slate-500 font-normal">Registered Storefront</span>
                )}
                <span className="inline-flex items-center gap-1 font-semibold text-teal-700 group-hover:text-teal-800 transition-colors">
                  <span>Open Storefront</span>
                  <span aria-hidden="true">&rarr;</span>
                </span>
              </>
            )
          ) : (
            <>
              <span>Read reviews and rate</span>
              <span
                aria-hidden="true"
                className="text-slate-600 group-hover:text-teal-700 transition-colors"
              >
                Open &rarr;
              </span>
            </>
          )}
        </div>
      </Link>
    </article>
  );
}
