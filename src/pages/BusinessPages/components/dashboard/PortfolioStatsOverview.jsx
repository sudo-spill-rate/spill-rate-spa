import React from "react";
import { Building, MessageSquare, Star, ShieldCheck } from "lucide-react";

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

  const verifiedCount = businesses.filter((b) => b.is_verified).length;

  const stats = [
    {
      id: "profiles",
      label: "Registered Profiles",
      mobileLabel: "Profiles",
      value: `${totalBusinesses} / 5`,
      subtext: "Free allocation",
      icon: Building,
      iconColor: "text-slate-700 bg-slate-100",
    },
    {
      id: "reviews",
      label: "Total Customer Reviews",
      mobileLabel: "Reviews",
      value: totalReviews.toLocaleString(),
      subtext: totalReviews === 1 ? "1 authentic review" : `${totalReviews} authentic reviews`,
      icon: MessageSquare,
      iconColor: "text-teal-700 bg-teal-50",
    },
    {
      id: "rating",
      label: "Portfolio Average",
      mobileLabel: "Avg Rating",
      value: averageRating ? `${averageRating} / 5.0` : "Unrated",
      subtext: averageRating ? `Across ${ratedBusinesses.length} profile(s)` : "Awaiting feedback",
      icon: Star,
      iconColor: "text-amber-700 bg-amber-50",
    },
    {
      id: "verified",
      label: "Verified Businesses",
      mobileLabel: "Verified",
      value: `${verifiedCount} / ${totalBusinesses || 0}`,
      subtext: "Identity verified",
      icon: ShieldCheck,
      iconColor: "text-teal-700 bg-teal-50",
    },
  ];

  return (
    <section aria-label="Portfolio performance metrics" className="mb-4 sm:mb-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="bg-white rounded-lg sm:rounded-xl border border-slate-200 p-2.5 sm:p-5 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-1 sm:gap-2 mb-1.5 sm:mb-3">
                <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
                  <span className="sm:hidden">{stat.mobileLabel}</span>
                  <span className="hidden sm:inline">{stat.label}</span>
                </span>
                <div
                  className={`w-6 h-6 sm:w-9 sm:h-9 rounded-md sm:rounded-lg flex items-center justify-center shrink-0 ${stat.iconColor}`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div>
                <div className="text-base sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
                  {stat.value}
                </div>
                <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-xs text-slate-500 truncate sm:line-clamp-none">
                  {stat.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}