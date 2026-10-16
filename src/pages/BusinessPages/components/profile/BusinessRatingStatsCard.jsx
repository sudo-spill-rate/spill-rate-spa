import React, { useEffect, useState } from "react";
import { Star, StarHalf, ShieldCheck, MessageSquare, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { useCustomerReviews } from "../../../../hooks/useCustomerReviews";
import { useBusinessProfile } from "../../../../hooks/useBusinessProfile";

/**
 * Helper to render 5 stars supporting full, half, and empty star fills.
 */
function StarRatingDisplay({ rating, className = "w-4 h-4" }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-0.5" aria-hidden="true">
      {stars.map((pos) => {
        const diff = rating - (pos - 1);

        if (diff >= 0.75) {
          // Full star
          return (
            <Star
              key={pos}
              className={`${className} fill-amber-500 text-amber-500`}
            />
          );
        } else if (diff >= 0.25) {
          // Half star: layer half-filled star over empty star background
          return (
            <div key={pos} className="relative inline-flex items-center justify-center">
              <Star className={`${className} fill-slate-100 text-slate-300`} />
              <div className="absolute inset-0 overflow-hidden">
                <StarHalf className={`${className} fill-amber-500 text-amber-500`} />
              </div>
            </div>
          );
        } else {
          // Empty star
          return (
            <Star
              key={pos}
              className={`${className} fill-slate-100 text-slate-300`}
            />
          );
        }
      })}
    </div>
  );
}

