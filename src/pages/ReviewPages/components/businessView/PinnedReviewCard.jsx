import React, { useState } from "react";
import { Star, Pin, ThumbsUp, Flag, CornerDownRight } from "lucide-react";
import { reviewService } from "../../../../services/reviewService";
import ReportReviewModal from "./ReportReviewModal";

function PinnedPhotoThumbnail({ url, idx, onPhotoClick }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) return null;

  return (
    <button
      type="button"
      onClick={() => onPhotoClick && onPhotoClick(url)}
      aria-label={`View pinned photo ${idx + 1}`}
      className="group relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-white hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer transition-all"
    >
      <img
        src={url}
        alt={`Photo ${idx + 1} attached to pinned review`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </button>
  );
}

export default function PinnedReviewCard({ review, onPhotoClick }) {
  if (!review) return null;

  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count || 0);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

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

  const handleHelpfulClick = async () => {
    if (isVoting) return;
    setIsVoting(true);

    try {
      const res = await reviewService.toggleHelpfulVote(review.id);
      if (res.success && res.data) {
        setHelpfulCount(res.data.helpful_count);
        setHasVoted(res.data.voted);
      }
    } catch (err) {
      console.error("Helpful vote error:", err);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <article className="bg-amber-50/40 p-3.5 sm:p-4 rounded-xl border border-amber-200/80 shadow-2xs space-y-2.5">
      {/* Pinned Badge Header */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-800 pb-2 border-b border-teal-100">
        <Pin className="w-3.5 h-3.5 fill-teal-700 text-teal-700 shrink-0" aria-hidden="true" />
        <span className="truncate">Featured Review Pinned by Business Owner</span>
      </div>

      {/* Reviewer Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-teal-200 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm text-slate-900 leading-tight truncate">
              {review.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div
                className="flex items-center gap-0.5 shrink-0"
                aria-label={`Rating: ${review.rating} out of 5 stars`}
              >
                {[1, 2, 3, 4, 5].map((starIndex) => (
                  <Star
                    key={starIndex}
                    className={`w-3.5 h-3.5 ${
                      starIndex <= review.rating
                        ? "fill-amber-500 text-amber-500"
                        : "fill-slate-100 text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-slate-400 shrink-0" aria-hidden="true">•</span>
              <time
                className="text-xs text-slate-500 whitespace-nowrap shrink-0"
                dateTime={review.created_at}
              >
                {formattedDate}
              </time>
            </div>
          </div>
        </div>
      </div>

      {/* Review Content */}
      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line break-words">
        {review.comment}
      </p>

      {/* Photos */}
      {review.image_urls && review.image_urls.length > 0 && (
        <div className="pt-1 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {review.image_urls.map((url, idx) => (
            <PinnedPhotoThumbnail
              key={idx}
              url={url}
              idx={idx}
              onPhotoClick={onPhotoClick}
            />
          ))}
        </div>
      )}

      {/* Official Business Owner Reply */}
      {review.reply_comment && (
        <div className="mt-2.5 p-3 rounded-lg bg-white/90 border border-teal-200 text-xs text-teal-950 space-y-1">
          <div className="flex items-center justify-between font-semibold text-teal-900 text-[11px] gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <CornerDownRight className="w-3.5 h-3.5 text-teal-700 shrink-0" />
              <span>Official Storefront Response</span>
            </div>
            {review.replied_at && (
              <span className="text-teal-700 font-normal">
                {new Date(review.replied_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
          <p className="text-slate-800 leading-relaxed pl-5 whitespace-pre-line break-words text-xs sm:text-[13px]">
            {review.reply_comment}
          </p>
        </div>
      )}

      {/* Footer Actions: Helpful Vote & Report Review */}
      <div className="pt-2 border-t border-teal-100 flex items-center justify-between gap-3 text-xs">
        <button
          type="button"
          onClick={handleHelpfulClick}
          disabled={isVoting}
          aria-label={`Mark as helpful. Currently ${helpfulCount} helpful votes.`}
          className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors min-h-[36px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600 disabled:opacity-50 ${
            hasVoted
              ? "bg-teal-100/80 text-teal-900 border-teal-300"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? "fill-teal-700 text-teal-700" : ""}`} />
          <span>{helpfulCount > 0 ? `Helpful (${helpfulCount})` : "Helpful"}</span>
        </button>

        <button
          type="button"
          onClick={() => setReportModalOpen(true)}
          title="Report this review"
          aria-label="Report this review to moderators"
          className="inline-flex items-center justify-center gap-1 text-slate-400 hover:text-red-600 text-xs transition-colors px-2 py-1.5 rounded min-h-[36px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          <Flag className="w-3.5 h-3.5" />
          <span>Report</span>
        </button>
      </div>

      {/* Report Modal Dialog */}
      <ReportReviewModal
        review={review}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </article>
  );
}