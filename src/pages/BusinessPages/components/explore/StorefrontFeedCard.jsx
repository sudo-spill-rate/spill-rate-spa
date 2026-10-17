import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Star,
  MapPin,
  Phone,
  Globe,
  QrCode,
  Briefcase,
} from "lucide-react";
import QRCode from "qrcode";
import { useBusiness } from "../../../../context/business/useBusiness";
import { useUserAuth } from "../../../../hooks/useUserAuth";

export default function StorefrontFeedCard({ business, isOwner = false }) {
  const [imgError, setImgError] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const { businesses: ownerBusinesses } = useBusiness();
  const { user } = useUserAuth();

  const isFounderOrAdmin = user?.role === "founder" || user?.role === "admin";
  const isActualOwner =
    isOwner ||
    (ownerBusinesses || []).some((b) => b.id === business?.id || b.slug === business?.slug);

  const eligibleEndorsingBiz = (ownerBusinesses || []).find(
    (b) => b.id !== business?.id && b.slug !== business?.slug
  );

  const rawAvg =
    typeof business?.average_rating === "number"
      ? business.average_rating
      : typeof business?.rating_breakdown?.average_rating === "number"
      ? business.rating_breakdown.average_rating
      : null;
  const hasRating = rawAvg !== null && rawAvg > 0;
  const reviewCount =
    business?.total_reviews ?? business?.rating_breakdown?.total_reviews ?? 0;

  const publicHref = `/business/${business?.slug || business?.id}`;
  const exploreHref = `/dashboard/explore/business/${business?.slug || business?.id}`;
  const manageHref = isFounderOrAdmin
    ? `/admin/my-store/${business?.slug || business?.id}`
    : `/dashboard/business/${business?.slug || business?.id}`;
  const targetHref = isActualOwner || isFounderOrAdmin ? manageHref : exploreHref;

  const cleanWebsite = business?.website
    ? business.website.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : "";

  useEffect(() => {
    let isMounted = true;
    if (!business) return;
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://spillrate.com";
    const targetUrl = `${origin}${publicHref}`;
    QRCode.toDataURL(targetUrl, {
      width: 144,
      margin: 1,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [business, publicHref]);

  if (!business) return null;

  return (
    <article className="group w-full h-full flex flex-col bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 shadow-xs transition-colors">
      <Link
        to={targetHref}
        className="w-full p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-3 active:bg-slate-50/70 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-xl transition-colors"
      >
        <div className="w-full flex-1 flex flex-col justify-between">
          {/* 1. Top Header: Left (Business Name + Verified shield + Your Storefront badge, Category & Rating) | Top-Right (Brand Logo) */}
          <div className="w-full flex items-center justify-between gap-3 pb-3">
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 sm:gap-1.5">
              {/* Row 1: Business Name | Verified Shield | Your Storefront */}
              <div className="w-full flex items-center gap-1.5 min-w-0 flex-wrap">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-teal-700 transition-colors truncate leading-snug tracking-tight">
                  {business.name}
                </h3>

                {business.is_verified && (
                  <span
                    className="inline-flex items-center gap-1 shrink-0"
                    title="Verified Establishment"
                    aria-label="Verified Establishment"
                  >
                    <span className="text-slate-300 font-light text-xs" aria-hidden="true">
                      |
                    </span>
                    <img
                      src="https://res.cloudinary.com/qzludnat/image/upload/v1792131560/Teal_Verified_Shield_Icon-removebg-preview.png"
                      alt=""
                      className="w-4 h-4 object-contain inline-block drop-shadow-2xs"
                      decoding="async"
                    />
                  </span>
                )}

                {isActualOwner && (
                  <span className="text-[10px] sm:text-[11px] font-semibold bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded border border-teal-200 shrink-0">
                    Your Storefront
                  </span>
                )}
              </div>

              {/* Mobile: stacked Category + Rating (clean lines matching w-16 logo height); Desktop (sm:): inline pill + rating */}
              <div className="w-full flex flex-col items-start gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2 sm:gap-y-1 text-xs min-w-0">
                {business.category && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80 truncate max-w-full">
                    {business.category}
                  </span>
                )}

                <div className="inline-flex items-center gap-1 min-w-0">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600 shrink-0" aria-hidden="true" />
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

            {/* Top-Right Corner: Brand Logo (w-16 h-16 on mobile to align flush with w-16 h-16 QR code below; sm:w-14 sm:h-14 on desktop) */}
            <div className="shrink-0">
              {business.image_url && !imgError ? (
                <img
                  src={business.image_url}
                  alt={`${business.name} logo`}
                  className="w-16 h-16 sm:w-14 sm:h-14 rounded-xl object-cover border border-slate-200/90 shadow-2xs bg-white"
                  loading="lazy"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-16 h-16 sm:w-14 sm:h-14 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center font-bold text-teal-800 text-lg sm:text-lg shadow-2xs">
                  {business.name ? business.name.charAt(0).toUpperCase() : "B"}
                </div>
              )}
            </div>
          </div>

          {/* 2. Subtle Horizontal Divider */}
          <div className="w-full border-t border-slate-200/80" />

          {/* 3. Bottom Body: Two-Column Layout (Left: Contact Details | Right: Scannable QR Code) */}
          <div className="w-full pt-3 flex items-center justify-between gap-3">
            {/* Left Column: Contact Details with Minimalist Icons */}
            <div className="flex-1 min-w-0 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Phone className="w-3.5 h-3.5 text-teal-700 shrink-0" aria-hidden="true" />
                <span className={business.phone ? "truncate text-slate-800 font-medium" : "truncate text-slate-600"}>
                  {business.phone || "No contact number"}
                </span>
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <Globe className="w-3.5 h-3.5 text-teal-700 shrink-0" aria-hidden="true" />
                <span className={cleanWebsite ? "truncate text-teal-700 font-medium" : "truncate text-slate-600"}>
                  {cleanWebsite || "No website"}
                </span>
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" aria-hidden="true" />
                <span className={business.address ? "truncate text-slate-700" : "truncate text-slate-600"}>
                  {business.address || "No address listed"}
                </span>
              </div>
            </div>

            {/* Right Column: Scannable Storefront QR Code (w-16 h-16 aligned vertically with top-right logo) */}
            <div
              className="shrink-0 flex flex-col items-center justify-center"
              title={`Scan QR to open ${business.name}`}
            >
              <div className="w-16 h-16 rounded-lg border border-slate-200/90 bg-slate-50/50 p-1 shadow-2xs flex items-center justify-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`${business.name} QR code`}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <QrCode className="w-7 h-7 text-slate-600" aria-hidden="true" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Action Row */}
        <div className="w-full pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:text-teal-800">
          {isActualOwner || isFounderOrAdmin ? (
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
          )}
        </div>
      </Link>
    </article>
  );
}