export default function BusinessRatingStatsCard({
  business,
  selectedRating,
  onSelectRating,
  showResponseMetrics = false,
  title = "Ratings Breakdown",
}) {
  const { reviews = [] } = useCustomerReviews();
  const { getAnalytics } = useBusinessProfile();

  const [analytics, setAnalytics] = useState(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  useEffect(() => {
    if (!business?.id) return;
    let isMounted = true;
    const fetchStats = async () => {
      setIsLoadingAnalytics(true);
      try {
        const res = await getAnalytics(business.id);
        if (isMounted && res.success && res.data) {
          setAnalytics(res.data);
        }
      } catch (err) {
        console.error("Failed to load business analytics:", err);
      } finally {
        if (isMounted) setIsLoadingAnalytics(false);
      }
    };
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [business?.id, getAnalytics]);

  if (!business) return null;

  // Use pre-computed analytics summary if available; fallback to props/reviews
  const totalReviews =
    analytics?.summary?.total_reviews ??
    (business.total_reviews !== undefined && business.total_reviews !== null
      ? business.total_reviews
      : reviews.length);

  const avgRating =
    analytics?.summary?.average_rating !== undefined
      ? Number(analytics.summary.average_rating).toFixed(1)
      : business.average_rating !== undefined && business.average_rating !== null
      ? Number(business.average_rating).toFixed(1)
      : reviews.length > 0
      ? (
          reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  const breakdown = {
    5: analytics?.rating_distribution?.[5]?.count ?? business.rating_breakdown?.[5] ?? reviews.filter((r) => r.rating === 5).length,
    4: analytics?.rating_distribution?.[4]?.count ?? business.rating_breakdown?.[4] ?? reviews.filter((r) => r.rating === 4).length,
    3: analytics?.rating_distribution?.[3]?.count ?? business.rating_breakdown?.[3] ?? reviews.filter((r) => r.rating === 3).length,
    2: analytics?.rating_distribution?.[2]?.count ?? business.rating_breakdown?.[2] ?? reviews.filter((r) => r.rating === 2).length,
    1: analytics?.rating_distribution?.[1]?.count ?? business.rating_breakdown?.[1] ?? reviews.filter((r) => r.rating === 1).length,
  };

  const stars = [5, 4, 3, 2, 1];
  const numAvg = parseFloat(avgRating) || 0;
  const recentCount = analytics?.summary?.last_30_days_count ?? 0;

  const responseMetrics = analytics?.response_metrics || {
    response_rate_percent: 0,
    replied_count: 0,
    pending_reply_count: 0,
  };

  return (
    <section
      aria-labelledby="rating-stats-title"
      className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-xs space-y-3"
    >
      {/* Header: Title and Monthly Trend badge (if any) */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
        <h2
          id="rating-stats-title"
          className="text-xs font-bold uppercase tracking-wider text-slate-700"
        >
          {title}
        </h2>
        {recentCount > 0 && (
          <span className="text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60 text-[10px] sm:text-[11px]">
            +{recentCount} new this month
          </span>
        )}
      </div>

      {/* Main Grid: Left Score Overview + Right 5-Star Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4 items-center">
        {/* Left Column: Average Score and Single Clear Review Counter */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col sm:flex-row sm:items-center md:flex-col md:items-start justify-between gap-2 pb-2.5 md:pb-0 border-b md:border-b-0 md:border-r md:border-slate-100 md:pr-3.5">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none tabular-nums">
              {avgRating}
            </span>
            <div className="space-y-0.5">
              <StarRatingDisplay rating={numAvg} className="w-3.5 h-3.5" />
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                {totalReviews > 0
                  ? `Based on ${totalReviews} ${totalReviews === 1 ? "review" : "reviews"}`
                  : "No reviews yet"}
              </p>
            </div>
          </div>

          {selectedRating && (
            <button
              type="button"
              onClick={() => onSelectRating && onSelectRating(undefined)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded border border-teal-200/60 transition-colors self-start cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <span>Showing {selectedRating}★ only</span>
              <span className="text-teal-700 font-bold ml-0.5">✕</span>
            </button>
          )}
        </div>

        {/* Right Column: 1-5 Star Breakdown Bars */}
        <div className="md:col-span-7 lg:col-span-8 space-y-1">
          {stars.map((star) => {
            const count = breakdown[star] || 0;
            const percentage =
              analytics?.rating_distribution?.[star]?.percentage !== undefined
                ? Math.round(analytics.rating_distribution[star].percentage)
                : totalReviews > 0
                ? Math.round((count / totalReviews) * 100)
                : 0;

            const isSelected = selectedRating === star;
            const isEmpty = count === 0;

            return (
              <button
                key={star}
                type="button"
                onClick={() => onSelectRating && onSelectRating(isSelected ? undefined : star)}
                aria-pressed={isSelected}
                className={`w-full grid grid-cols-[auto_1fr_auto] items-center gap-2 text-xs transition-colors rounded-md px-1.5 py-0.5 min-h-[26px] sm:min-h-[28px] text-left focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                  onSelectRating ? "cursor-pointer hover:bg-slate-50 active:bg-slate-100" : ""
                } ${isSelected ? "bg-amber-50/90 ring-1 ring-amber-300 font-semibold" : ""} ${
                  isEmpty ? "opacity-60" : "opacity-100"
                }`}
              >
                {/* Left: Star label and icon */}
                <div className="flex items-center gap-1 w-8 shrink-0 font-medium text-slate-700 text-xs">
                  <span className="tabular-nums font-semibold">{star}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" aria-hidden="true" />
                </div>

                {/* Center: Progress Bar Track */}
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

                {/* Right: Count and Percentage */}
                <div className="text-right shrink-0 text-[11px] text-slate-500 tabular-nums min-w-[50px]">
                  <span className="font-semibold text-slate-800">
                    {count}
                  </span>{" "}
                  <span className="text-slate-400">({percentage}%)</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Response Metrics & Monthly Trends (Only if enabled, e.g. for merchant management) */}
      {showResponseMetrics && (
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Response Rate</span>
            <span className="text-sm font-bold text-slate-900">
              {responseMetrics.response_rate_percent}%
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Replied Reviews</span>
            <span className="text-sm font-bold text-teal-700">
              {responseMetrics.replied_count}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-500 block">Awaiting Response</span>
            <span className="text-sm font-bold text-amber-700">
              {responseMetrics.pending_reply_count}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
