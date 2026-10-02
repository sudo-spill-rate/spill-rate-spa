import React from "react";
import { Star, Building2, CheckCircle2 } from "lucide-react";

export default function CustomerReviewCard({ review, onPhotoClick }) {
  if (!review) return null;

  const initials = review.name
    ? review.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "CU";

  const formattedDate = review.created_at
    ? new Date(review.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently";

  return (
    <article className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
      {/* Reviewer Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 leading-tight">
              {review.name}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              {/* Star Rating */}
              <div className="flex items-center gap-0.5" aria-label={`Rating: ${review.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((starIndex) => (
                  <Star
                    key={starIndex}
                    className={`w-3.5 h-3.5 ${
                      starIndex <= review.rating
                        ? "fill-amber-500 text-amber-500"
                        : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400">·</span>
              <time className="text-xs text-slate-500" dateTime={review.created_at}>
                {formattedDate}
              </time>
            </div>
          </div>
        </div>

        {/* B2B Endorsement Tag */}
        {review.reviewer_business_id && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
            <Building2 className="w-3 h-3 text-teal-700" />
            <span>Business Endorsement</span>
          </span>
        )}
      </div>

      {/* Review Content */}
      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
        {review.comment}
      </p>

      {/* Photos Attachment Grid */}
      {review.image_urls && review.image_urls.length > 0 && (
        <div className="pt-2 flex items-center gap-2.5">
          {review.image_urls.map((url, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onPhotoClick && onPhotoClick(url)}
              aria-label={`View attached photo ${idx + 1}`}
              className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
            >
              <img
                src={url}
                alt={`Photo ${idx + 1} attached by ${review.name}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </article>
  );
}