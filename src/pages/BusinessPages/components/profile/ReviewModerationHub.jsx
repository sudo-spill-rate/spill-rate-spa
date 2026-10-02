import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  MessageSquare,
  Star,
  Pin,
  EyeOff,
  Building,
  RotateCw,
  AlertTriangle,
  CheckCircle,
  X,
  Filter,
} from "lucide-react";
import { useCustomerReviews } from "../../../../hooks/useCustomerReviews";
import { useManageReview } from "../../../../hooks/useManageReview";
import ReviewModerationActions from "./ReviewModerationActions";

export default function ReviewModerationHub({ businessSlug }) {
  const {
    reviews = [],
    isLoadingReviews,
    isLoadingMore,
    pagination,
    error,
    fetchReviews,
    loadMoreReviews,
  } = useCustomerReviews();

  const { deleteReview, isActionLoading } = useManageReview();

  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "pinned" | "hidden"
  const [ratingFilter, setRatingFilter] = useState("all"); // "all" | 5 | 4 | 3 | 2 | 1
  const [notification, setNotification] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [activePhoto, setActivePhoto] = useState(null);

  const modalRef = useRef(null);

  // Load reviews on mount or when slug changes
  const reloadReviews = useCallback(() => {
    if (businessSlug) {
      const query = {};
      if (ratingFilter !== "all") {
        query.rating = Number(ratingFilter);
      }
      fetchReviews(businessSlug, query);
    }
  }, [businessSlug, ratingFilter, fetchReviews]);

  useEffect(() => {
    reloadReviews();
  }, [reloadReviews]);

  const handleActionComplete = (message) => {
    setNotification(message);
    reloadReviews();
    setTimeout(() => {
      setNotification((curr) => (curr === message ? null : curr));
    }, 4000);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;
    const res = await deleteReview(reviewToDelete.id);
    if (res.success) {
      handleActionComplete("Review permanently removed.");
      setReviewToDelete(null);
    } else {
      setNotification(res.message || "Failed to delete review.");
    }
  };

  // Keyboard accessibility for delete dialog
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (reviewToDelete) setReviewToDelete(null);
        if (activePhoto) setActivePhoto(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [reviewToDelete, activePhoto]);

  // Client-side filtering for pin/hidden tabs
  const filteredReviews = reviews.filter((rev) => {
    if (statusFilter === "pinned") return rev.is_pinned;
    if (statusFilter === "hidden") return rev.is_private;
    return true;
  });

  const pinnedCount = reviews.filter((r) => r.is_pinned).length;
  const hiddenCount = reviews.filter((r) => r.is_private).length;

  return (
    <div className="space-y-3.5">
      {/* 1. Temporary Action Notification Banner */}
      {notification && (
        <div
          role="status"
          className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 flex items-center justify-between shadow-2xs text-xs"
        >
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="p-1 text-teal-600 hover:text-teal-900 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Moderation Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 sm:p-2.5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
          {/* Status Tabs */}
          <div className="grid grid-cols-3 sm:flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg overflow-x-auto w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold rounded-md transition-colors text-center truncate min-h-[44px] ${
                statusFilter === "all"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({reviews.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("pinned")}
              className={`px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold rounded-md transition-colors text-center truncate min-h-[44px] ${
                statusFilter === "pinned"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Pinned ({pinnedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("hidden")}
              className={`px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold rounded-md transition-colors text-center truncate min-h-[44px] ${
                statusFilter === "hidden"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Hidden ({hiddenCount})
            </button>
          </div>

          {/* Star Filter Dropdown */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <label htmlFor="rating-filter" className="sr-only">
              Filter by star rating
            </label>
            <select
              id="rating-filter"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full sm:w-auto px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 min-h-[44px]"
            >
              <option value="all">All Star Ratings</option>
              <option value="5">5 Stars only</option>
              <option value="4">4 Stars only</option>
              <option value="3">3 Stars only</option>
              <option value="2">2 Stars only</option>
              <option value="1">1 Star only</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Loading Skeleton */}
      {isLoadingReviews && (!reviews || reviews.length === 0) && (
        <div className="space-y-4" aria-busy="true" aria-label="Loading customer reviews">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 animate-pulse space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 w-32 bg-slate-200 rounded" />
                <div className="h-4 w-20 bg-slate-100 rounded" />
              </div>
              <div className="h-3 w-24 bg-slate-200 rounded" />
              <div className="h-12 w-full bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* 4. Error State */}
      {!isLoadingReviews && error && (
        <div
          role="alert"
          className="p-4 sm:p-6 bg-white rounded-xl border border-red-200 shadow-sm flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900">
              Unable to load customer reviews
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">{error}</p>
            <button
              type="button"
              onClick={reloadReviews}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors min-h-[40px]"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. Empty State */}
      {!isLoadingReviews && !error && filteredReviews.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No customer reviews found
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            {statusFilter !== "all" || ratingFilter !== "all"
              ? "No reviews match your selected filter criteria. Try resetting the filters."
              : "Share your public link with patrons to start collecting verified ratings."}
          </p>
          {(statusFilter !== "all" || ratingFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter("all");
                setRatingFilter("all");
              }}
              className="mt-4 text-xs font-semibold text-teal-700 hover:text-teal-800 underline"
            >
              Reset all filters
            </button>
          )}
        </div>
      )}

      {/* 6. Reviews Feed List */}
      {!isLoadingReviews && !error && filteredReviews.length > 0 && (
        <div className="space-y-3">
          {filteredReviews.map((rev) => {
            const formattedDate = rev.created_at
              ? new Date(rev.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Recent";

            return (
              <article
                key={rev.id}
                className={`bg-white rounded-xl border p-3 sm:p-4 shadow-2xs transition-all ${
                  rev.is_pinned
                    ? "border-amber-300 ring-1 ring-amber-200"
                    : rev.is_private
                    ? "border-slate-200 bg-slate-50/50 opacity-75"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Header row: Author + Badges on left, 3-Dots Menu on far right, Date underneath */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 break-words">
                        {rev.name}
                      </span>

                      {/* Pinned Tag */}
                      {rev.is_pinned && (
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          <Pin className="w-3 h-3 text-amber-600" />
                          <span>Pinned</span>
                        </span>
                      )}

                      {/* Hidden Tag */}
                      {rev.is_private && (
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          <EyeOff className="w-3 h-3 text-slate-500" />
                          <span>Hidden</span>
                        </span>
                      )}

                      {/* B2B Endorsement Tag */}
                      {rev.reviewer_business && (
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                          <Building className="w-3 h-3 text-teal-600" />
                          <span>{rev.reviewer_business.name}</span>
                        </span>
                      )}
                    </div>

                    {/* Date displayed directly under the author's name */}
                    <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">
                      {formattedDate}
                    </p>
                  </div>

                  {/* 3-Dots Moderation Menu on Mobile */}
                  <div className="sm:hidden shrink-0 -mt-1">
                    <ReviewModerationActions
                      review={rev}
                      variant="menu"
                      onActionComplete={handleActionComplete}
                      onRequestDelete={(r) => setReviewToDelete(r)}
                    />
                  </div>
                </div>

                {/* Star Rating Display */}
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= rev.rating
                          ? "text-amber-500 fill-amber-500"
                          : "text-slate-200 fill-slate-200"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-xs font-bold text-slate-700">
                    {rev.rating} of 5
                  </span>
                </div>

                {/* Comment Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-2.5">
                  {rev.comment}
                </p>

                {/* Attached Images */}
                {rev.image_urls && rev.image_urls.length > 0 && (
                  <div className="flex items-center gap-2 mb-2.5 overflow-x-auto pb-1">
                    {rev.image_urls.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActivePhoto(imgUrl)}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border border-slate-200 overflow-hidden hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-teal-600 shrink-0"
                        aria-label={`View attached photo ${idx + 1}`}
                      >
                        <img
                          src={imgUrl}
                          alt="Customer review attachment"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Footer: ID (visible on mobile and desktop) + Desktop Inline Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono select-all">
                    ID: {rev.id}
                  </span>

                  {/* Desktop Inline Actions */}
                  <div className="hidden sm:flex items-center">
                    <ReviewModerationActions
                      review={rev}
                      variant="bar"
                      onActionComplete={handleActionComplete}
                      onRequestDelete={(r) => setReviewToDelete(r)}
                    />
                  </div>
                </div>
              </article>
            );
          })}

          {/* Load More Button */}
          {pagination?.has_more && (
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={loadMoreReviews}
                disabled={isLoadingMore}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors min-h-[44px] shadow-sm disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-teal-600" />
                    <span>Loading more reviews...</span>
                  </>
                ) : (
                  <span>Load More Reviews</span>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 7. Accessible Delete Confirmation Modal */}
      {reviewToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setReviewToDelete(null)}
        >
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3
                  id="delete-dialog-title"
                  className="text-base font-bold text-slate-900"
                >
                  Permanently delete this review?
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  This action removes the review by{" "}
                  <span className="font-semibold text-slate-800">
                    {reviewToDelete.name}
                  </span>{" "}
                  from both public records and your rating breakdown. This operation cannot be undone.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 italic line-clamp-3">
              &ldquo;{reviewToDelete.comment}&rdquo;
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReviewToDelete(null)}
                disabled={isActionLoading}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isActionLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors min-h-[44px] shadow-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                {isActionLoading ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Review</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Photo Lightbox Modal */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Attached review photo enlarged view"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          onClick={() => setActivePhoto(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-white rounded-xl overflow-hidden shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              className="absolute top-3 right-3 p-2 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full transition-colors z-10 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-600"
              aria-label="Close enlarged photo"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activePhoto}
              alt="Enlarged customer submission"
              className="w-full max-h-[80vh] object-contain bg-slate-950"
            />
          </div>
        </div>
      )}
    </div>
  );
}