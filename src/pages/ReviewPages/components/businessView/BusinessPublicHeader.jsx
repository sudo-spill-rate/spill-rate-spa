import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
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
  Settings,
  Share2,
} from "lucide-react";
import { useUserAuth } from "../../../../hooks/useUserAuth";
import { useBusiness } from "../../../../context/business/useBusiness";
import ShareStorefrontMenu from "../../../BusinessPages/components/profile/ShareStorefrontMenu";

export default function BusinessPublicHeader({
  business,
  eligibility,
  onWriteReviewClick,
}) {
  const navigate = useNavigate();
  const [coverError, setCoverError] = useState(false);
  const { user, isAuthenticated } = useUserAuth();
  const { businesses: ownerBusinesses } = useBusiness();

  const isOwnerOrFounder =
    (ownerBusinesses || []).some((b) => b.id === business?.id || b.slug === business?.slug) ||
    user?.role === "founder" ||
    user?.role === "admin";

  const manageLink =
    user?.role === "founder" || user?.role === "admin"
      ? `/admin/my-store/${business?.slug}`
      : `/dashboard/business/${business?.slug}`;

  const eligibleEndorsingBiz = (ownerBusinesses || []).find(
    (b) => b.id !== business?.id && b.slug !== business?.slug
  );

  if (!business) return null;

  const rawAvg = business?.rating_breakdown?.average_rating ?? business?.average_rating;
  const hasRating = typeof rawAvg === "number" && rawAvg > 0;
  const reviewCount = business?.rating_breakdown?.total_reviews ?? business?.total_reviews ?? 0;

  const isEligible = eligibility?.canReview ?? eligibility?.eligible ?? true;
  const cooldownHours = eligibility?.remainingHours ?? eligibility?.cooldown_remaining_hours ?? 0;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-white border-b border-slate-200">
      {/* Top Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 lg:gap-8">
          {/* Left: Avatar / Logo + Details */}
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 flex-1 min-w-0">
            {/* Logo / Cover Thumbnail */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
              {business.image_url && !coverError ? (
                <img
                  src={business.image_url}
                  alt={`Logo for ${business.name}`}
                  className="w-full h-full object-cover"
                  onError={() => setCoverError(true)}
                />
              ) : (
                <Building className="w-8 h-8 text-slate-400" />
              )}
            </div>

            {/* Profile Info */}
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight break-words">
                  {business.name}
                </h1>

                {business.is_verified && (
                  <span
                    title="Verified Merchant"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                    <span>Verified</span>
                  </span>
                )}

                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {business.category || "General"}
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Slug: <span className="font-mono text-slate-700 font-medium">/{business.slug}</span>
              </p>

              {/* Star Rating Overview */}
              <div className="flex items-center gap-2 text-xs">
                {hasRating ? (
                  <>
                    <div className="flex items-center text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                      <span>{Number(rawAvg).toFixed(1)}</span>
                    </div>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-slate-600 font-medium">
                      {reviewCount} {reviewCount === 1 ? "community review" : "community reviews"}
                    </span>
                  </>
                ) : (
                  <span className="text-slate-500">
                    No community reviews yet
                  </span>
                )}
              </div>

              {/* Storefront Description */}
              {business.description && (
                <p className="text-xs text-slate-600 leading-relaxed pt-1 whitespace-pre-wrap max-w-2xl">
                  {business.description}
                </p>
              )}

              {/* Contact Meta Details */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 text-xs text-slate-600 border-t border-slate-100">
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
                {business.website ? (
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-700 hover:underline"
                    >
                      {business.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Globe className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    <span>No website registered</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Review Action & Owner Controls */}
          <div className="w-full md:w-auto shrink-0 flex flex-col items-start md:items-end gap-2.5">
            <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
              {/* Share Storefront */}
              <ShareStorefrontMenu
                slug={business.slug}
                businessName={business.name}
                logoUrl={business.image_url}
                isOwner={isOwnerOrFounder}
              />

              {/* Manage link if owner or founder */}
              {isOwnerOrFounder && (
                <Link
                  to={manageLink}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors min-h-[38px] cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  <span>Manage Storefront</span>
                </Link>
              )}

              {/* Public Write Review Button */}
              {isEligible ? (
                <button
                  type="button"
                  onClick={onWriteReviewClick}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs min-h-[38px] focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
                >
                  <PenSquare className="w-3.5 h-3.5" />
                  <span>Write Review</span>
                </button>
              ) : (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2 max-w-sm">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Review Cooldown</p>
                    <p className="text-amber-800 text-[11px] mt-0.5">
                      Cooldown resets in {cooldownHours} {cooldownHours === 1 ? "hour" : "hours"}.
                    </p>
                  </div>
                </div>
              )}

              {/* Endorse B2B button if logged-in business owner */}
              {isAuthenticated && eligibleEndorsingBiz && (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/business/${eligibleEndorsingBiz.slug || eligibleEndorsingBiz.id}/${business.slug || business.id}/write-review`
                    )
                  }
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 hover:bg-slate-50 text-xs font-semibold rounded-lg transition-colors min-h-[38px] focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5 text-teal-700" />
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