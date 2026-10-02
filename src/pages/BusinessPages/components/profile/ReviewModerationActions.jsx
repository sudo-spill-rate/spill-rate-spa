import React, { useState, useEffect, useRef } from "react";
import {
  Pin,
  PinOff,
  Eye,
  EyeOff,
  Trash2,
  RotateCw,
  MoreVertical,
} from "lucide-react";
import { useManageReview } from "../../../../hooks/useManageReview";

export default function ReviewModerationActions({
  review,
  onActionComplete,
  onRequestDelete,
  variant = "bar", // "bar" | "menu"
}) {
  const {
    pinReview,
    unpinReview,
    toggleVisibility,
    isActionLoading,
    activeReviewId,
  } = useManageReview();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  if (!review) return null;

  const isCurrentActionPending =
    isActionLoading && activeReviewId === review.id;

  // Close menu on click outside or escape key
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const handlePinToggle = async () => {
    if (isCurrentActionPending) return;
    setMenuOpen(false);
    if (review.is_pinned) {
      const res = await unpinReview(review.id);
      if (res.success && onActionComplete) {
        onActionComplete("Review unpinned from top of public feed.");
      }
    } else {
      const res = await pinReview(review.id);
      if (res.success && onActionComplete) {
        onActionComplete("Review pinned to top of public feed.");
      }
    }
  };

  const handleVisibilityToggle = async () => {
    if (isCurrentActionPending) return;
    setMenuOpen(false);
    const nextPrivateState = !review.is_private;
    const res = await toggleVisibility(review.id, nextPrivateState);
    if (res.success && onActionComplete) {
      onActionComplete(
        nextPrivateState
          ? "Review hidden from public feed."
          : "Review restored to public feed."
      );
    }
  };

  const handleDeleteClick = () => {
    setMenuOpen(false);
    if (onRequestDelete) {
      onRequestDelete(review);
    }
  };

  // 1. Mobile 3-Dots Dropdown Menu Variant
  if (variant === "menu") {
    return (
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          disabled={isCurrentActionPending}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          aria-label={`Moderation options for review by ${review.name}`}
          className="p-2 -mr-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-600 disabled:opacity-50"
        >
          {isCurrentActionPending ? (
            <RotateCw className="w-4 h-4 animate-spin text-teal-600" />
          ) : (
            <MoreVertical className="w-4 h-4" />
          )}
        </button>

        {menuOpen && (
          <div
            role="menu"
            aria-orientation="vertical"
            className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30 focus:outline-none"
          >
            {/* Pin / Unpin Item */}
            <button
              type="button"
              role="menuitem"
              onClick={handlePinToggle}
              disabled={isCurrentActionPending}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors min-h-[44px] text-left"
            >
              {review.is_pinned ? (
                <>
                  <PinOff className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="text-amber-800">Unpin</span>
                </>
              ) : (
                <>
                  <Pin className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Pin</span>
                </>
              )}
            </button>

            {/* Visibility Item */}
            <button
              type="button"
              role="menuitem"
              onClick={handleVisibilityToggle}
              disabled={isCurrentActionPending}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors min-h-[44px] text-left"
            >
              {review.is_private ? (
                <>
                  <Eye className="w-4 h-4 text-teal-700 shrink-0" />
                  <span className="text-teal-800">Unhide</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Hide</span>
                </>
              )}
            </button>

            <div className="border-t border-slate-100 my-1" />

            {/* Delete Item */}
            <button
              type="button"
              role="menuitem"
              onClick={handleDeleteClick}
              disabled={isCurrentActionPending}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors min-h-[44px] text-left"
            >
              <Trash2 className="w-4 h-4 text-red-600 shrink-0" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // 2. Default Inline Action Bar Variant (Desktop)
  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      {/* 1. Pin / Unpin Button */}
      <button
        type="button"
        onClick={handlePinToggle}
        disabled={isCurrentActionPending}
        title={review.is_pinned ? "Unpin review" : "Pin review to top"}
        aria-label={review.is_pinned ? "Unpin review from top" : "Pin review to top"}
        className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600 disabled:opacity-50 ${
          review.is_pinned
            ? "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100"
            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
        }`}
      >
        {isCurrentActionPending ? (
          <RotateCw className="w-3.5 h-3.5 animate-spin" />
        ) : review.is_pinned ? (
          <PinOff className="w-3.5 h-3.5 text-amber-700 shrink-0" />
        ) : (
          <Pin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        )}
        <span>{review.is_pinned ? "Unpin" : "Pin"}</span>
      </button>

      {/* 2. Visibility Toggle Button */}
      <button
        type="button"
        onClick={handleVisibilityToggle}
        disabled={isCurrentActionPending}
        title={review.is_private ? "Make review public" : "Hide review from public"}
        aria-label={review.is_private ? "Make review visible to public" : "Hide review from public view"}
        className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600 disabled:opacity-50 ${
          review.is_private
            ? "bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200"
            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
        }`}
      >
        {isCurrentActionPending ? (
          <RotateCw className="w-3.5 h-3.5 animate-spin" />
        ) : review.is_private ? (
          <Eye className="w-3.5 h-3.5 text-teal-700 shrink-0" />
        ) : (
          <EyeOff className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        )}
        <span>{review.is_private ? "Unhide" : "Hide"}</span>
      </button>

      {/* 3. Delete Button */}
      <button
        type="button"
        onClick={handleDeleteClick}
        disabled={isCurrentActionPending}
        title="Delete fraudulent review"
        aria-label={`Delete review by ${review.name}`}
        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-red-700 hover:bg-red-50 hover:border-red-200 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50"
      >
        <Trash2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
        <span>Delete</span>
      </button>
    </div>
  );
}