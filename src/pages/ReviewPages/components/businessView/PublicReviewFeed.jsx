import React from "react";
import { AlertCircle, MessageSquareOff, Star } from "lucide-react";
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
      <div className="space-y-4" aria-busy="true">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs animate-pulse space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-32 bg-slate-200 rounded" />
                <div className="h-3 w-20 bg-slate-200 rounded" />
              </div>
            </div>
            <div className="h-4 w-full bg-slate-200 rounded" />
            <div className="h-4 w-2/3 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 shadow-xs">
        <AlertCircle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900">Failed to Load Reviews</h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-sm mx-auto">
          We could not load customer reviews at this time. Please check your connection and try again.
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px]"
          >
            Retry Loading Reviews
          </button>
        )}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="p-8 sm:p-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs">
        <MessageSquareOff className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900">
          {selectedRating ? `No ${selectedRating}-Star Reviews` : "No Community Reviews Yet"}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-sm mx-auto">
          {selectedRating
            ? `There are currently no ${selectedRating}-star reviews for this establishment.`
            : "Be the first patron to share your firsthand impressions and rate this local business."}
        </p>
        {selectedRating && onClearFilter && (
          <button
            type="button"
            onClick={onClearFilter}
            className="mt-4 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[40px]"
          >
            Clear Star Filter
          </button>
        )}
      </div>
    );
  }

  // Separate pinned review if present
  const pinnedReview = reviews.find((r) => r.is_pinned);
  const regularReviews = reviews.filter((r) => !r.is_pinned);

  return (
    <div className="space-y-4">
      {/* Pinned Review Header if exists */}
      {pinnedReview && (
        <PinnedReviewCard review={pinnedReview} onPhotoClick={onPhotoClick} />
      )}

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