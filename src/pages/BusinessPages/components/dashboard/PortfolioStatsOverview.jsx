import React from "react";
import { Star } from "lucide-react";

export default function PortfolioStatsOverview({ businesses = [] }) {
  const totalBusinesses = businesses.length;

  const totalReviews = businesses.reduce((acc, b) => {
    const count = b.rating_breakdown?.total_reviews ?? b.total_reviews ?? 0;
    return acc + (typeof count === "number" ? count : 0);
  }, 0);

  // Compute honest portfolio-wide average rating
  const ratedBusinesses = businesses.filter((b) => {
    const avg = b.rating_breakdown?.average_rating ?? b.average_rating;
    return typeof avg === "number" && avg > 0;
  });

  const averageRating =
    ratedBusinesses.length > 0
      ? (
          ratedBusinesses.reduce((acc, b) => {
            const avg = b.rating_breakdown?.average_rating ?? b.average_rating ?? 0;
            return acc + avg;
          }, 0) / ratedBusinesses.length
        ).toFixed(1)
      : null;

  return (
    <section aria-label="Portfolio metrics overview" className="mb-4 sm:mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
        {/* Metric 1: Total Customer Reviews */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 mb-0.5 truncate">
              Total Reviews
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight tabular-nums">
              {totalReviews.toLocaleString()}
            </div>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 line-clamp-1">
            {totalReviews === 1 ? "1 evaluation" : `${totalReviews} evaluations`}
          </p>
        </div>

        {/* Metric 2: Portfolio Average Score */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 mb-0.5 truncate">
              Rating Average
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight tabular-nums">
                {averageRating || "—"}
              </span>
              {averageRating && (
                <div className="flex items-center text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" aria-hidden="true" />
                  <span className="ml-0.5 text-[11px] font-medium text-slate-400">/ 5.0</span>
                </div>
              )}
            </div>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 line-clamp-1">
            {averageRating ? `${ratedBusinesses.length} rated store(s)` : "Awaiting reviews"}
          </p>
        </div>

        {/* Metric 3: Active Storefronts (Spans 2 cols on smallest mobile screens for balanced grid) */}
        <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 mb-0.5 truncate">
              Active Storefronts
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight tabular-nums">
              {totalBusinesses}
              <span className="text-xs font-normal text-slate-400 ml-1">/ 5 quota</span>
            </div>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 line-clamp-1">
            {5 - totalBusinesses > 0
              ? `${5 - totalBusinesses} slot(s) remaining`
              : "Quota reached"}
          </p>
        </div>
      </div>
    </section>
  );
}