import React from "react";
import { Star } from "lucide-react";

export default function PublicReviewBreakdown({
  ratingBreakdown,
  totalReviews = 0,
  selectedRating,
  onSelectRating,
}) {
  const breakdown = ratingBreakdown || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const stars = [5, 4, 3, 2, 1];

  return (
    <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900">Rating Breakdown</h2>
        {selectedRating && (
          <button
            type="button"
            onClick={() => onSelectRating(undefined)}
            className="text-xs text-teal-700 hover:text-teal-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 rounded p-1"
          >
            Show All Stars
          </button>
        )}
      </div>

      <div className="space-y-2">
        {stars.map((star) => {
          const count = breakdown[star] || 0;
          const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
          const isSelected = selectedRating === star;

          return (
            <button
              key={star}
              type="button"
              onClick={() => onSelectRating(isSelected ? undefined : star)}
              className={`w-full flex items-center gap-3 p-1.5 rounded-lg text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                isSelected
                  ? "bg-slate-100 font-bold"
                  : "hover:bg-slate-50 text-slate-600"
              }`}
            >
              <div className="flex items-center gap-1 w-14 shrink-0 font-medium text-slate-700">
                <span>{star}</span>
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              </div>

              {/* Progress Track */}
              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="w-12 text-right text-slate-500 font-medium">
                {count}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
