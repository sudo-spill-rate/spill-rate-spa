import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronRight,
  ArrowUp,
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
  Camera,
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
  const { user } = useUserAuth();
  const { businesses: ownerBusinesses, deleteBusiness, isDeleting } = useBusiness();

  const [imageError, setImageError] = useState(false);
  const [activePhotoUrl, setActivePhotoUrl] = useState(null);
  const [activePhotoGallery, setActivePhotoGallery] = useState([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState(
    () => searchParams.get("writeReview") === "true"
  );
  const [mobileTab, setMobileTab] = useState("reviews"); // "reviews" | "analytics"
  const [selectedRating, setSelectedRating] = useState(undefined);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isStickyActive, setIsStickyActive] = useState(false);

  // Track window scroll to apply subtle bottom shadow when sticky bar is active
  useEffect(() => {
    const handleScroll = () => {
      setIsStickyActive(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const rawReviews = useMemo(() => reviewsResponse?.data || [], [reviewsResponse?.data]);
  
  // Extract up to 3 customer uploaded review photos across all reviews
  const customerPhotos = useMemo(() => {
    const photos = [];
    for (const rev of rawReviews) {
      if (Array.isArray(rev.image_urls) && rev.image_urls.length > 0) {
        for (const url of rev.image_urls) {
          if (url && typeof url === "string" && !photos.includes(url)) {
            photos.push(url);
            if (photos.length >= 3) return photos;
          }
        }
      }
    }
    return photos;
  }, [rawReviews]);

  const reviews = useMemo(() => {
    let filtered = [...rawReviews];
    if (selectedRating !== undefined) {
      filtered = filtered.filter((r) => r.rating === selectedRating);
    }
    return filtered.sort((a, b) => {
      if (b.is_pinned !== a.is_pinned) {
        return (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0);
      }
      return (
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime()
      );
    });
  }, [rawReviews, selectedRating]);

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

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px] cursor-pointer"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px] flex items-center justify-center cursor-pointer"
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

  const rawAvg =
    typeof business?.average_rating === "number"
      ? business.average_rating
      : typeof business?.rating_breakdown?.average_rating === "number"
      ? business.rating_breakdown.average_rating
      : null;
  const hasRating = rawAvg !== null && rawAvg > 0;
  const reviewCount =
    business?.total_reviews ??
    business?.rating_breakdown?.total_reviews ??
    rawReviews.length ??
    0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-6 sm:pb-8 space-y-2.5 sm:space-y-3">
        {/* 1. Sticky Back to Directory > & Top Navigation Bar (Aligned with Home > Directory breadcrumb) */}
        <nav
          aria-label="Storefront navigation"
          className={`sticky top-14 sm:top-16 z-40 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-3 bg-white/95 backdrop-blur-sm flex items-center justify-between gap-2 transition-shadow duration-150 ${
            isStickyActive
              ? "shadow-xs border-b border-slate-200/80"
              : "border-b border-slate-200/80"
          }`}
        >
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 active:text-slate-950 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded py-1 -my-1 cursor-pointer"
            aria-label="Back to Directory"
          >
            <span className="font-medium text-slate-600 hover:text-slate-900">Back to Directory</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={handleScrollToTop}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-900 hover:text-teal-700 active:text-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded py-1 -my-1 cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span>Top</span>
          </button>
        </nav>

        {/* 2. Main Business Details Card */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-5">
            {/* Top Details Section: Full-width responsive container */}
            <div className="flex-1 min-w-0 w-full space-y-3">
              {/* Identity Header: Left Logo (w-20 h-20 mobile, sm:w-16 sm:h-16 lg:w-20 lg:h-20 desktop) | Right 3-Row Stack */}
              <div className="w-full flex items-center gap-3.5">
                <div className="shrink-0">
                  {business.image_url && !imageError ? (
                    <img
                      src={business.image_url}
                      alt={`${business.name} logo`}
                      className="w-20 h-20 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl object-cover border border-slate-200/90 shadow-2xs bg-white ring-1 ring-slate-100"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center font-bold text-teal-800 text-2xl sm:text-2xl lg:text-3xl shadow-2xs ring-1 ring-teal-100">
                      {business.name ? business.name.charAt(0).toUpperCase() : "B"}
                    </div>
                  )}
                </div>

                {/* Right of Logo: Row 1 = Name | Shield; Row 2 & 3 = Category + Rating Summary */}
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                  <div className="w-full flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <h1 className="text-xl sm:text-lg lg:text-xl font-extrabold text-slate-900 tracking-tight truncate leading-snug">
                      {business.name}
                    </h1>

                    {business.is_verified && (
                      <span
                        className="inline-flex items-center gap-1.5 shrink-0"
                        title="Verified Establishment"
                        aria-label="Verified Establishment"
                      >
                        <span className="text-slate-300 font-light text-xs sm:text-sm" aria-hidden="true">
                          |
                        </span>
                        <img
                          src="https://res.cloudinary.com/qzludnat/image/upload/v1792131560/Teal_Verified_Shield_Icon-removebg-preview.png"
                          alt=""
                          className="w-5 h-5 object-contain inline-block shrink-0"
                          decoding="async"
                        />
                      </span>
                    )}

                    {!isEligible && (
                      <span
                        className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200/60 shrink-0"
                        title={`You recently reviewed this business. You can submit another review in ${cooldownHours} hours.`}
                      >
                        <Clock className="w-3 h-3 text-slate-500 shrink-0" aria-hidden="true" />
                        <span>Reviewed ({cooldownHours}h wait)</span>
                      </span>
                    )}
                  </div>

                  {/* Mobile: stacked Category + Rating (3 clean lines matching w-16 logo height); Desktop (sm:): inline pill + rating */}
                  <div className="w-full flex flex-col items-start gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2.5 sm:gap-y-1 text-xs min-w-0">
                    {business.category && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80 truncate max-w-full">
                        {business.category}
                      </span>
                    )}

                    <div className="inline-flex items-center gap-1 min-w-0">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600 shrink-0" aria-hidden="true" />
                      {hasRating ? (
                        <>
                          <span className="font-bold text-slate-900 tabular-nums">
                            {Number(rawAvg).toFixed(1)}
                          </span>
                          <span className="text-slate-600 font-normal">
                            ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                          </span>
                        </>
                      ) : (
                        <span className="font-medium text-slate-600">No reviews yet</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description: Full-width editorial prose */}
              {business.description && (
                <div className="w-full text-xs sm:text-sm text-slate-600">
                  <p className={`${isDescriptionExpanded ? "" : "line-clamp-3 sm:line-clamp-none"} leading-relaxed`}>
                    {business.description}
                  </p>
                  {business.description.length > 220 && (
                    <button
                      type="button"
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="sm:hidden text-teal-700 hover:text-teal-800 font-semibold text-xs mt-1 py-1 -my-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600 rounded inline-flex items-center"
                    >
                      {isDescriptionExpanded ? "See less" : "See more"}
                    </button>
                  )}
                </div>
              )}

              {/* Contact Info Bar: Spans full width of container without wasted white space */}
              <div className="w-full py-2.5 sm:pt-2.5 sm:pb-0 border-y sm:border-b-0 border-slate-200/80 text-xs text-slate-600">
                <div className="w-full flex flex-wrap items-center justify-between sm:justify-start gap-x-2 sm:gap-x-5 gap-y-1.5">
                  {/* Phone */}
                  {business.phone ? (
                    <a
                      href={`tel:${business.phone}`}
                      className="inline-flex items-center gap-1.5 text-slate-800 hover:text-teal-700 transition-colors font-medium focus:outline-none focus:underline min-w-0"
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-700 shrink-0" aria-hidden="true" />
                      <span className="truncate">{business.phone}</span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-slate-600 min-w-0">
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                      <span className="truncate">No phone</span>
                    </span>
                  )}

                  <span className="text-slate-300 font-light text-xs select-none" aria-hidden="true">
                    |
                  </span>

                  {/* Address */}
                  {business.address ? (
                    <div className="inline-flex items-center gap-1.5 text-slate-700 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" aria-hidden="true" />
                      <span className="truncate max-w-[180px] sm:max-w-[340px]">{business.address}</span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-slate-600 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                      <span className="truncate">No address</span>
                    </span>
                  )}

                  <span className="text-slate-300 font-light text-xs select-none" aria-hidden="true">
                    |
                  </span>

                  {/* Website */}
                  {business.website ? (
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-800 hover:underline font-medium min-w-0 max-w-[160px] sm:max-w-[280px]"
                    >
                      <Globe className="w-3.5 h-3.5 text-teal-700 shrink-0" aria-hidden="true" />
                      <span className="truncate">
                        {business.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-slate-600 min-w-0">
                      <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                      <span className="truncate">No website</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side / Bottom Mobile Row: Primary Actions with standard 44px min-touch target */}
            <div className="flex items-center gap-2 shrink-0 justify-end w-full sm:w-auto">
              {isEligible ? (
                <button
                  type="button"
                  onClick={handleWriteReview}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-teal-700 hover:bg-teal-800 active:bg-teal-900 transition-colors shadow-2xs min-h-[44px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <PenSquare className="w-4 h-4" aria-hidden="true" />
                  <span>Write a Review</span>
                </button>
              ) : (
                <div
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl font-medium text-xs text-slate-600 bg-slate-100 border border-slate-200/80 min-h-[44px]"
                  title={`You recently reviewed this business. You can submit another review in ${cooldownHours} hours.`}
                >
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                  <span>Reviewed ({cooldownHours}h wait)</span>
                </div>
              )}

              {isOwnerOrFounder && (
                <>
                  <Link
                    to={manageLink}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer min-h-[44px]"
                    title="Edit Storefront Profile"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
                    <span className="hidden sm:inline">Edit</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors cursor-pointer min-h-[44px]"
                    title="Delete Storefront"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" aria-hidden="true" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </>
              )}

              {/* Share Button (44px min-h) */}
              <ShareStorefrontMenu
                slug={business.slug}
                businessName={business.name}
                logoUrl={business.image_url}
                isOwner={isOwnerOrFounder}
                iconOnly={true}
              />
            </div>
          </div>
        </div>

        {/* 3. Main Content: 2-Column Split (Ratings Breakdown | Feedback) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
          {/* Left Column: Ratings Breakdown & Customer Photos (Desktop Sticky) */}
          <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-[calc(4rem+4.5rem)] space-y-3">
            <BusinessRatingStatsCard
              business={business}
              reviews={rawReviews}
              selectedRating={selectedRating}
              onSelectRating={setSelectedRating}
              showResponseMetrics={false}
              title="Ratings Breakdown"
            />

            {/* 3 Customer Photos Section */}
            {customerPhotos.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Camera className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                    <span>Customer Photos ({customerPhotos.length})</span>
                  </div>
                </div>

                {/* 3 Photos Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {customerPhotos.slice(0, 3).map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePhotoUrl(url)}
                      className="group relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100 hover:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer transition-colors shadow-2xs"
                      aria-label={`View photo ${idx + 1}`}
                    >
                      <img
                        src={url}
                        alt={`Customer upload ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Mobile Tab Switcher, Mobile Ratings, and Reviews Feed */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Mobile Tab Switcher (Visible on mobile/tablet < lg only) */}
            <div
              role="tablist"
              aria-label="Storefront feedback views"
              className="lg:hidden bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden grid grid-cols-2 divide-x divide-slate-200/80 mb-2.5"
            >
              <button
                type="button"
                role="tab"
                id="mobile-tab-reviews"
                aria-selected={mobileTab === "reviews"}
                aria-controls="mobile-panel-reviews"
                onClick={() => setMobileTab("reviews")}
                className={`inline-flex items-center justify-center gap-2 py-2.5 px-3 text-xs transition-colors min-h-[44px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-600 ${
                  mobileTab === "reviews"
                    ? "border-b-2 border-teal-700 bg-teal-50/25 text-slate-900 font-bold"
                    : "border-b-2 border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50/60 font-semibold"
                }`}
              >
                <MessageSquare
                  className={`w-3.5 h-3.5 shrink-0 ${
                    mobileTab === "reviews" ? "text-teal-700" : "text-slate-500"
                  }`}
                  aria-hidden="true"
                />
                <span>Reviews</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[11px] tabular-nums ${
                    mobileTab === "reviews"
                      ? "bg-teal-100/80 text-teal-900 font-bold"
                      : "bg-slate-100 text-slate-700 font-semibold"
                  }`}
                >
                  {reviews.length}
                </span>
              </button>

              <button
                type="button"
                role="tab"
                id="mobile-tab-analytics"
                aria-selected={mobileTab === "analytics"}
                aria-controls="mobile-panel-analytics"
                onClick={() => setMobileTab("analytics")}
                className={`inline-flex items-center justify-center gap-2 py-2.5 px-3 text-xs transition-colors min-h-[44px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-600 ${
                  mobileTab === "analytics"
                    ? "border-b-2 border-teal-700 bg-teal-50/25 text-slate-900 font-bold"
                    : "border-b-2 border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50/60 font-semibold"
                }`}
              >
                <Star
                  className="w-3.5 h-3.5 fill-amber-500 text-amber-600 shrink-0"
                  aria-hidden="true"
                />
                <span>Ratings</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[11px] tabular-nums ${
                    mobileTab === "analytics"
                      ? "bg-amber-100/80 text-amber-900 font-bold"
                      : "bg-slate-100 text-slate-700 font-semibold"
                  }`}
                >
                  {hasRating ? Number(rawAvg).toFixed(1) : "0.0"}
                </span>
              </button>
            </div>

            {/* Mobile Ratings Breakdown & Photos (Only shown when mobileTab is 'analytics' on < lg screens) */}
            <div
              id="mobile-panel-analytics"
              role="tabpanel"
              aria-labelledby="mobile-tab-analytics"
              className={`lg:hidden space-y-2.5 ${mobileTab === "analytics" ? "block" : "hidden"}`}
            >
              <BusinessRatingStatsCard
                business={business}
                reviews={rawReviews}
                selectedRating={selectedRating}
                onSelectRating={(star) => {
                  setSelectedRating(star);
                  if (star) setMobileTab("reviews");
                }}
                showResponseMetrics={false}
                title="Ratings Breakdown"
              />

              {/* 3 Photos Section in Mobile Analytics */}
              {customerPhotos.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Camera className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                    <span>Customer Photos ({customerPhotos.length})</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {customerPhotos.slice(0, 3).map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActivePhotoUrl(url)}
                        className="group relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100 hover:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer transition-colors shadow-2xs"
                        aria-label={`View photo ${idx + 1}`}
                      >
                        <img
                          src={url}
                          alt={`Customer upload ${idx + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Customer Reviews & Moderation Feed (Shown always on desktop lg+, and when mobileTab is 'reviews' on < lg) */}
            <div
              id="mobile-panel-reviews"
              role="tabpanel"
              aria-labelledby="mobile-tab-reviews"
              className={`${mobileTab === "reviews" ? "block" : "hidden lg:block"}`}
            >
              {isOwnerOrFounder ? (
                <ManageReviewProvider>
                  <ReviewModerationHub
                    businessId={business.id}
                    businessSlug={business.slug}
                  />
                </ManageReviewProvider>
              ) : (
                <div className="space-y-3.5">
                  <PublicReviewFeed
                    reviews={reviews}
                    isLoading={isReviewsLoading}
                    isError={isReviewsError}
                    onRetry={refetchReviews}
                    selectedRating={selectedRating}
                    onClearFilter={() => setSelectedRating(undefined)}
                    onPhotoClick={(url, gallery = [], idx = 0) => {
                      setActivePhotoUrl(url);
                      setActivePhotoGallery(Array.isArray(gallery) && gallery.length > 0 ? gallery : [url]);
                      setActivePhotoIndex(idx);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
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
            imageUrls={activePhotoGallery}
            initialIndex={activePhotoIndex}
            onClose={() => {
              setActivePhotoUrl(null);
              setActivePhotoGallery([]);
              setActivePhotoIndex(0);
            }}
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