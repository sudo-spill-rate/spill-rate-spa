import React from "react";
import { Star, ShieldCheck, MessageSquare } from "lucide-react";
import { useCustomerReviews } from "../../../../hooks/useCustomerReviews";

export default function BusinessRatingStatsCard({ business }) {
  const { reviews = [] } = useCustomerReviews();

  if (!business) return null;

  // Use business aggregated fields if present; otherwise fallback to computing from reviews array
  const totalReviews =
    business.total_reviews !== undefined && business.total_reviews !== null
      ? business.total_reviews
      : reviews.length;

  const avgRating =
    business.average_rating !== undefined && business.average_rating !== null
      ? Number(business.average_rating).toFixed(1)
      : reviews.length > 0
      ? (
          reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  const breakdown = business.rating_breakdown || {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const stars = [5, 4, 3, 2, 1];
  const numAvg = parseFloat(avgRating) || 0;

  return (
    <section
      aria-labelledby="rating-stats-title"
      className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-xs space-y-3"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h2
          id="rating-stats-title"
          className="text-xs font-bold uppercase tracking-wider text-slate-700"
        >
          Rating Statistics
        </h2>
        <span className="text-[11px] font-medium text-slate-500">
          {totalReviews} {totalReviews === 1 ? "review" : "reviews"} recorded
        </span>
      </div>

      {/* Grid: Left Score Overview + Right 5-Star Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6 items-center">
        {/* Left Column: Average Score and Overall Meta */}
        <div className="md:col-span-5 flex items-center md:flex-col md:items-start justify-between md:justify-center md:border-r md:border-slate-100 md:pr-4">
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {avgRating}
            </span>
            <div className="space-y-0.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                      star <= Math.round(numAvg)
                        ? "fill-amber-500 text-amber-500"
                        : "fill-slate-100 text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                Score out of 5.0
              </p>
            </div>
          </div>

          <div className="md:mt-2 text-xs text-slate-600 font-medium">
            <span>
              Total:{" "}
              <strong className="text-slate-900 font-bold font-mono">
                {totalReviews}
              </strong>
            </span>
          </div>
        </div>

        {/* Right Column: 1-5 Star Breakdown Bars */}
        <div className="md:col-span-7 space-y-1">
          {stars.map((star) => {
            const count = breakdown[star] || 0;
            const percentage =
              totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                {/* Star label */}
                <div className="flex items-center gap-1 w-10 shrink-0 font-medium text-slate-700 text-[11px]">
                  <span>{star}</span>
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />
                </div>

                {/* Progress Bar Track */}
                <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${star} star reviews: ${count} (${percentage}%)`}
                  />
                </div>

                {/* Review Count and Percentage */}
                <div className="w-14 text-right shrink-0 text-[10px] sm:text-[11px] font-medium text-slate-500">
                  <span className="font-mono text-slate-800 font-semibold">
                    {count}
                  </span>{" "}
                  ({percentage}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
