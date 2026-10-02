import React, { useState } from "react";
import { Star } from "lucide-react";

const STAR_LABELS = {
  1: "Poor experience",
  2: "Fair service",
  3: "Good experience",
  4: "Very good",
  5: "Excellent experience",
};

export default function InteractiveStarPicker({
  value = 0,
  onChange,
  disabled = false,
  error,
}) {
  const [hoveredStar, setHoveredStar] = useState(0);

  const displayRating = hoveredStar || value;

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
        Your Rating <span className="text-red-600">*</span>
      </label>

      <div
        role="radiogroup"
        aria-label="Star rating"
        className="flex items-center gap-1 sm:gap-2"
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayRating;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${star} Star${star > 1 ? "s" : ""}: ${STAR_LABELS[star]}`}
              disabled={disabled}
              onClick={() => onChange(star)}
              onMouseEnter={() => !disabled && setHoveredStar(star)}
              onMouseLeave={() => !disabled && setHoveredStar(0)}
              className="p-2 sm:p-2.5 rounded-lg text-slate-300 hover:text-amber-500 focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Star
                className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                  isFilled
                    ? "fill-amber-500 text-amber-500"
                    : "text-slate-300"
                }`}
              />
            </button>
          );
        })}

        {/* Selected Label feedback */}
        <span className="ml-3 text-xs sm:text-sm font-semibold text-slate-700 min-h-[20px]">
          {displayRating > 0 ? STAR_LABELS[displayRating] : "Select 1 to 5 stars"}
        </span>
      </div>

      {error && (
        <p className="text-xs text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}