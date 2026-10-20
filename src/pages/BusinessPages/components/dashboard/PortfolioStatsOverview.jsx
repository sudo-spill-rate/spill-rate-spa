import React from "react";
import { Star, MessageSquare, Building } from "lucide-react";
import StatCard from "../../../../components/common/StatCard";

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
        <StatCard
          title="Total Reviews"
          value={totalReviews.toLocaleString()}
          subtitle={totalReviews === 1 ? "1 evaluation" : `${totalReviews} evaluations`}
          icon={MessageSquare}
        />

        {/* Metric 2: Portfolio Average Score */}
        <StatCard
          title="Rating Average"
          value={averageRating || "—"}
          secondaryValue={
            averageRating ? (
              <span className="inline-flex items-center text-amber-600 text-xs font-semibold ml-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" aria-hidden="true" />
                <span className="ml-0.5 text-slate-400 font-normal text-[11px]">/ 5.0</span>
              </span>
            ) : null
          }
          subtitle={averageRating ? `${ratedBusinesses.length} rated store(s)` : "Awaiting reviews"}
          icon={Star}
        />

        {/* Metric 3: Active Storefronts */}
        <StatCard
          className="col-span-2 sm:col-span-1"
          title="Active Storefronts"
          value={totalBusinesses}
          secondaryValue={<span className="text-xs font-normal text-slate-400 ml-1">/ 5 quota</span>}
          subtitle={
            5 - totalBusinesses > 0
              ? `${5 - totalBusinesses} slot(s) remaining`
              : "Quota reached"
          }
          icon={Building}
          trend={5 - totalBusinesses === 0 ? "Quota Reached" : undefined}
          trendType={5 - totalBusinesses === 0 ? "warning" : "neutral"}
        />
      </div>
    </section>
  );
}
