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
    <section aria-label="Portfolio metrics overview" className="mb-6 sm:mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Metric 1: Total Customer Reviews */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">
            Total Customer Reviews
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {totalReviews.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {totalReviews === 1 ? "1 authentic evaluation" : `${totalReviews} authentic evaluations across profiles`}
          </p>
        </div>

        {/* Metric 2: Portfolio Average Score */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">
            Portfolio Rating Average
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {averageRating || "—"}
            </span>
            {averageRating && (
              <div className="flex items-center text-amber-600">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" aria-hidden="true" />
                <span className="ml-1 text-xs font-medium text-slate-500">/ 5.0</span>
              </div>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {averageRating ? `Calculated from ${ratedBusinesses.length} rated storefront(s)` : "Awaiting initial customer feedback"}
          </p>
        </div>

        {/* Metric 3: Active Storefronts */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">
            Active Storefronts
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {totalBusinesses}
            <span className="text-sm font-normal text-slate-400 ml-1.5">/ 5 quota</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {5 - totalBusinesses > 0
              ? `${5 - totalBusinesses} additional slot(s) available`
              : "Maximum free quota reached"}
          </p>
        </div>
      </div>
    </section>
  );
}