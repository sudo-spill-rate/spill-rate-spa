import React, { useState } from "react";
import { Star, StarHalf } from "lucide-react";

const SIZES = {
  xs: "w-3 h-3",
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-7 h-7 sm:w-8 sm:h-8",
};

const DEFAULT_STAR_LABELS = {
  1: "Poor experience",
  2: "Fair service",
  3: "Good experience",
  4: "Very good",
  5: "Excellent experience",
};

/**
 * StarRating Component
 * 
 * Supports both:
 * 1. Read-only 5-star display (supporting full, half, and empty star fills)
 * 2. Interactive rating picker with keyboard navigation, hover preview, and accessible 44px touch targets
 * 
 * @param {Object} props
 * @param {number} [props.value=0] - Rating value (integer or floating point)
 * @param {number} [props.rating] - Alias for value
 * @param {function} [props.onChange] - Click handler for interactive selection
 * @param {boolean} [props.interactive=false] - Explicitly enables interactive picker mode
 * @param {number} [props.maxStars=5] - Maximum number of stars (default 5)
 * @param {"xs"|"sm"|"md"|"lg"} [props.size="sm"] - Size preset
 * @param {string} [props.starClassName] - Custom classes for individual star SVGs
 * @param {string} [props.className] - Container wrapper classes
 * @param {boolean} [props.disabled=false] - Disable interaction in interactive mode
 * @param {string} [props.error] - Validation error message
 * @param {boolean} [props.showLabel=false] - Display label and rating description
 * @param {Record<number, string>} [props.labels] - Map of star rating value to label text
 * @param {string} [props.ariaLabel] - Accessible label override
 */
export default function StarRating({
  value,
  rating,
  onChange,
  interactive = false,
  maxStars = 5,
  size = "sm",
  starClassName,
  className = "",
  disabled = false,
  error,
  showLabel = false,
  labels = DEFAULT_STAR_LABELS,
  ariaLabel,
}) {
  const currentValue = Number(value ?? rating ?? 0);
  const [hoveredStar, setHoveredStar] = useState(0);

  const isInteractive = interactive || typeof onChange === "function";

  // Prevent 5-star container from being choked to the width/height of a single star
  // if caller accidentally passes icon dimensions (e.g. "w-3.5 h-3.5") into className.
  const classTokens = className.split(/\s+/).filter(Boolean);
  const dimensionClasses = classTokens.filter((c) => /^[wh]-/.test(c));
  const containerClasses = classTokens.filter((c) => !/^[wh]-/.test(c)).join(" ");

  const starClass =
    starClassName ||
    (dimensionClasses.length > 0 ? dimensionClasses.join(" ") : SIZES[size] || SIZES.sm);
  const starList = Array.from({ length: maxStars }, (_, i) => i + 1);

  // 1. Interactive Star Picker Mode
  if (isInteractive) {
    const displayRating = hoveredStar || currentValue;

    return (
      <div className={`space-y-1.5 ${className}`}>
        {showLabel && (
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Your Rating <span className="text-red-600">*</span>
            </label>
            <span className="text-xs sm:text-sm font-semibold text-slate-700">
              {displayRating > 0
                ? labels[displayRating] || `${displayRating} stars`
                : "Select 1 to 5 stars"}
            </span>
          </div>
        )}

        <div
          role="radiogroup"
          aria-label={ariaLabel || "Star rating"}
          aria-invalid={!!error}
          aria-describedby={error ? "star-rating-error" : undefined}
          className="flex items-center justify-between sm:justify-start gap-1 sm:gap-2 pt-0.5"
        >
          {starList.map((star) => {
            const isFilled = star <= displayRating;
            return (
              <button
                key={star}
                type="button"
                role="radio"
                aria-checked={currentValue === star}
                aria-label={`${star} Star${star > 1 ? "s" : ""}: ${labels[star] || ""}`}
                disabled={disabled}
                onClick={() => onChange && onChange(star)}
                onMouseEnter={() => !disabled && setHoveredStar(star)}
                onMouseLeave={() => !disabled && setHoveredStar(0)}
                className="p-2 sm:p-2.5 rounded-lg text-slate-300 hover:text-amber-500 focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Star
                  className={`${starClass} transition-colors ${
                    isFilled
                      ? "fill-amber-500 text-amber-500"
                      : "fill-transparent text-slate-300"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {error && (
          <p id="star-rating-error" className="text-xs text-red-600 mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  // 2. Read-Only Star Display Mode (Supporting Full, Half, and Empty Stars)
  return (
    <div
      className={`inline-flex items-center gap-0.5 shrink-0 ${containerClasses}`}
      role="img"
      aria-label={ariaLabel || `Rating: ${currentValue} out of ${maxStars} stars`}
    >
      {starList.map((pos) => {
        const diff = currentValue - (pos - 1);

        if (diff >= 0.75) {
          // Full Star
          return (
            <Star
              key={pos}
              className={`${starClass} fill-amber-500 text-amber-500 shrink-0`}
              aria-hidden="true"
            />
          );
        } else if (diff >= 0.25) {
          // Half Star: Layer half-filled star over empty star background
          return (
            <div
              key={pos}
              className="relative inline-flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <Star className={`${starClass} fill-slate-100 text-slate-300`} />
              <div className="absolute inset-0 overflow-hidden">
                <StarHalf className={`${starClass} fill-amber-500 text-amber-500`} />
              </div>
            </div>
          );
        } else {
          // Empty Star
          return (
            <Star
              key={pos}
              className={`${starClass} fill-slate-100 text-slate-300 shrink-0`}
              aria-hidden="true"
            />
          );
        }
      })}
    </div>
  );
}

export const StarRatingDisplay = StarRating;
