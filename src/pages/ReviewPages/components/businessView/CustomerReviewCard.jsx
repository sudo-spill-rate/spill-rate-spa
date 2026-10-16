import React, { useState } from "react";
import { Link } from "react-router";
import { Star, Building2, ThumbsUp, Flag, CornerDownRight } from "lucide-react";
import { reviewService } from "../../../../services/reviewService";
import ReportReviewModal from "./ReportReviewModal";

function PhotoThumbnail({ url, idx, reviewerName, onPhotoClick }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) return null;

  return (
    <button
      type="button"
      onClick={() => onPhotoClick && onPhotoClick(url)}
      aria-label={`View attached photo ${idx + 1}`}
      className="group relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer transition-all"
    >
      <img
        src={url}
        alt={`Photo ${idx + 1} attached by ${reviewerName}`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </button>
  );
}

export default function CustomerReviewCard({ review, onPhotoClick }) {
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
    <article className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs hover:border-slate-300 transition-all space-y-2.5">
      {/* Reviewer Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm text-slate-900 leading-tight truncate">
              {review.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              {/* Star Rating */}
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

        {/* B2B Endorsement Tag */}
        {review.reviewer_business_id && (
          review.reviewer_business?.slug ? (
            <Link
              to={`/business/${review.reviewer_business.slug}`}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200/80 shrink-0 whitespace-nowrap hover:bg-teal-100 transition-colors"
              title={`Endorsed by ${review.reviewer_business.name}`}
            >
              <Building2 className="w-3 h-3 text-teal-700" />
              <span>{review.reviewer_business.name || "Endorsement"}</span>
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 shrink-0 whitespace-nowrap">
              <Building2 className="w-3 h-3 text-teal-700" />
              <span>Endorsement</span>
            </span>
          )
        )}
      </div>

      {/* Review Content */}
      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line break-words">
        {review.comment}
      </p>

      {/* Photos Attachment Grid */}
      {review.image_urls && review.image_urls.length > 0 && (
        <div className="pt-1 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {review.image_urls.map((url, idx) => (
            <PhotoThumbnail
              key={idx}
              url={url}
              idx={idx}
              reviewerName={review.name}
              onPhotoClick={onPhotoClick}
            />
          ))}
        </div>
      )}

      {/* Official Business Owner Reply */}
      {review.reply_comment && (
        <div className="mt-2.5 p-3 rounded-lg bg-teal-50/70 border border-teal-200/90 text-xs text-teal-950 space-y-1">
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
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
        <button
          type="button"
          onClick={handleHelpfulClick}
          disabled={isVoting}
          aria-label={`Mark as helpful. Currently ${helpfulCount} helpful votes.`}
          className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors min-h-[36px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600 disabled:opacity-50 ${
            hasVoted
              ? "bg-teal-50 text-teal-800 border-teal-300"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100"
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
          className="inline-flex items-center justify-center gap-1 text-slate-400 hover:text-red-600 active:text-red-700 text-xs transition-colors px-2 py-1.5 rounded min-h-[36px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600"
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