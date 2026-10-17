import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { Star, Building2, ThumbsUp, MoreHorizontal, Flag, MessageSquare, Share2, CornerDownRight } from "lucide-react";
import { reviewService } from "../../../../services/reviewService";
import ReportReviewModal from "./ReportReviewModal";

function ReviewMediaGallery({ imageUrls, reviewerName, onPhotoClick }) {
  const [orientations, setOrientations] = useState({});

  if (!imageUrls || imageUrls.length === 0) return null;

  const handleImageLoad = (idx, e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (!naturalWidth || !naturalHeight) return;
    const nextType =
      naturalWidth > naturalHeight * 1.15
        ? "landscape"
        : naturalHeight > naturalWidth * 1.15
        ? "portrait"
        : "square";
    setOrientations((prev) =>
      prev[idx] === nextType ? prev : { ...prev, [idx]: nextType }
    );
  };

  // 1 photo: Adapts height for Landscape vs Portrait while keeping whole image visible (object-contain)
  if (imageUrls.length === 1) {
    const isPortrait = orientations[0] === "portrait";
    return (
      <div className="pt-1 w-full">
        <button
          type="button"
          onClick={() => onPhotoClick && onPhotoClick(imageUrls[0], imageUrls, 0)}
          aria-label={`View photo attached by ${reviewerName}`}
          className="group relative w-full rounded-lg overflow-hidden border border-slate-200/90 bg-slate-100/80 hover:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer transition-all shadow-sm flex items-center justify-center"
        >
          <img
            src={imageUrls[0]}
            alt={`Photo attached by ${reviewerName}`}
            onLoad={(e) => handleImageLoad(0, e)}
            className={`w-full object-contain transition-transform duration-300 ${
              isPortrait
                ? "max-h-[250px] sm:max-h-[300px]"
                : "max-h-[200px] sm:max-h-[260px]"
            }`}
            loading="lazy"
          />
        </button>
      </div>
    );
  }

  // 2 photos:
  // - All Landscape: Stacked vertically on mobile (grid-cols-1 sm:grid-cols-2) so wide photos aren't squeezed
  // - All Portrait: Taller side-by-side 2-column grid (h-48 sm:h-56) matching vertical aspect
  // - Mix: Balanced side-by-side 2-column grid (h-40 sm:h-48) with object-contain
  if (imageUrls.length === 2) {
    const bothLandscape =
      orientations[0] === "landscape" && orientations[1] === "landscape";
    const bothPortrait =
      orientations[0] === "portrait" && orientations[1] === "portrait";

    return (
      <div
        className={`pt-1 grid gap-1.5 w-full ${
          bothLandscape ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2"
        }`}
      >
        {imageUrls.map((url, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onPhotoClick && onPhotoClick(url, imageUrls, idx)}
            aria-label={`View attached photo ${idx + 1} of 2`}
            className={`group relative w-full rounded-lg overflow-hidden border border-slate-200/90 bg-slate-100/80 hover:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer transition-all shadow-sm flex items-center justify-center ${
              bothPortrait
                ? "h-48 sm:h-56"
                : bothLandscape
                ? "h-36 sm:h-44"
                : "h-40 sm:h-48"
            }`}
          >
            <img
              src={url}
              alt={`Photo ${idx + 1} attached by ${reviewerName}`}
              onLoad={(e) => handleImageLoad(idx, e)}
              className="w-full h-full object-contain transition-transform duration-200"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    );
  }

  // 3+ photos:
  // - If 1st photo is Portrait: Facebook Left-Hero Collage (1 tall left + 2 stacked right)
  // - If 1st photo is Landscape/Square: Facebook Top-Hero Collage (1 full-width top + 2 side-by-side bottom)
  const visiblePhotos = imageUrls.slice(0, 3);
  const extraCount = imageUrls.length - 3;
  const firstIsPortrait = orientations[0] === "portrait";

  return (
    <div className="pt-1 grid grid-cols-2 gap-1.5 w-full">
      {visiblePhotos.map((url, idx) => {
        const isFirst = idx === 0;
        const tileSizingClass = firstIsPortrait
          ? isFirst
            ? "row-span-2 h-[262px] sm:h-[326px]"
            : "col-span-1 h-32 sm:h-40"
          : isFirst
          ? "col-span-2 h-40 sm:h-52"
          : "col-span-1 h-32 sm:h-40";

        return (
          <button
            key={idx}
            type="button"
            onClick={() => onPhotoClick && onPhotoClick(url, imageUrls, idx)}
            aria-label={`View attached photo ${idx + 1} of ${imageUrls.length}`}
            className={`group relative w-full rounded-lg overflow-hidden border border-slate-200/90 bg-slate-100/80 hover:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer transition-all shadow-sm flex items-center justify-center ${tileSizingClass}`}
          >
            <img
              src={url}
              alt={`Photo ${idx + 1} attached by ${reviewerName}`}
              onLoad={(e) => handleImageLoad(idx, e)}
              className="w-full h-full object-contain transition-transform duration-200"
              loading="lazy"
            />
            {idx === 2 && extraCount > 0 && (
              <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-base">
                  +{extraCount}
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function CustomerReviewCard({ review, onPhotoClick }) {
  const [helpfulCount, setHelpfulCount] = useState(review?.helpful_count || 0);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [showComments, setShowComments] = useState(Boolean(review?.reply_comment));
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

  if (!review) return null;

  const hasOwnerReply = Boolean(review.reply_comment);

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
    <article className="bg-white rounded-xl border border-slate-200/90 p-3.5 sm:p-4 shadow-sm hover:border-slate-300 transition-all space-y-2.5 sm:space-y-3">
      {/* 1. Header: Circular Avatar, Bold Username on top, Star Rating + Date subline, 3-dots top right */}
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Circular Avatar */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-sm">
            {initials}
          </div>

          {/* User Name & Sub-line (Stars • Date) */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-bold text-[13px] sm:text-sm text-slate-900 leading-tight truncate">
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
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                      starIndex <= review.rating
                        ? "fill-amber-500 text-amber-500"
                        : "fill-slate-200 text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-slate-400 shrink-0" aria-hidden="true">•</span>
              <time
                className="text-[11px] sm:text-xs font-medium text-slate-500 whitespace-nowrap shrink-0"
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
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600"
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
                <Flag className="w-3.5 h-3.5 text-slate-500" />
                <span>Report Review</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Body: Left-aligned text + attached media */}
      <div className="space-y-2">
        <p className="text-[13px] sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line break-words">
          {review.comment}
        </p>

        {/* Facebook-style balanced media container (whole photo visible) */}
        <ReviewMediaGallery
          imageUrls={review.image_urls}
          reviewerName={review.name}
          onPhotoClick={onPhotoClick}
        />
      </div>

      {/* 3. Footer / Actions: Facebook-style 3-button bar (Helpful, Comment, Share) */}
      <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-1 text-xs text-slate-600">
        {/* Helpful / Like Action */}
        <button
          type="button"
          onClick={handleHelpfulClick}
          disabled={isVoting}
          aria-label={`Mark as helpful. Currently ${helpfulCount} helpful votes.`}
          className={`w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-semibold transition-colors min-h-[36px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600 ${
            hasVoted
              ? "text-teal-800 bg-teal-50"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100"
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${hasVoted ? "fill-teal-700 text-teal-700" : "text-slate-500"}`} />
          <span className="truncate">{helpfulCount > 0 ? `Helpful (${helpfulCount})` : "Helpful"}</span>
        </button>

        {/* Comment Action (toggles owner response section) */}
        <button
          type="button"
          onClick={() => setShowComments((prev) => !prev)}
          aria-expanded={showComments}
          className={`w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-semibold transition-colors min-h-[36px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600 ${
            showComments && hasOwnerReply
              ? "text-teal-800 bg-teal-50/70"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100"
          }`}
        >
          <MessageSquare className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${showComments && hasOwnerReply ? "text-teal-700" : "text-slate-500"}`} />
          <span className="truncate">{hasOwnerReply ? "Comment (1)" : "Comment"}</span>
        </button>

        {/* Share Action */}
        <button
          type="button"
          onClick={handleShare}
          className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 transition-colors min-h-[36px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600"
        >
          <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 shrink-0" />
          <span className="truncate">{showCopied ? "Copied!" : "Share"}</span>
        </button>
      </div>

      {/* 4. Owner Comment / Official Business Reply Section */}
      {showComments && (
        hasOwnerReply ? (
          <div className="p-2.5 sm:p-3 rounded-lg bg-teal-50/70 border border-teal-200/90 text-xs text-teal-950 space-y-1">
            <div className="flex items-center justify-between font-semibold text-teal-900 text-[11px] gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <CornerDownRight className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                <span>Owner Response</span>
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
        ) : (
          <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] sm:text-xs text-slate-500 flex items-center gap-1.5">
            <CornerDownRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>No comment from the business owner yet.</span>
          </div>
        )
      )}

      {/* Report Modal Dialog */}
      <ReportReviewModal
        review={review}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </article>
  );
}