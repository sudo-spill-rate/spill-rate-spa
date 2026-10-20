import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ArrowUp,
  RotateCw,
  AlertTriangle,
  MapPin,
  Phone,
  Globe,
  Edit3,
  Trash2,
  Star,
  MessageSquare,
  Camera,
  CheckCircle2,
} from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import ReviewModerationHub from "../../BusinessPages/components/profile/ReviewModerationHub";
import BusinessRatingStatsCard from "../../BusinessPages/components/profile/BusinessRatingStatsCard";
import ShareStorefrontMenu from "../../BusinessPages/components/profile/ShareStorefrontMenu";
import SegmentedTabs from "../../../components/common/SegmentedTabs";
import { EditBusinessModal, DeleteBusinessModal } from "../../BusinessPages/components/profile/BusinessActionModals";
import ReviewPhotoModal from "../../ReviewPages/components/businessView/ReviewPhotoModal";
import { ReviewProvider } from "../../../context/review/reviewContextProvider";
import { ManageReviewProvider } from "../../../context/manageReview/manageReviewContextProvider";
import { useBusinessProfile } from "../../../hooks/useBusinessProfile";
import { reviewService } from "../../../services/reviewService";

export default function AdminManageStorefrontPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    selectedBusiness,
    fetchBusinessBySlug,
    updateBusiness,
    deleteBusiness,
    clearSelectedBusiness,
    isLoading,
    isUpdating,
    isDeleting,
    error,
  } = useBusinessProfile();

  const [imageError, setImageError] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState("reviews"); // "reviews" | "analytics"
  const [selectedRating, setSelectedRating] = useState(undefined);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isStickyActive, setIsStickyActive] = useState(false);

  // Track window scroll for mobile sticky sub-nav shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 640) return;
      const nextActive = window.scrollY > 8;
      setIsStickyActive((prev) => (prev === nextActive ? prev : nextActive));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Photo viewer modal state
  const [activePhotoUrl, setActivePhotoUrl] = useState(null);
  const [activePhotoGallery, setActivePhotoGallery] = useState([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchBusinessBySlug(id);
    }
    return () => {
      clearSelectedBusiness();
    };
  }, [id, fetchBusinessBySlug, clearSelectedBusiness]);

  // Fetch reviews for Customer Photos & Ratings Breakdown sync
  const { data: reviewsResponse, refetch: refetchReviews } = useQuery({
    queryKey: ["admin-business-reviews", selectedBusiness?.slug],
    queryFn: () => reviewService.getReviews(selectedBusiness?.slug || "", { limit: 50 }),
    enabled: Boolean(selectedBusiness?.slug),
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

  const handleBack = () => {
    navigate("/admin/my-store");
  };

  const handleUpdate = async (bizId, payload) => {
    const res = await updateBusiness(bizId, payload);
    if (res.success && id) {
      fetchBusinessBySlug(id);
      refetchReviews();
    }
    return res;
  };

  const handleDelete = async (bizId) => {
    const res = await deleteBusiness(bizId);
    if (res.success) {
      navigate("/admin/my-store");
    }
    return res;
  };

  const rawAvg =
    typeof selectedBusiness?.average_rating === "number"
      ? selectedBusiness.average_rating
      : typeof selectedBusiness?.rating_breakdown?.average_rating === "number"
      ? selectedBusiness.rating_breakdown.average_rating
      : null;
  const hasRating = rawAvg !== null && rawAvg > 0;
  const reviewCount =
    selectedBusiness?.total_reviews ??
    selectedBusiness?.rating_breakdown?.total_reviews ??
    rawReviews.length ??
    0;

  return (
    <AdminLayout>
      {/* 1. Mobile Storefront Navigation Bar (Sticky under header on mobile, hidden on desktop) */}
      <nav
        aria-label="Storefront navigation"
        className={`sm:hidden sticky top-16 z-30 -mx-3.5 px-3.5 py-2.5 -mt-3.5 mb-3 bg-white/95 backdrop-blur-sm border-b border-slate-200/90 flex items-center justify-between gap-2 transition-shadow duration-150 ${
          isStickyActive ? "shadow-xs" : ""
        }`}
      >
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 active:text-slate-950 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700 rounded py-1 px-1 cursor-pointer min-h-[36px]"
          aria-label="Back to Storefronts"
        >
          <ChevronLeft className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
          <span className="font-semibold text-slate-700">Back to Storefronts</span>
        </button>

        <button
          type="button"
          onClick={handleScrollToTop}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-teal-700 active:text-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700 rounded py-1 px-2 cursor-pointer min-h-[36px]"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
          <span>Top</span>
        </button>
      </nav>

      {/* 2. Desktop Breadcrumb / Back Button */}
      <div className="hidden sm:block mb-3">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700 rounded p-1 min-h-[34px] cursor-pointer"
          aria-label="Back to Storefronts"
        >
          <ChevronLeft className="w-4 h-4 text-slate-500" aria-hidden="true" />
          <span>Back to Storefronts</span>
        </button>
      </div>

      {/* 3. Loading State */}
      {isLoading && !selectedBusiness && (
        <div className="space-y-6" aria-busy="true" aria-label="Loading business profile">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 animate-pulse space-y-4 shadow-xs">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-slate-200 rounded-xl" />
              <div className="space-y-2 flex-1">
                <div className="h-6 w-56 bg-slate-200 rounded" />
                <div className="h-4 w-32 bg-slate-100 rounded" />
              </div>
            </div>
          </div>
          <div className="h-48 bg-white rounded-2xl border border-slate-200/90 animate-pulse shadow-xs" />
        </div>
      )}

      {/* 4. Error State */}
      {!isLoading && error && (
        <div
          role="alert"
          className="p-5 sm:p-6 bg-white rounded-2xl border border-red-200 shadow-xs flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h2 className="text-base font-bold text-slate-900">
              Business profile not found
            </h2>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              {error || "The requested business profile could not be loaded. It may have been deleted or the link is incorrect."}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => id && fetchBusinessBySlug(id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors min-h-[40px] cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
              <Link
                to="/admin/my-store"
                className="px-4 py-2 text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors min-h-[40px] inline-flex items-center"
              >
                Return to Storefronts
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 5. Unified Storefront Management View */}
      {!isLoading && selectedBusiness && (
        <ReviewProvider key={selectedBusiness.slug}>
          <ManageReviewProvider>
            <div className="space-y-4">
              {/* Main Business Details Header Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-5 shadow-xs space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-5">
                  {/* Identity & Details Section */}
                  <div className="flex-1 min-w-0 w-full space-y-2.5 sm:space-y-3">
                    <div className="w-full flex items-center gap-3 sm:gap-3.5">
                      {/* Storefront Logo or Letter Initial */}
                      <div className="shrink-0">
                        {selectedBusiness.image_url && !imageError ? (
                          <img
                            src={selectedBusiness.image_url}
                            alt={`${selectedBusiness.name} logo`}
                            crossOrigin="anonymous"
                            className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl object-cover border border-slate-200/90 shadow-2xs bg-white ring-1 ring-slate-100"
                            onError={() => setImageError(true)}
                          />
                        ) : (
                          <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center font-bold text-teal-800 text-xl sm:text-2xl lg:text-3xl shadow-2xs ring-1 ring-teal-100">
                            {selectedBusiness.name ? selectedBusiness.name.charAt(0).toUpperCase() : "B"}
                          </div>
                        )}
                      </div>

                      {/* Name, Verified Badge, Category, Rating */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 sm:gap-1.5">
                        <div className="w-full flex items-center gap-1.5 sm:gap-2 min-w-0">
                          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight truncate leading-snug">
                            {selectedBusiness.name}
                          </h1>

                          {selectedBusiness.is_verified && (
                            <span
                              className="inline-flex items-center gap-1 shrink-0"
                              title="Verified Establishment"
                              aria-label="Verified Establishment"
                            >
                              <span className="text-slate-300 font-light text-xs sm:text-sm" aria-hidden="true">
                                |
                              </span>
                              <CheckCircle2
                                className="w-4 h-4 sm:w-5 sm:h-5 text-teal-700 inline-block shrink-0 drop-shadow-2xs"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </div>

                        {/* Stacked Category + Rating on 1 neat line */}
                        <div className="w-full flex items-center gap-2 flex-wrap text-xs min-w-0">
                          {selectedBusiness.category && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80 truncate max-w-full">
                              {selectedBusiness.category}
                            </span>
                          )}

                          <div className="inline-flex items-center gap-1 min-w-0">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" aria-hidden="true" />
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

                    {/* Description */}
                    {selectedBusiness.description && (
                      <div className="w-full text-xs sm:text-sm text-slate-600 pt-0.5">
                        <p className={`${isDescriptionExpanded ? "" : "line-clamp-3 sm:line-clamp-none"} leading-relaxed`}>
                          {selectedBusiness.description}
                        </p>
                        {selectedBusiness.description.length > 220 && (
                          <button
                            type="button"
                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                            className="sm:hidden text-teal-700 hover:text-teal-800 font-semibold text-xs mt-1 py-1 -my-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-700 rounded inline-flex items-center"
                          >
                            {isDescriptionExpanded ? "See less" : "See more"}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Contact Info Bar */}
                    <div className="w-full pt-2 sm:pt-2.5 border-t border-slate-100 text-xs text-slate-600">
                      <div className="w-full flex flex-wrap items-center gap-x-4 gap-y-2">
                        {/* Phone */}
                        <div className="inline-flex items-center gap-1.5 min-w-0">
                          <Phone className="w-3.5 h-3.5 text-teal-700 shrink-0" aria-hidden="true" />
                          {selectedBusiness.phone ? (
                            <a
                              href={`tel:${selectedBusiness.phone}`}
                              className="text-slate-800 hover:text-teal-700 font-medium truncate focus:outline-none focus:underline"
                            >
                              {selectedBusiness.phone}
                            </a>
                          ) : (
                            <span className="text-slate-500 truncate">No phone</span>
                          )}
                        </div>

                        {/* Address */}
                        <div className="inline-flex items-center gap-1.5 min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                          <span className="text-slate-600 truncate max-w-[200px] sm:max-w-xs">
                            {selectedBusiness.address || "No address"}
                          </span>
                        </div>

                        {/* Website */}
                        <div className="inline-flex items-center gap-1.5 min-w-0">
                          <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                          {selectedBusiness.website ? (
                            <a
                              href={selectedBusiness.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-700 hover:text-teal-800 hover:underline font-medium truncate max-w-[180px] sm:max-w-xs"
                            >
                              {selectedBusiness.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                            </a>
                          ) : (
                            <span className="text-slate-500 truncate">No website</span>
                          )}
                        </div>

                        {/* Live Storefront Link */}
                        <Link
                          to={`/business/${selectedBusiness.slug}`}
                          className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 font-medium ml-auto"
                        >
                          <span>View Public Storefront &rarr;</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: Edit, Share, Delete */}
                  <div className="w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0 sm:self-start">
                    <div className="grid grid-cols-3 gap-2 w-full sm:flex sm:items-center">
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(true)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer min-h-[40px] shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                        title="Edit Storefront Profile"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-600 shrink-0" aria-hidden="true" />
                        <span className="truncate">Edit Profile</span>
                      </button>

                      <ShareStorefrontMenu
                        slug={selectedBusiness.slug}
                        businessName={selectedBusiness.name}
                        logoUrl={selectedBusiness.image_url}
                        isOwner={true}
                        className="w-full sm:w-auto"
                        buttonClassName="w-full inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer min-h-[40px] shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                      />

                      <button
                        type="button"
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-2 text-xs font-semibold rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-200 transition-colors cursor-pointer min-h-[40px] shadow-2xs focus:outline-none focus:ring-2 focus:ring-red-600"
                        title="Delete Storefront"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600 shrink-0" aria-hidden="true" />
                        <span className="truncate">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Main Split Section: Ratings Breakdown | Reviews Moderation */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
                {/* Left Column: Ratings Breakdown & Customer Photos */}
                <div className="hidden lg:block lg:col-span-5 space-y-3">
                  <BusinessRatingStatsCard
                    business={selectedBusiness}
                    reviews={rawReviews}
                    selectedRating={selectedRating}
                    onSelectRating={setSelectedRating}
                    showResponseMetrics={false}
                    title="Ratings Breakdown"
                  />

                  {/* Customer Photos */}
                  {customerPhotos.length > 0 && (
                    <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                          <Camera className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                          <span>Customer Photos ({customerPhotos.length})</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {customerPhotos.slice(0, 3).map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setActivePhotoUrl(url);
                              setActivePhotoGallery(customerPhotos);
                              setActivePhotoIndex(idx);
                            }}
                            className="group relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100 hover:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-700 cursor-pointer transition-colors shadow-2xs"
                            aria-label={`View photo ${idx + 1}`}
                          >
                            <img
                              src={url}
                              alt={`Customer upload ${idx + 1}`}
                              crossOrigin="anonymous"
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Mobile Tab Switcher + Review Moderation Hub */}
                <div className="lg:col-span-7 flex flex-col">
                  {/* Mobile Tab Switcher */}
                  <div className="lg:hidden mb-2.5">
                    <SegmentedTabs
                      tabs={[
                        {
                          id: "reviews",
                          label: "Reviews",
                          count: rawReviews.length,
                          icon: MessageSquare,
                        },
                        {
                          id: "analytics",
                          label: "Ratings",
                          count: hasRating ? Number(rawAvg).toFixed(1) : "0.0",
                          icon: Star,
                        },
                      ]}
                      activeTab={mobileTab}
                      onChange={setMobileTab}
                      variant="pill"
                      size="md"
                      fullWidth
                      ariaLabel="Storefront feedback views"
                    />
                  </div>

                  {/* Mobile Analytics (shown when mobileTab === 'analytics') */}
                  <div
                    className={`lg:hidden space-y-2.5 ${mobileTab === "analytics" ? "block" : "hidden"}`}
                  >
                    <BusinessRatingStatsCard
                      business={selectedBusiness}
                      reviews={rawReviews}
                      selectedRating={selectedRating}
                      onSelectRating={(star) => {
                        setSelectedRating(star);
                        if (star) setMobileTab("reviews");
                      }}
                      showResponseMetrics={false}
                      title="Ratings Breakdown"
                    />

                    {/* Customer Photos in Mobile Analytics */}
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
                              onClick={() => {
                                setActivePhotoUrl(url);
                                setActivePhotoGallery(customerPhotos);
                                setActivePhotoIndex(idx);
                              }}
                              className="group relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100 hover:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-700 cursor-pointer transition-colors shadow-2xs"
                              aria-label={`View photo ${idx + 1}`}
                            >
                              <img
                                src={url}
                                alt={`Customer upload ${idx + 1}`}
                                crossOrigin="anonymous"
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reviews Moderation Hub */}
                  <div className={`${mobileTab === "reviews" ? "block" : "hidden lg:block"}`}>
                    <ReviewModerationHub
                      businessId={selectedBusiness.id}
                      businessSlug={selectedBusiness.slug}
                      selectedRating={selectedRating}
                      onClearRatingFilter={() => setSelectedRating(undefined)}
                    />
                  </div>
                </div>
              </div>

              {/* Edit Business Modal */}
              <EditBusinessModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                business={selectedBusiness}
                onUpdate={handleUpdate}
                isUpdating={isUpdating}
              />

              {/* Delete Business Confirmation Modal */}
              <DeleteBusinessModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                business={selectedBusiness}
                onDelete={handleDelete}
                isDeleting={isDeleting}
              />

              {/* Photo Gallery Modal */}
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
            </div>
          </ManageReviewProvider>
        </ReviewProvider>
      )}
    </AdminLayout>
  );
}
