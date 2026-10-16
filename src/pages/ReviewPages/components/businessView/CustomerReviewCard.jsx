import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { Star, Building2, ThumbsUp, MoreHorizontal, Flag, MessageSquare, Share2, CornerDownRight } from "lucide-react";
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
      className="group relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer transition-all shadow-2xs"
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

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

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Review by ${review.name}`,
          text: review.comment,
          url,
        });
        return;
      } catch (err) {
        if (err.name !== "AbortError") console.error("Share error:", err);
      }
    }
    navigator.clipboard?.writeText(url);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <article className="bg-white rounded-xl border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs hover:border-slate-300 transition-all space-y-3">
      {/* 1. Header: Circular Avatar, Bold Username on top, Star Rating + Date subline, 3-dots top right */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Circular Avatar */}
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-2xs">
            {initials}
          </div>

          {/* User Name & Sub-line (Stars • Date) */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                {review.name}
              </h4>

              {/* B2B Endorsement Badge */}
              {review.reviewer_business_id && (
                review.reviewer_business?.slug ? (
                  <Link
                    to={`/business/${review.reviewer_business.slug}`}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200/60 shrink-0 whitespace-nowrap hover:bg-teal-100 transition-colors"
                    title={`Endorsed by ${review.reviewer_business.name}`}
                  >
                    <Building2 className="w-3 h-3 text-teal-700" />
                    <span>{review.reviewer_business.name || "Endorsement"}</span>
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60 shrink-0 whitespace-nowrap">
                    <Building2 className="w-3 h-3 text-teal-700" />
                    <span>Endorsement</span>
                  </span>
                )
              )}
            </div>

            {/* Sub-line: Star Rating • Date */}
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

        {/* Top-Right: 3-Dots More Options Menu */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600"
            aria-label="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setReportModalOpen(true);
                }}
                className="w-full px-3 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Flag className="w-3.5 h-3.5 text-slate-400" />
                <span>Report Review</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Body: Left-aligned text + attached media */}
      <div className="space-y-2.5">
        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line break-words">
          {review.comment}
        </p>

        {/* Media / Photo Thumbnails with rounded borders */}
        {review.image_urls && review.image_urls.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
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
      </div>

      {/* Official Business Owner Reply if present */}
      {review.reply_comment && (
        <div className="p-2.5 sm:p-3 rounded-lg bg-teal-50/70 border border-teal-200/90 text-xs text-teal-950 space-y-1">
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

      {/* 3. Footer / Actions: border-t divider with Facebook-style action buttons ('Helpful'/'Like', 'Comment', 'Share') */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        {/* Helpful / Like Action */}
        <button
          type="button"
          onClick={handleHelpfulClick}
          disabled={isVoting}
          aria-label={`Mark as helpful. Currently ${helpfulCount} helpful votes.`}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-semibold transition-colors min-h-[36px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600 ${
            hasVoted
              ? "text-teal-700 bg-teal-50"
              : "hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100"
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${hasVoted ? "fill-teal-700 text-teal-700" : ""}`} />
          <span>{helpfulCount > 0 ? `Helpful (${helpfulCount})` : "Helpful"}</span>
        </button>

        {/* Comment Action */}
        <div
          title={review.reply_comment ? "Storefront responded" : "Comments restricted to verified establishment"}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-semibold text-slate-500 hover:bg-slate-50 min-h-[36px] cursor-default select-none"
        >
          <MessageSquare className="w-4 h-4 text-slate-400" />
          <span>{review.reply_comment ? "1 Response" : "Comment"}</span>
        </div>

        {/* Share Action */}
        <button
          type="button"
          onClick={handleShare}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 transition-colors min-h-[36px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600"
        >
          <Share2 className="w-4 h-4 text-slate-400" />
          <span>{showCopied ? "Link Copied!" : "Share"}</span>
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