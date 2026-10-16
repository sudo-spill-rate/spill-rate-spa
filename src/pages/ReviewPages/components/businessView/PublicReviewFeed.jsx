import React from "react";
import { AlertCircle, MessageSquare, Star } from "lucide-react";
import CustomerReviewCard from "./CustomerReviewCard";
import PinnedReviewCard from "./PinnedReviewCard";

export default function PublicReviewFeed({
  reviews = [],
  isLoading = false,
  isError = false,
  onRetry,
  selectedRating,
  onClearFilter,
  onPhotoClick,
}) {
  if (isLoading) {
    return (
      <div className="space-y-3" aria-busy="true">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs animate-pulse space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-200" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 w-32 bg-slate-200 rounded" />
                <div className="h-3 w-20 bg-slate-200 rounded" />
              </div>
            </div>
            <div className="h-3.5 w-full bg-slate-200 rounded" />
            <div className="h-3.5 w-2/3 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center bg-white rounded-xl border border-slate-200 shadow-xs">
        <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-900">Failed to Load Reviews</h3>
        <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
          We could not load customer reviews at this time. Please check your connection and try again.
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[38px] cursor-pointer"
          >
            Retry Loading Reviews
          </button>
        )}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          No customer reviews found
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          {selectedRating
            ? `There are currently no ${selectedRating}-star reviews for this establishment.`
            : "Share your public link with patrons to start collecting verified ratings."}
        </p>
        {selectedRating && onClearFilter && (
          <button
            type="button"
            onClick={onClearFilter}
            className="mt-4 text-xs font-semibold text-teal-700 hover:text-teal-800 underline focus:outline-none focus:ring-2 focus:ring-teal-600 rounded p-1"
          >
            Reset all filters
          </button>
        )}
      </div>
    );
  }

  // Separate pinned reviews if present (supports multiple pinned reviews)
  const pinnedReviews = reviews.filter((r) => r.is_pinned);
  const regularReviews = reviews.filter((r) => !r.is_pinned);

  return (
    <div className="space-y-3">
      {/* Pinned Reviews */}
      {pinnedReviews.map((review) => (
        <PinnedReviewCard
          key={review.id}
          review={review}
          onPhotoClick={onPhotoClick}
        />
      ))}

      {/* Regular Reviews */}
      {regularReviews.map((review) => (
        <CustomerReviewCard
          key={review.id}
          review={review}
          onPhotoClick={onPhotoClick}
        />
      ))}
    </div>
  );
}