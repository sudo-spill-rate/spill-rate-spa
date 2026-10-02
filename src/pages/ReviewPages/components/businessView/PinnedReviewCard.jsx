import React from "react";
import { Star, Pin } from "lucide-react";

export default function PinnedReviewCard({ review, onPhotoClick }) {
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
    <article className="bg-slate-50/90 p-5 sm:p-6 rounded-xl border border-teal-200/80 shadow-xs space-y-3">
      {/* Pinned Badge Header */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-800 pb-2 border-b border-teal-100">
        <Pin className="w-3.5 h-3.5 fill-teal-700 text-teal-700" aria-hidden="true" />
        <span>Featured Review Pinned by Business Owner</span>
      </div>

      {/* Reviewer Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white border border-teal-200 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 leading-tight">
              {review.name}
            </h4>
            <div className="flex items-center gap-2 mt-1">
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
      </div>

      {/* Review Content */}
      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
        {review.comment}
      </p>

      {/* Photos */}
      {review.image_urls && review.image_urls.length > 0 && (
        <div className="pt-2 flex items-center gap-2.5">
          {review.image_urls.map((url, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onPhotoClick && onPhotoClick(url)}
              aria-label={`View pinned photo ${idx + 1}`}
              className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 bg-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
            >
              <img
                src={url}
                alt={`Photo ${idx + 1} attached to pinned review`}
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