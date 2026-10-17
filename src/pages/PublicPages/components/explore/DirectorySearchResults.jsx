import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Star, MapPin, Phone, Globe, QrCode, AlertCircle, SearchX } from "lucide-react";
import QRCode from "qrcode";

function SearchResultCard({ biz }) {
  const [imgError, setImgError] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");

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
  const cleanWebsite = biz?.website
    ? biz.website.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : "";

  useEffect(() => {
    let isMounted = true;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://spillrate.com";
    const targetUrl = `${origin}${businessHref}`;
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
  }, [businessHref]);

  return (
    <article className="group w-full h-full flex flex-col bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 shadow-xs transition-colors">
      <Link
        to={businessHref}
        className="w-full p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-3 active:bg-slate-50/70 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-xl transition-colors"
      >
        <div className="w-full flex-1 flex flex-col justify-between">
          {/* 1. Top Header: Left (Business Name + Verified, Category & Rating) | Top-Right (Brand Logo) */}
          <div className="w-full flex items-center justify-between gap-3 pb-3">
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 sm:gap-1.5">
              {/* Row 1: Business Name | Verified Shield */}
              <div className="w-full flex items-center gap-1.5 min-w-0">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-teal-700 transition-colors truncate leading-snug tracking-tight">
                  {biz.name}
                </h3>

                {biz.is_verified && (
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
              </div>

              {/* Mobile: stacked Category + Rating (3 clean lines matching w-16 logo height); Desktop (sm:): inline pill + rating */}
              <div className="w-full flex flex-col items-start gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2 sm:gap-y-1 text-xs min-w-0">
                {biz.category && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80 truncate max-w-full">
                    {biz.category}
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
              {biz.image_url && !imgError ? (
                <img
                  src={biz.image_url}
                  alt={`${biz.name} logo`}
                  className="w-16 h-16 sm:w-14 sm:h-14 rounded-xl object-cover border border-slate-200/90 shadow-2xs bg-white"
                  loading="lazy"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-16 h-16 sm:w-14 sm:h-14 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center font-bold text-teal-800 text-lg sm:text-lg shadow-2xs">
                  {biz.name ? biz.name.charAt(0).toUpperCase() : "B"}
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
                <span className={biz.phone ? "truncate text-slate-800 font-medium" : "truncate text-slate-600"}>
                  {biz.phone || "No contact number"}
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
                <span className={biz.address ? "truncate text-slate-700" : "truncate text-slate-600"}>
                  {biz.address || "No address listed"}
                </span>
              </div>
            </div>

            {/* Right Column: Scannable Storefront QR Code (w-16 h-16 aligned vertically with top-right logo) */}
            <div
              className="shrink-0 flex flex-col items-center justify-center"
              title={`Scan QR to open ${biz.name}`}
            >
              <div className="w-16 h-16 rounded-lg border border-slate-200/90 bg-slate-50/50 p-1 shadow-2xs flex items-center justify-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`${biz.name} QR code`}
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

        {/* 4. Bottom Action Row */}
        <div className="w-full pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:text-teal-800">
          <span>Read reviews and rate</span>
          <span aria-hidden="true" className="text-slate-600 group-hover:text-teal-700 transition-colors">
            Open &rarr;
          </span>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4.5" aria-busy="true">
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
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4.5">
      {businesses.map((biz) => (
        <SearchResultCard key={biz.id} biz={biz} />
      ))}
    </div>
  );
}