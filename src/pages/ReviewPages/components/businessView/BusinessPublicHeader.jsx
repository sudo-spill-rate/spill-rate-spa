import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Star,
  MapPin,
  Phone,
  Globe,
  CheckCircle2,
  Building,
  PenSquare,
  Clock,
  ChevronLeft,
  Briefcase,
} from "lucide-react";
import { useUserAuth } from "../../../../hooks/useUserAuth";
import { useBusiness } from "../../../../context/business/useBusiness";

export default function BusinessPublicHeader({
  business,
  eligibility,
  onWriteReviewClick,
}) {
  const navigate = useNavigate();
  const [coverError, setCoverError] = useState(false);
  const { isAuthenticated } = useUserAuth();
  const { businesses: ownerBusinesses } = useBusiness();

  const eligibleEndorsingBiz = (ownerBusinesses || []).find(
    (b) => b.id !== business?.id && b.slug !== business?.slug
  );

  if (!business) return null;

  const rawAvg = business?.rating_breakdown?.average_rating ?? business?.average_rating;
  const hasRating = typeof rawAvg === "number" && rawAvg > 0;
  const reviewCount = business?.rating_breakdown?.total_reviews ?? business?.total_reviews ?? 0;

  const isEligible = eligibility?.eligible ?? true;
  const cooldownHours = eligibility?.cooldown_remaining_hours ?? 0;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-white border-b border-slate-200">
      {/* Top Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded p-1 cursor-pointer min-h-[36px]"
          aria-label="Back to previous page"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Directory</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 lg:gap-8">
          {/* Left: Avatar / Cover + Details */}
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Logo / Cover Thumbnail */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
              {business.image_url && !coverError ? (
                <img
                  src={business.image_url}
                  alt={`Logo for ${business.name}`}
                  className="w-full h-full object-cover"
                  onError={() => setCoverError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Building className="w-10 h-10" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {business.category || "General"}
                </span>

                {business.is_verified && (
                  <span
                    title="Verified Merchant"
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                    <span>Verified Merchant</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {business.name}
              </h1>

              {/* Star Rating Overview */}
              <div className="flex items-center gap-2 text-sm">
                {hasRating ? (
                  <>
                    <div className="flex items-center text-amber-600 font-bold">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500 mr-1" />
                      <span>{Number(rawAvg).toFixed(1)}</span>
                    </div>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600 font-medium">
                      {reviewCount} {reviewCount === 1 ? "community review" : "community reviews"}
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-slate-500">
                    No community reviews yet
                  </span>
                )}
              </div>

              {/* Contact Meta Details */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs text-slate-600">
                {business.address && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{business.address}</span>
                  </div>
                )}
                {business.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{business.phone}</span>
                  </div>
                )}
                {business.website && (
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-700 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Review Action & Anti-Spam Indicator */}
          <div className="w-full md:w-auto shrink-0 flex flex-col items-start md:items-end gap-2.5">
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch md:items-center gap-2">
              {isEligible ? (
                <button
                  type="button"
                  onClick={onWriteReviewClick}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-semibold text-sm rounded-lg transition-colors shadow-xs min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
                >
                  <PenSquare className="w-4 h-4" />
                  <span>Tell Your Experience</span>
                </button>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2 max-w-sm">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Review Cooldown Active</p>
                    <p className="text-amber-800 mt-0.5">
                      Your device recently reviewed this establishment. Cooldown resets in {cooldownHours} {cooldownHours === 1 ? "hour" : "hours"}.
                    </p>
                  </div>
                </div>
              )}

              {isAuthenticated && eligibleEndorsingBiz && (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/business/${eligibleEndorsingBiz.slug || eligibleEndorsingBiz.id}/${business.slug || business.id}/write-review`
                    )
                  }
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 hover:bg-slate-50 text-xs sm:text-sm font-semibold rounded-lg transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-teal-700" />
                  <span>Endorse as {eligibleEndorsingBiz.name}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}