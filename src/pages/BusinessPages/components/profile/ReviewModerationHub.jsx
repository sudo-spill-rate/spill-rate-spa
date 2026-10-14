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
  CornerDownRight,
  ShieldAlert,
  Send,
  Trash2,
  Download,
} from "lucide-react";
import { manageReviewService } from "../../../../services/manageReviewService";
import { useManageReview } from "../../../../hooks/useManageReview";
import { useBusinessProfile } from "../../../../hooks/useBusinessProfile";
import { useBodyScrollLock } from "../../../../hooks/useBodyScrollLock";
import ReviewModerationActions from "./ReviewModerationActions";

export default function ReviewModerationHub({ businessId, businessSlug }) {
  const targetId = businessId || businessSlug;

  const {
    deleteReview,
    postReply,
    deleteReply,
    fetchReports,
    updateReportStatus,
    isActionLoading,
  } = useManageReview();
  const { exportReviews } = useBusinessProfile();

  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  // Status Filter ("all" | "public" | "private" | "pinned")
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [notification, setNotification] = useState(null);

  // Modals state
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [activePhoto, setActivePhoto] = useState(null);
  const [replyModalReview, setReplyModalReview] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [reportsModalOpen, setReportsModalOpen] = useState(false);
  const [flaggedReports, setFlaggedReports] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  const isAnyModalOpen = Boolean(reviewToDelete || activePhoto || replyModalReview || reportsModalOpen);
  useBodyScrollLock(isAnyModalOpen);

  const deleteModalRef = useRef(null);
  const replyModalRef = useRef(null);
  const reportsModalRef = useRef(null);

  // Fetch management reviews from backend
  const reloadReviews = useCallback(async () => {
    if (!targetId) return;

    try {
      setIsLoadingReviews(true);
      setError(null);

      const res = await manageReviewService.getManageReviews(targetId, {
        filter: statusFilter,
        limit: 15,
      });

      if (res.success) {
        let data = res.data;
        if (ratingFilter !== "all") {
          data = data.filter((r) => r.rating === Number(ratingFilter));
        }
        setReviews(data);
        setPagination(res.pagination);
      } else {
        setError(res.message || "Failed to load management reviews.");
      }
    } catch (err) {
      setError(err?.message || "Failed to load management reviews.");
    } finally {
      setIsLoadingReviews(false);
    }
  }, [targetId, statusFilter, ratingFilter]);

  useEffect(() => {
    reloadReviews();
  }, [reloadReviews]);

  // Load more reviews (pagination)
  const handleLoadMore = async () => {
    if (!pagination?.has_more || !pagination?.next_cursor || isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const res = await manageReviewService.getManageReviews(targetId, {
        filter: statusFilter,
        cursor: pagination.next_cursor,
        limit: pagination.limit || 15,
      });

      if (res.success) {
        let newData = res.data;
        if (ratingFilter !== "all") {
          newData = newData.filter((r) => r.rating === Number(ratingFilter));
        }
        setReviews((prev) => [...prev, ...newData]);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error("Load more error:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

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

  // Reply handlers
  const handleOpenReply = (rev) => {
    setReplyModalReview(rev);
    setReplyText(rev.reply_comment || "");
  };

  const handleSaveReply = async (e) => {
    e.preventDefault();
    if (!replyModalReview || !replyText.trim()) return;

    try {
      setIsSubmittingReply(true);
      const res = await postReply(replyModalReview.id, replyText.trim());
      if (res.success) {
        handleActionComplete("Official response published successfully.");
        setReplyModalReview(null);
        setReplyText("");
      } else {
        setNotification(res.message || "Failed to publish response.");
      }
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleDeleteReply = async () => {
    if (!replyModalReview) return;

    try {
      setIsSubmittingReply(true);
      const res = await deleteReply(replyModalReview.id);
      if (res.success) {
        handleActionComplete("Official response removed.");
        setReplyModalReview(null);
        setReplyText("");
      } else {
        setNotification(res.message || "Failed to remove response.");
      }
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Reports handlers
  const handleOpenReports = async () => {
    setReportsModalOpen(true);
    if (!targetId) return;
    try {
      setIsLoadingReports(true);
      const res = await fetchReports(targetId);
      if (res.success && res.data) {
        setFlaggedReports(res.data);
      }
    } finally {
      setIsLoadingReports(false);
    }
  };

  const handleUpdateReport = async (reportId, nextStatus) => {
    const res = await updateReportStatus(reportId, nextStatus);
    if (res.success) {
      setFlaggedReports((prev) =>
        prev.map((rep) =>
          rep.id === reportId ? { ...rep, status: nextStatus } : rep
        )
      );
      handleActionComplete(`Report marked as ${nextStatus}.`);
    } else {
      setNotification(res.message || "Failed to update report status.");
    }
  };

  const handleExportCsv = async () => {
    if (!targetId || isExporting) return;
    try {
      setIsExporting(true);
      const res = await exportReviews(targetId, businessSlug || "reviews");
      if (res.success) {
        handleActionComplete("Review export CSV downloaded.");
      } else {
        setNotification(res.message || "Failed to export reviews.");
      }
    } finally {
      setIsExporting(false);
    }
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (reviewToDelete) setReviewToDelete(null);
        if (replyModalReview) setReplyModalReview(null);
        if (reportsModalOpen) setReportsModalOpen(false);
        if (activePhoto) setActivePhoto(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [reviewToDelete, replyModalReview, reportsModalOpen, activePhoto]);

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
          <div className="grid grid-cols-4 sm:flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg overflow-x-auto w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold rounded-md transition-colors text-center truncate min-h-[44px] ${
                statusFilter === "all"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("public")}
              className={`px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold rounded-md transition-colors text-center truncate min-h-[44px] ${
                statusFilter === "public"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Public
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
              Pinned
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("private")}
              className={`px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold rounded-md transition-colors text-center truncate min-h-[44px] ${
                statusFilter === "private"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Hidden
            </button>
          </div>

          {/* Right Toolbar: Star Filter, Flagged Reports & Export CSV */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            {/* Export CSV Button */}
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer disabled:opacity-50"
              title="Export all reviews to CSV"
            >
              {isExporting ? (
                <RotateCw className="w-3.5 h-3.5 text-teal-600 animate-spin" />
              ) : null}
              <span>{isExporting ? "Exporting..." : "Export CSV"}</span>
            </button>

            {/* Flagged Reports Button */}
            <button
              type="button"
              onClick={handleOpenReports}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
            >
              <span>Flagged Reports</span>
            </button>

            {/* Star Filter Dropdown */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="rating-filter" className="sr-only">
                Filter by star rating
              </label>
              <select
                id="rating-filter"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full sm:w-auto px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 min-h-[44px] cursor-pointer"
              >
                <option value="all">All Stars</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
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
      {!isLoadingReviews && !error && reviews.length === 0 && (
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
      {!isLoadingReviews && !error && reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((rev) => {
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
                className={`bg-white rounded-xl border p-3.5 sm:p-4 shadow-2xs transition-all ${
                  rev.is_pinned
                    ? "border-amber-300 ring-1 ring-amber-200"
                    : rev.is_private
                    ? "border-slate-200 bg-slate-50/60 opacity-80"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 break-words">
                        {rev.name}
                      </span>

                      {rev.is_pinned && (
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          <Pin className="w-3 h-3 text-amber-600" />
                          <span>Pinned</span>
                        </span>
                      )}

                      {rev.is_private && (
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          <EyeOff className="w-3 h-3 text-slate-500" />
                          <span>Hidden</span>
                        </span>
                      )}

                      {rev.reviewer_business_id && (
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                          <Building className="w-3 h-3 text-teal-600" />
                          <span>Business Endorsement</span>
                        </span>
                      )}
                    </div>

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
                      onRequestReply={(r) => handleOpenReply(r)}
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
                  {typeof rev.helpful_count === "number" && rev.helpful_count > 0 && (
                    <span className="ml-2 text-[11px] text-slate-500 font-medium">
                      · {rev.helpful_count} helpful {rev.helpful_count === 1 ? "vote" : "votes"}
                    </span>
                  )}
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
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border border-slate-200 overflow-hidden hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-teal-600 shrink-0 cursor-pointer"
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

                {/* Official Business Owner Reply Box if present */}
                {rev.reply_comment && (
                  <div className="mt-2.5 mb-2.5 p-3 rounded-lg bg-teal-50/70 border border-teal-200 text-xs text-teal-950 space-y-1">
                    <div className="flex items-center justify-between font-semibold text-teal-900 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <CornerDownRight className="w-3.5 h-3.5 text-teal-700" />
                        <span>Official Storefront Response</span>
                      </div>
                      {rev.replied_at && (
                        <span className="text-teal-700 font-normal">
                          {new Date(rev.replied_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-800 leading-relaxed pl-5 whitespace-pre-line">
                      {rev.reply_comment}
                    </p>
                  </div>
                )}

                {/* Footer: ID + Desktop Inline Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono select-all">
                    ID: {rev.id}
                  </span>

                  <div className="hidden sm:flex items-center">
                    <ReviewModerationActions
                      review={rev}
                      variant="bar"
                      onActionComplete={handleActionComplete}
                      onRequestDelete={(r) => setReviewToDelete(r)}
                      onRequestReply={(r) => handleOpenReply(r)}
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
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors min-h-[44px] shadow-sm disabled:opacity-50 cursor-pointer"
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

      {/* 7. Owner Reply Modal */}
      {replyModalReview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reply-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
          onClick={() => setReplyModalReview(null)}
        >
          <div
            ref={replyModalRef}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-5 sm:p-6 my-auto space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 id="reply-dialog-title" className="text-base font-bold text-slate-900">
                  {replyModalReview.reply_comment ? "Edit Official Response" : "Respond to Customer Review"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Replying to review by <strong className="text-slate-800">{replyModalReview.name}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReplyModalReview(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 italic line-clamp-3">
              &ldquo;{replyModalReview.comment}&rdquo;
            </div>

            <form onSubmit={handleSaveReply} className="space-y-3">
              <div>
                <label htmlFor="reply-textarea" className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Official Response
                </label>
                <textarea
                  id="reply-textarea"
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Thank the customer for visiting, address their concern, or share an update..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 text-slate-800"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                {replyModalReview.reply_comment ? (
                  <button
                    type="button"
                    onClick={handleDeleteReply}
                    disabled={isSubmittingReply}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors min-h-[40px] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Response</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReplyModalReview(null)}
                    disabled={isSubmittingReply}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg min-h-[40px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReply || !replyText.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs min-h-[40px] disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingReply ? (
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>{replyModalReview.reply_comment ? "Update Response" : "Post Response"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Flagged Reports Modal */}
      {reportsModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reports-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
          onClick={() => setReportsModalOpen(false)}
        >
          <div
            ref={reportsModalRef}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full p-5 sm:p-6 space-y-4 max-h-[85vh] my-auto flex flex-col"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <h3 id="reports-dialog-title" className="text-base font-bold text-slate-900">
                  Flagged Review Reports
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReportsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {isLoadingReports && (
                <div className="py-8 text-center text-xs text-slate-500">
                  <RotateCw className="w-5 h-5 animate-spin mx-auto text-teal-600 mb-2" />
                  <span>Loading flagged reports...</span>
                </div>
              )}

              {!isLoadingReports && flaggedReports.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-500">
                  No flagged reports recorded for this business.
                </div>
              )}

              {!isLoadingReports &&
                flaggedReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 uppercase text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        Reason: {report.reason.replace(/_/g, " ")}
                      </span>
                      <span
                        className={`font-semibold text-[11px] px-2 py-0.5 rounded ${
                          report.status === "resolved"
                            ? "bg-teal-100 text-teal-800"
                            : report.status === "dismissed"
                            ? "bg-slate-200 text-slate-700"
                            : "bg-amber-50 text-amber-900"
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>

                    {report.details && (
                      <p className="text-slate-700 italic">
                        &ldquo;{report.details}&rdquo;
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
                      <span className="text-slate-400 font-mono">
                        Review ID: {report.review_id}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {report.status !== "resolved" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateReport(report.id, "resolved")}
                            className="px-2.5 py-1 text-[11px] font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded border border-teal-200 min-h-[32px] cursor-pointer"
                          >
                            Mark Resolved
                          </button>
                        )}
                        {report.status !== "dismissed" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateReport(report.id, "dismissed")}
                            className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded border border-slate-300 min-h-[32px] cursor-pointer"
                          >
                            Dismiss
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 9. Delete Confirmation Modal */}
      {reviewToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
          onClick={() => setReviewToDelete(null)}
        >
          <div
            ref={deleteModalRef}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 my-auto space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 id="delete-dialog-title" className="text-base font-bold text-slate-900">
                  Permanently delete this review?
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  This action removes the review by{" "}
                  <span className="font-semibold text-slate-800">{reviewToDelete.name}</span>{" "}
                  from both public records and your rating breakdown.
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
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors min-h-[44px] shadow-sm disabled:opacity-50 cursor-pointer"
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

      {/* 10. Photo Lightbox Modal */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Attached review photo enlarged view"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
          onClick={() => setActivePhoto(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-white rounded-xl overflow-hidden shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              className="absolute top-3 right-3 p-2 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full transition-colors z-10 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
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