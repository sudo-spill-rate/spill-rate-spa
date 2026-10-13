import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  Building,
  AlertCircle,
  Send,
  Store,
  CheckCircle2,
  Briefcase,
  MapPin,
  Phone,
  Globe,
  Star,
  ExternalLink,
} from "lucide-react";
import { businessService } from "../../../services/businessService";
import { reviewService } from "../../../services/reviewService";
import { useUserAuth } from "../../../hooks/useUserAuth";
import { useDeviceId } from "../../../hooks/useDeviceId";
import { useBusiness } from "../../../context/business/useBusiness";

import InteractiveStarPicker from "../components/submit/InteractiveStarPicker";
import ReviewCommentTextarea from "../components/submit/ReviewCommentTextarea";
import PhotoAttachmentUploader from "../components/submit/PhotoAttachmentUploader";
import ReviewSuccessDialog from "../components/submit/ReviewSuccessDialog";

export default function WriteB2BEndorsementPage() {
  const { reviewerId, businessId } = useParams();
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const deviceId = useDeviceId();
  const { businesses: ownerBusinesses, isLoading: isOwnerBusinessesLoading } = useBusiness();
  const [imageError, setImageError] = useState(false);

  // 1. Fetch Target Business
  const {
    data: businessResponse,
    isLoading: isBusinessLoading,
    isError: isBusinessError,
  } = useQuery({
    queryKey: ["business-for-review", businessId],
    queryFn: () => businessService.getBusinessBySlug(businessId || ""),
    enabled: Boolean(businessId),
  });

  const business = businessResponse?.data;
  const businessSlug = business?.slug || businessId || "";

  // 2. Fetch Reviewer Business (Endorsing Storefront)
  const {
    data: reviewerBizResponse,
    isLoading: isReviewerBizLoading,
    isError: isReviewerBizError,
  } = useQuery({
    queryKey: ["reviewer-biz-for-b2b", reviewerId],
    queryFn: () => businessService.getBusinessBySlug(reviewerId || ""),
    enabled: Boolean(reviewerId),
  });

  const reviewerBiz = reviewerBizResponse?.data;

  // 3. Ownership & Self-Review Validations
  const isOwnerOfReviewerBiz = Boolean(
    reviewerBiz && (
      reviewerBiz.user_id === user?.id ||
      ownerBusinesses.some(
        (b) => b.id === reviewerBiz.id || (b.slug && b.slug === reviewerBiz.slug)
      )
    )
  );

  const isSelfReview = Boolean(
    reviewerBiz &&
      business &&
      (reviewerBiz.id === business.id || reviewerBiz.slug === business.slug)
  );

  // 4. Form State
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const validate = () => {
    const errors = {};
    if (!rating || rating < 1 || rating > 5) {
      errors.rating = "Please select a star rating from 1 to 5.";
    }
    if (!comment.trim()) {
      errors.comment = "Please provide an endorsement comment regarding your commercial experience.";
    } else if (comment.trim().length < 10) {
      errors.comment = "Endorsement must be at least 10 characters long.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (isSelfReview) {
      setServerError("A business cannot write a review or endorsement for itself.");
      return;
    }

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const response = await reviewService.submitReview(businessSlug, {
        name: reviewerBiz.name,
        rating,
        comment: comment.trim(),
        device_id: deviceId,
        reviewer_business_id: reviewerBiz.id,
        images,
      });

      if (response.success) {
        setIsSubmittedSuccess(true);
      } else {
        throw new Error(response.message || "Failed to submit B2B endorsement. Please try again.");
      }
    } catch (err) {
      setServerError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading State
  if (isBusinessLoading || isReviewerBizLoading || isOwnerBusinessesLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xs max-w-md w-full animate-pulse space-y-4">
          <div className="h-6 w-32 bg-slate-200 rounded" />
          <div className="h-8 w-48 bg-slate-200 rounded" />
          <div className="h-24 bg-slate-200 rounded-lg" />
        </div>
      </div>
    );
  }

  // Target Business Error
  if (isBusinessError || !business) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl border border-slate-200 shadow-xs text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h1 className="text-xl font-bold text-slate-900">Establishment Not Found</h1>
          <p className="text-sm text-slate-600">
            Cannot submit an endorsement because the target business record could not be loaded.
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[40px] cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Reviewer Business Error: Not Found
  if (isReviewerBizError || !reviewerBiz) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl border border-slate-200 shadow-xs text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h1 className="text-xl font-bold text-slate-900">Endorsing Storefront Not Found</h1>
          <p className="text-sm text-slate-600">
            The business you are attempting to endorse from could not be located.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[40px]"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Permission Denied: User does not own the reviewer business
  if (!isOwnerOfReviewerBiz) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl border border-red-200 shadow-xs text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
          <h1 className="text-xl font-bold text-slate-900">Permission Denied</h1>
          <p className="text-sm text-slate-600">
            You do not have management permissions for{" "}
            <strong>{reviewerBiz.name}</strong>. You can only leave endorsements using businesses registered under your account.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[40px]"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Self-Review Error
  if (isSelfReview) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl border border-amber-200 shadow-xs text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h1 className="text-xl font-bold text-slate-900">Self-Endorsement Not Allowed</h1>
          <p className="text-sm text-slate-600">
            A business cannot write a review or endorsement for itself.
          </p>
          <Link
            to={`/business/${businessSlug}`}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[40px]"
          >
            View Public Profile
          </Link>
        </div>
      </div>
    );
  }

  // Other owned storefronts (for switching endorsing business)
  const otherOwnedStorefronts = ownerBusinesses.filter(
    (b) =>
      b.id !== business.id &&
      b.slug !== business.slug &&
      b.id !== reviewerBiz.id &&
      b.slug !== reviewerBiz.slug
  );

  // Target business rating metadata
  const rawAvg =
    business?.rating_breakdown?.average_rating ?? business?.average_rating;
  const hasRating = typeof rawAvg === "number" && rawAvg > 0;
  const reviewCount =
    business?.rating_breakdown?.total_reviews ?? business?.total_reviews ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded p-1 cursor-pointer min-h-[36px]"
            aria-label={`Back to ${business.name}`}
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to {business.name}</span>
          </button>

          <Link
            to="/dashboard/explore"
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors"
          >
            Back to Directory
          </Link>
        </div>

        {/* 1. Endorsing Storefront Context Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200 px-1.5 py-0.5 rounded">
                  Endorsing As
                </span>
                <span className="text-xs text-slate-500">
                  ({reviewerBiz.category || "Your Storefront"})
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {reviewerBiz.name}
              </p>
            </div>
          </div>

          {/* Switch Storefront Dropdown if owner has multiple stores */}
          {otherOwnedStorefronts.length > 0 && (
            <div className="shrink-0 flex items-center gap-2 text-xs">
              <label htmlFor="switch-storefront" className="text-slate-500 whitespace-nowrap">
                Switch:
              </label>
              <select
                id="switch-storefront"
                value={reviewerBiz.slug || reviewerBiz.id}
                onChange={(e) =>
                  navigate(`/business/${e.target.value}/${businessSlug}/write-review`)
                }
                className="px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value={reviewerBiz.slug || reviewerBiz.id}>
                  {reviewerBiz.name}
                </option>
                {otherOwnedStorefronts.map((b) => (
                  <option key={b.id} value={b.slug || b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* 2. Target Storefront Full Info Card (Style matched from StorefrontFeedCard) */}
        <article
          aria-labelledby="target-business-title"
          className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3.5"
        >
          {/* Header Row: Title & View Storefront Link */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-teal-700" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Establishment Being Endorsed
              </span>
            </div>
            <Link
              to={`/business/${business.slug || business.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          {/* Storefront Info Row */}
          <div className="flex items-start gap-3.5">
            {/* Storefront Logo or Fallback */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
              {business.image_url && !imageError ? (
                <img
                  src={business.image_url}
                  alt={`Logo of ${business.name}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={() => setImageError(true)}
                />
              ) : (
                <Building className="w-6 h-6 text-slate-400" aria-hidden="true" />
              )}
            </div>

            {/* Name, Verified Badge, Category, and Slug */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2
                  id="target-business-title"
                  className="text-base sm:text-lg font-bold text-slate-900 tracking-tight break-words"
                >
                  {business.name}
                </h2>

                {business.is_verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                    <CheckCircle2 className="w-3 h-3 text-teal-600" aria-hidden="true" />
                    <span>Verified</span>
                  </span>
                )}

                {business.category && (
                  <span className="text-[10px] sm:text-[11px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                    {business.category}
                  </span>
                )}
              </div>

              <p className="mt-0.5 text-xs text-slate-500">
                Slug: <span className="font-mono text-slate-700 break-all">{business.slug}</span>
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap break-words">
              {business.description || "No description provided."}
            </p>
          </div>

          {/* Contact Details & Physical Location */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <span className="inline-flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="truncate max-w-xs">
                {business.address || "No physical address provided"}
              </span>
            </span>

            <span className="inline-flex items-center gap-1.5 min-w-0">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <span>{business.phone || "No phone registered"}</span>
            </span>

            {business.website ? (
              <a
                href={business.website.startsWith("http") ? business.website : `https://${business.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-800 hover:underline min-w-0 truncate"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                <span className="truncate max-w-xs">
                  {business.website.replace(/^https?:\/\//, "")}
                </span>
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-slate-400 min-w-0">
                <Globe className="w-3.5 h-3.5 text-slate-300 shrink-0" aria-hidden="true" />
                <span>No website registered</span>
              </span>
            )}
          </div>

          {/* Rating Breakdown */}
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              {hasRating ? (
                <>
                  <div className="flex items-center text-amber-600 font-bold">
                    <Star
                      className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1"
                      aria-hidden="true"
                    />
                    <span>{Number(rawAvg).toFixed(1)}</span>
                  </div>
                  <span className="text-slate-500 text-[11px]">
                    ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </>
              ) : (
                <span className="text-[11px] text-slate-400">No reviews yet</span>
              )}
            </div>

            <span className="text-[11px] text-teal-700 font-medium">
              Active Storefront Profile
            </span>
          </div>
        </article>

        {/* 3. B2B Endorsement Submission Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-6"
        >
          {serverError && (
            <div
              role="alert"
              className="p-4 rounded-lg bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800 flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Attribution Notice */}
          <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 text-xs text-teal-900 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
            <span>
              This endorsement will be publicly attributed to{" "}
              <strong>{reviewerBiz.name}</strong> as an authenticated merchant endorsement.
            </span>
          </div>

          {/* Star Rating */}
          <InteractiveStarPicker
            value={rating}
            onChange={(r) => {
              setRating(r);
              if (formErrors.rating) {
                setFormErrors((prev) => ({ ...prev, rating: undefined }));
              }
            }}
            disabled={isSubmitting}
            error={formErrors.rating}
          />

          {/* Feedback Textarea */}
          <ReviewCommentTextarea
            value={comment}
            onChange={(c) => {
              setComment(c);
              if (formErrors.comment) {
                setFormErrors((prev) => ({ ...prev, comment: undefined }));
              }
            }}
            disabled={isSubmitting}
            error={formErrors.comment}
            placeholder="Describe your commercial relationship, supply reliability, or mutual recommendation (minimum 10 characters)..."
          />

          {/* Photos */}
          <PhotoAttachmentUploader
            images={images}
            onChange={(imgs) => setImages(imgs)}
            disabled={isSubmitting}
          />

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition-colors min-h-[48px] focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>
                {isSubmitting ? "Publishing Endorsement..." : "Publish B2B Endorsement"}
              </span>
            </button>
            <p className="text-[11px] text-slate-500 text-center mt-3">
              B2B endorsements establish commercial credibility between neighborhood merchants.
            </p>
          </div>
        </form>
      </div>

      {/* Success Dialog */}
      {isSubmittedSuccess && (
        <ReviewSuccessDialog
          isOpen={isSubmittedSuccess}
          businessSlug={businessSlug}
          businessName={business.name}
          isB2B={true}
          reviewerBusinessName={reviewerBiz.name}
          onClose={() => navigate(`/business/${businessSlug}`)}
        />
      )}
    </div>
  );
}
