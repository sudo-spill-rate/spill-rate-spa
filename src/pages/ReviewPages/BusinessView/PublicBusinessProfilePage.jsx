import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  CheckCircle2,
  Building,
  MapPin,
  Phone,
  Globe,
  Edit3,
  Trash2,
  PenSquare,
  Clock,
  AlertCircle,
  Star,
  MessageSquare,
} from "lucide-react";
import PublicNavbar from "../../PublicPages/components/layout/PublicNavbar";
import PublicFooter from "../../PublicPages/components/layout/PublicFooter";
import BusinessRatingStatsCard from "../../BusinessPages/components/profile/BusinessRatingStatsCard";
import ReviewModerationHub from "../../BusinessPages/components/profile/ReviewModerationHub";
import ShareStorefrontMenu from "../../BusinessPages/components/profile/ShareStorefrontMenu";
import { DeleteBusinessModal } from "../../BusinessPages/components/profile/BusinessActionModals";
import WriteCustomerReviewModal from "../components/submit/WriteCustomerReviewModal";
import PublicReviewFeed from "../components/businessView/PublicReviewFeed";
import ReviewPhotoModal from "../components/businessView/ReviewPhotoModal";
import { businessService } from "../../../services/businessService";
import { reviewService } from "../../../services/reviewService";
import { useDeviceId } from "../../../hooks/useDeviceId";
import { useUserAuth } from "../../../hooks/useUserAuth";
import { useBusiness } from "../../../context/business/useBusiness";
import { ManageReviewProvider } from "../../../context/manageReview/manageReviewContextProvider";

