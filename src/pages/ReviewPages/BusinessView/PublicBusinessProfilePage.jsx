import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Building, ChevronLeft } from "lucide-react";
import BusinessPublicHeader from "../components/businessView/BusinessPublicHeader";
import PublicReviewBreakdown from "../components/businessView/PublicReviewBreakdown";
import PublicReviewFeed from "../components/businessView/PublicReviewFeed";
import ReviewPhotoModal from "../components/businessView/ReviewPhotoModal";
import { businessService } from "../../../services/businessService";
import { reviewService } from "../../../services/reviewService";
import { useDeviceId } from "../../../hooks/useDeviceId";

export default function PublicBusinessProfilePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const deviceId = useDeviceId();

  const [selectedRating, setSelectedRating] = useState(undefined);
  const [activePhotoUrl, setActivePhotoUrl] = useState(null);

  // 1. Fetch Business Profile
  const {
    data: businessResponse,
    isLoading: isBusinessLoading,
    isError: isBusinessError,
    refetch: refetchBusiness,
  } = useQuery({
    queryKey: ["business-profile", slug],
    queryFn: () => businessService.getBusinessBySlug(slug || ""),
    enabled: Boolean(slug),
  });

  const business = businessResponse?.data;

  // 2. Fetch Reviews
  const {
    data: reviewsResponse,
    isLoading: isReviewsLoading,
    isError: isReviewsError,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ["business-reviews", slug, selectedRating],
    queryFn: () =>
      reviewService.getReviews(slug || "", {
        rating: selectedRating,
        limit: 20,
      }),
    enabled: Boolean(slug),
  });

  const reviews = reviewsResponse?.data || [];

  // 3. Check Eligibility / Cooldown
  const { data: eligibilityResponse } = useQuery({
    queryKey: ["review-eligibility", slug, deviceId],
    queryFn: () => reviewService.checkEligibility(slug || "", deviceId),
    enabled: Boolean(slug && deviceId),
  });

  const eligibility = eligibilityResponse?.data;

  const handleWriteReview = () => {
    if (business) {
      navigate(`/business/${business.id}/write-review`);
    }
  };

  // Loading Business Profile State
  if (isBusinessLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12" aria-busy="true">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xs animate-pulse space-y-4">
            <div className="h-8 w-64 bg-slate-200 rounded" />
            <div className="h-4 w-96 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Error or Not Found State
  if (isBusinessError || !business) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl border border-slate-200 shadow-xs text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" aria-hidden="true" />
          <h1 className="text-xl font-bold text-slate-900">Establishment Not Found</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            The business profile you are looking for could not be found or may have been updated.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => refetchBusiness()}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[40px]"
            >
              Retry
            </button>
            <Link
              to="/explore"
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[40px] flex items-center justify-center"
            >
              Back to Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Business Profile Header */}
      <BusinessPublicHeader
        business={business}
        eligibility={eligibility}
        onWriteReviewClick={handleWriteReview}
      />

      {/* Main Reviews & Sidebar Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Main Feed: Customer Reviews (8 cols) */}
          <main className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">
                Community Feedback
                {selectedRating && (
                  <span className="ml-2 text-xs font-normal text-slate-500">
                    (Filtered to {selectedRating}-star reviews)
                  </span>
                )}
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"} displayed
              </span>
            </div>

            <PublicReviewFeed
              reviews={reviews}
              isLoading={isReviewsLoading}
              isError={isReviewsError}
              onRetry={refetchReviews}
              selectedRating={selectedRating}
              onClearFilter={() => setSelectedRating(undefined)}
              onPhotoClick={(url) => setActivePhotoUrl(url)}
            />
          </main>

          {/* Sidebar: Breakdown & Details (4 cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Rating Breakdown */}
            <PublicReviewBreakdown
              ratingBreakdown={business.rating_breakdown}
              totalReviews={business.total_reviews}
              selectedRating={selectedRating}
              onSelectRating={(r) => setSelectedRating(r)}
            />

            {/* About Establishment Card */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Building className="w-4 h-4 text-teal-700" />
                <h3>About This Business</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {business.description ||
                  "Verified local establishment registered on the TrustRate community directory."}
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Enlarged Photo Modal */}
      {activePhotoUrl && (
        <ReviewPhotoModal
          imageUrl={activePhotoUrl}
          onClose={() => setActivePhotoUrl(null)}
        />
      )}
    </div>
  );
}