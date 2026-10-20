import { useEffect, useState, useContext } from "react";
import { Star, StarHalf } from "lucide-react";
import { ReviewContext } from "../../../../context/review/reviewContext";
import { useBusinessProfile } from "../../../../hooks/useBusinessProfile";
import { useUserAuth } from "../../../../hooks/useUserAuth";
import StarRating, { StarRatingDisplay } from "../../../../components/common/StarRating";

export default function BusinessRatingStatsCard({
  business,
  reviews: propReviews,
  selectedRating,
  onSelectRating,
  showResponseMetrics = false,
  title = "Ratings Breakdown",
}) {
  const reviewContext = useContext(ReviewContext);
  const contextReviews = reviewContext?.reviews || [];
  const reviews = propReviews ?? contextReviews;
  const { getAnalytics } = useBusinessProfile();
  const { isAuthenticated } = useUserAuth();

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    // Analytics endpoint (/api/business/:id/analytics) requires authentication
    // On public customer view, skip fetching analytics to prevent 401 Unauthorized errors
    if (!business?.id || !isAuthenticated) return;

    let isMounted = true;
    const fetchStats = async () => {
      try {
        const res = await getAnalytics(business.id);
        if (isMounted && res.success && res.data) {
          setAnalytics(res.data);
        }
      } catch {
        // Silently catch 401 or network errors for non-owners
      }
    };
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [business?.id, isAuthenticated, getAnalytics]);

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
      className="bg-white rounded-xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs space-y-3"
    >
      {/* Header Row: Title on Left | Review Count or Active Filter Pill on Right */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <h2
            id="rating-stats-title"
            className="text-sm font-bold text-slate-900 tracking-tight truncate"
          >
            {title}
          </h2>
          {recentCount > 0 && (
            <span className="text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60 text-[11px] shrink-0">
              +{recentCount} new
            </span>
          )}
        </div>

        {selectedRating ? (
          <button
            type="button"
            onClick={() => onSelectRating && onSelectRating(undefined)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-md border border-teal-200/80 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600 shrink-0"
          >
            <span>{selectedRating}★ only</span>
            <span className="text-teal-700 font-bold ml-0.5" aria-hidden="true">✕</span>
          </button>
        ) : (
          <span className="text-xs text-slate-600 font-medium tabular-nums shrink-0">
            {totalReviews > 0
              ? `Based on ${totalReviews} ${totalReviews === 1 ? "review" : "reviews"}`
              : "No reviews yet"}
          </span>
        )}
      </div>

      {/* Main Body: Side-by-Side Score Tile (Left) & 5-Star Breakdown Bars (Right) — Zero Wasted Whitespace */}
      <div className="flex items-stretch gap-3 sm:gap-4">
        {/* Left Column: Overall Rating Score Box */}
        <div className="w-28 sm:w-32 shrink-0 flex flex-col items-center justify-center rounded-xl bg-slate-50/90 border border-slate-200/80 p-2.5 text-center">
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-none tabular-nums">
            {avgRating}
          </span>
          <div className="mt-1.5 flex items-center justify-center w-full">
            <StarRatingDisplay
              rating={numAvg}
              size="xs"
              starClassName="w-3 h-3 sm:w-3.5 sm:h-3.5"
            />
          </div>
          <span className="mt-1 text-[11px] font-semibold text-slate-600 tabular-nums">
            out of 5.0
          </span>
        </div>

        {/* Right Column: 1-5 Star Breakdown Bars */}
        <div className="flex-1 min-w-0 flex flex-col justify-between gap-1">
          {stars.map((star) => {
            const count = breakdown[star] || 0;
            const percentage =
              analytics?.rating_distribution?.[star]?.percentage !== undefined
                ? Math.round(analytics.rating_distribution[star].percentage)
                : totalReviews > 0
                ? Math.round((count / totalReviews) * 100)
                : 0;

            const isSelected = selectedRating === star;

            return (
              <button
                key={star}
                type="button"
                onClick={() => onSelectRating && onSelectRating(isSelected ? undefined : star)}
                aria-pressed={isSelected}
                className={`w-full flex items-center gap-2 text-xs transition-colors rounded-lg px-2 py-1 min-h-[28px] text-left focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                  onSelectRating ? "cursor-pointer hover:bg-slate-50 active:bg-slate-100" : ""
                } ${isSelected ? "bg-amber-50/90 ring-1 ring-amber-300 font-semibold" : ""}`}
              >
                {/* Left: Star number + star icon */}
                <div className="flex items-center gap-1 w-7 min-w-[28px] shrink-0 font-medium text-slate-800 text-xs">
                  <span className="tabular-nums font-semibold">{star}</span>
                  <Star className="w-3 h-3 fill-amber-500 text-amber-600 shrink-0" aria-hidden="true" />
                </div>

                {/* Center: Progress Bar Track */}
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
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
                <div className="text-right shrink-0 text-xs text-slate-600 tabular-nums min-w-[54px]">
                  <span className="font-semibold text-slate-900">
                    {count}
                  </span>{" "}
                  <span className="text-slate-600 text-[11px]">({percentage}%)</span>
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