export default function PublicBusinessProfilePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const deviceId = useDeviceId();
  const { user, isAuthenticated } = useUserAuth();
  const { businesses: ownerBusinesses, deleteBusiness, isDeleting } = useBusiness();

  const [imageError, setImageError] = useState(false);
  const [activePhotoUrl, setActivePhotoUrl] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState("reviews"); // "reviews" | "analytics"

  // Auto-open modal if ?writeReview=true is in URL
  useEffect(() => {
    if (searchParams.get("writeReview") === "true") {
      setIsWriteReviewModalOpen(true);
    }
  }, [searchParams]);

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

  // 2. Fetch Reviews (for public customer feed - chronological, unbiased)
  const {
    data: reviewsResponse,
    isLoading: isReviewsLoading,
    isError: isReviewsError,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ["business-reviews", slug],
    queryFn: () =>
      reviewService.getReviews(slug || "", {
        limit: 50,
      }),
    enabled: Boolean(slug),
  });

  const rawReviews = reviewsResponse?.data || [];
  const reviews = React.useMemo(() => {
    return [...rawReviews].sort((a, b) => {
      if (b.is_pinned !== a.is_pinned) {
        return (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0);
      }
      return (
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime()
      );
    });
  }, [rawReviews]);

  // 3. Check Eligibility / Cooldown
  const { data: eligibilityResponse } = useQuery({
    queryKey: ["review-eligibility", slug, deviceId],
    queryFn: () => reviewService.checkEligibility(slug || "", deviceId),
    enabled: Boolean(slug && deviceId),
  });

  const eligibility = eligibilityResponse?.data;
  const isEligible = eligibility?.canReview ?? eligibility?.eligible ?? true;
  const cooldownHours = eligibility?.remainingHours ?? eligibility?.cooldown_remaining_hours ?? 0;

  const isOwnerOrFounder =
    (ownerBusinesses || []).some((b) => b.id === business?.id || b.slug === business?.slug) ||
    user?.role === "founder" ||
    user?.role === "admin";

  const manageLink =
    user?.role === "founder" || user?.role === "admin"
      ? `/admin/my-store/${business?.slug}`
      : `/dashboard/business/${business?.slug}`;

  const handleBack = () => {
    navigate(-1);
  };

  const handleWriteReview = () => {
    setIsWriteReviewModalOpen(true);
  };

  const handleCloseWriteReview = () => {
    setIsWriteReviewModalOpen(false);
    if (searchParams.get("writeReview") === "true") {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("writeReview");
      setSearchParams(nextParams, { replace: true });
    }
  };

  const handleReviewSuccess = () => {
    refetchReviews();
    refetchBusiness();
  };

  const handleDelete = async (bizId) => {
    const res = await deleteBusiness(bizId);
    if (res.success) {
      if (user?.role === "founder" || user?.role === "admin") {
        navigate("/admin/my-store");
      } else {
        navigate("/dashboard");
      }
    }
    return res;
  };

  // Loading Business Profile State
  if (isBusinessLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col" aria-busy="true">
        <PublicNavbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2.5 sm:pt-4 pb-6 sm:pb-8 space-y-2.5 sm:space-y-3">
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse space-y-4">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 bg-slate-200 rounded-xl" />
              <div className="space-y-2 flex-1">
                <div className="h-6 w-56 bg-slate-200 rounded" />
                <div className="h-4 w-32 bg-slate-100 rounded" />
              </div>
            </div>
          </div>
          <div className="h-48 bg-white rounded-xl border border-slate-200 animate-pulse" />
        </main>
        <PublicFooter />
      </div>
    );
  }

  // Error or Not Found State
  if (isBusinessError || !business) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <PublicNavbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
          <div className="max-w-md w-full bg-white p-8 rounded-xl border border-slate-200 shadow-xs text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" aria-hidden="true" />
            <h1 className="text-xl font-bold text-slate-900">Establishment Not Found</h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              The business profile you are looking for could not be found or may have been updated.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => refetchBusiness()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[38px] cursor-pointer"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[38px] flex items-center justify-center cursor-pointer"
              >
                Back to Directory
              </button>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2.5 sm:pt-4 pb-6 sm:pb-8 space-y-2.5 sm:space-y-3">
        {/* 1. Breadcrumb / Back Link */}
        <div>
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded py-1 px-1 min-h-[32px] cursor-pointer"
            aria-label="Back to previous page"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Directory</span>
          </button>
        </div>

        {/* 2. Single Consolidated Storefront Business Card */}
        <div className="relative bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          {/* Top Section: Logo, Name, Badges, and Top-Right Action Row (Owner controls & Share icon) */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5 sm:gap-4 flex-1 min-w-0 pr-2">
              {/* Storefront Logo (Only if business uploaded a logo) */}
              {business.image_url && !imageError && (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    src={business.image_url}
                    alt={`Logo of ${business.name}`}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                </div>
              )}

              {/* Name and Metadata Chips (Verified, Category, and Cooldown Status) */}
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight break-words">
                  {business.name}
                </h1>

                {/* Metadata Chips: Verified, Category, Cooldown Status */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mt-1.5">
                  {business.is_verified && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/80">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Verified</span>
                    </span>
                  )}
                  {business.category && (
                    <span className="inline-flex items-center text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200/80">
                      {business.category}
                    </span>
                  )}
                  {!isEligible && (
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200/80"
                      title={`You recently reviewed this business. You can submit another review in ${cooldownHours} hours.`}
                    >
                      <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                      <span>Reviewed ({cooldownHours}h wait)</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Top-Right Corner Controls: Owner Actions (if any) and Icon-only Share Button */}
            <div className="flex items-center gap-1.5 shrink-0 self-start">
              {isOwnerOrFounder && (
                <>
                  <Link
                    to={manageLink}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                    title="Edit Storefront Profile"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
                    <span className="hidden sm:inline">Edit</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors cursor-pointer shadow-2xs"
                    title="Delete Storefront"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" aria-hidden="true" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </>
              )}

              {/* Upper-Right Icon-Only Share Button */}
              <ShareStorefrontMenu
                slug={business.slug}
                businessName={business.name}
                logoUrl={business.image_url}
                isOwner={isOwnerOrFounder}
                iconOnly={true}
              />
            </div>
          </div>

          {/* Full-Width Primary Action: Write a Review Button */}
          {isEligible && (
            <div className="pt-0.5">
              <button
                type="button"
                onClick={handleWriteReview}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm text-white bg-teal-700 hover:bg-teal-800 active:bg-teal-900 transition-colors shadow-xs min-h-[42px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <PenSquare className="w-4 h-4" aria-hidden="true" />
                <span>Write a Review</span>
              </button>
            </div>
          )}

          {/* Grouped Content: Short Description & Contact Alignment */}
          {(business.description || business.address || business.phone || business.website) && (
            <div className="space-y-3 pt-1">
              {business.description && (
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap break-words">
                  {business.description}
                </p>
              )}

              {(business.address || business.phone || business.website) && (
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-600 pt-1">
                  {business.address && (
                    <div className="inline-flex items-center gap-2 min-w-0">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                      <span className="truncate">{business.address}</span>
                    </div>
                  )}

                  {business.phone && (
                    <a
                      href={`tel:${business.phone}`}
                      className="inline-flex items-center gap-2 min-w-0 text-slate-700 hover:text-teal-700 transition-colors focus:outline-none focus:underline"
                    >
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                      <span className="font-medium">{business.phone}</span>
                    </a>
                  )}

                  {business.website && (
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-800 hover:underline min-w-0 truncate"
                    >
                      <Globe className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                      <span className="truncate">{business.website.replace(/^https?:\/\//, "")}</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. Top Tab Switcher (Visible on mobile screens < md) */}
        <div className="md:hidden flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setMobileTab("reviews")}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all min-h-[42px] cursor-pointer ${
              mobileTab === "reviews"
                ? "bg-white text-slate-900 shadow-2xs font-bold border border-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-teal-700 shrink-0" />
            <span>Reviews</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("analytics")}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all min-h-[42px] cursor-pointer ${
              mobileTab === "analytics"
                ? "bg-white text-slate-900 shadow-2xs font-bold border border-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
            }`}
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
            <span>Ratings</span>
          </button>
        </div>

        {/* 4. Rating Statistics & Performance Summary */}
        <div className={`${mobileTab === "analytics" ? "block" : "hidden md:block"}`}>
          <BusinessRatingStatsCard
            business={business}
            showResponseMetrics={false}
            title="Ratings Breakdown"
          />
        </div>

        {/* 5. Customer Reviews & Moderation Feed */}
        <div className={`${mobileTab === "reviews" ? "block" : "hidden md:block"}`}>
          {isOwnerOrFounder ? (
            <ManageReviewProvider>
              <ReviewModerationHub
                businessId={business.id}
                businessSlug={business.slug}
              />
            </ManageReviewProvider>
          ) : (
            <div className="space-y-3.5">
              {/* Public Reviews List */}
              <PublicReviewFeed
                reviews={reviews}
                isLoading={isReviewsLoading}
                isError={isReviewsError}
                onRetry={refetchReviews}
                onPhotoClick={(url) => setActivePhotoUrl(url)}
              />
            </div>
          )}
        </div>

        {/* Write Customer Review Modal Popup */}
        <WriteCustomerReviewModal
          isOpen={isWriteReviewModalOpen}
          onClose={handleCloseWriteReview}
          business={business}
          eligibility={eligibility}
          onSuccess={handleReviewSuccess}
        />

        {/* Enlarged Photo Modal */}
        {activePhotoUrl && (
          <ReviewPhotoModal
            imageUrl={activePhotoUrl}
            onClose={() => setActivePhotoUrl(null)}
          />
        )}

        {/* Delete Business Confirmation Modal (if owner/founder) */}
        {isOwnerOrFounder && (
          <DeleteBusinessModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            business={business}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        )}
      </main>

      <PublicFooter />
    </div>
  );
}