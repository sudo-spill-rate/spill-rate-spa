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
  RotateCw,
} from "lucide-react";
import PublicNavbar from "../../PublicPages/components/layout/PublicNavbar";
import PublicFooter from "../../PublicPages/components/layout/PublicFooter";
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
      <div className="min-h-screen bg-slate-50 flex flex-col" aria-busy="true">
        <PublicNavbar />
        <main className="flex-1 max-w-2xl w-full mx-auto py-8 px-4 sm:px-6 space-y-4">
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="bg-white p-6 rounded-xl border border-slate-200 animate-pulse space-y-3">
            <div className="h-6 w-48 bg-slate-200 rounded" />
            <div className="h-4 w-64 bg-slate-100 rounded" />
          </div>
          <div className="h-64 bg-white rounded-xl border border-slate-200 animate-pulse" />
        </main>
        <PublicFooter />
      </div>
    );
  }

  // Target Business Error
  if (isBusinessError || !business) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <PublicNavbar />
        <main className="flex-1 max-w-md w-full mx-auto py-12 px-4 flex items-center justify-center">
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs text-center space-y-3 w-full">
            <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
            <h1 className="text-lg font-bold text-slate-900">Establishment Not Found</h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cannot submit an endorsement because the target business record could not be loaded.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[38px] cursor-pointer"
              >
                Go Back
              </button>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  // Reviewer Business Error: Not Found
  if (isReviewerBizError || !reviewerBiz) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <PublicNavbar />
        <main className="flex-1 max-w-md w-full mx-auto py-12 px-4 flex items-center justify-center">
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs text-center space-y-3 w-full">
            <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
            <h1 className="text-lg font-bold text-slate-900">Endorsing Storefront Not Found</h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              The business you are attempting to endorse from could not be located.
            </p>
            <div className="pt-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[38px]"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  // Permission Denied: User does not own the reviewer business
  if (!isOwnerOfReviewerBiz) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <PublicNavbar />
        <main className="flex-1 max-w-md w-full mx-auto py-12 px-4 flex items-center justify-center">
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-red-200 shadow-xs text-center space-y-3 w-full">
            <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
            <h1 className="text-lg font-bold text-slate-900">Permission Denied</h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              You do not have management permissions for <strong>{reviewerBiz.name}</strong>. You can only leave endorsements using businesses registered under your account.
            </p>
            <div className="pt-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[38px]"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  // Self-Review Error
  if (isSelfReview) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <PublicNavbar />
        <main className="flex-1 max-w-md w-full mx-auto py-12 px-4 flex items-center justify-center">
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-amber-200 shadow-xs text-center space-y-3 w-full">
            <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
            <h1 className="text-lg font-bold text-slate-900">Self-Endorsement Not Allowed</h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              A business cannot write a review or endorsement for itself.
            </p>
            <div className="pt-2">
              <Link
                to={`/business/${businessSlug}`}
                className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[38px]"
              >
                View Public Profile
              </Link>
            </div>
          </div>
        </main>
        <PublicFooter />
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

  const rawAvg =
    business?.rating_breakdown?.average_rating ?? business?.average_rating;
  const hasRating = typeof rawAvg === "number" && rawAvg > 0;
  const reviewCount =
    business?.rating_breakdown?.total_reviews ?? business?.total_reviews ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-2xl w-full mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-4">
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
            to={`/business/${business.slug || business.id}`}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors"
          >
            View Profile
          </Link>
        </div>

        {/* 1. Endorsing Storefront Context Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200 px-1.5 py-0.5 rounded">
                  Endorsing As
                </span>
                <span className="text-xs text-slate-500 truncate">
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
                className="px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[38px] cursor-pointer"
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

        {/* 2. Target Storefront Consolidated Info Card */}
        <article
          aria-labelledby="target-business-title"
          className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-xs space-y-2.5"
        >
          {/* Header Row: Title & View Storefront Link */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-teal-700" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
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
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>

          {/* Storefront Info Row */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
              {business.image_url && !imageError ? (
                <img
                  src={business.image_url}
                  alt={`Logo of ${business.name}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={() => setImageError(true)}
                />
              ) : (
                <Building className="w-5 h-5 text-slate-400" aria-hidden="true" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2
                  id="target-business-title"
                  className="text-sm sm:text-base font-bold text-slate-900 tracking-tight break-words"
                >
                  {business.name}
                </h2>

                {business.is_verified && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-teal-700 bg-teal-50 px-1 py-0.5 rounded border border-teal-200">
                    <CheckCircle2 className="w-2.5 h-2.5 text-teal-600" />
                    <span>Verified</span>
                  </span>
                )}

                {business.category && (
                  <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                    {business.category}
                  </span>
                )}
              </div>

              <p className="mt-0.5 text-[11px] text-slate-500 font-mono">
                /{business.slug}
              </p>
            </div>
          </div>

          {/* Short Description */}
          {business.description && (
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap break-words line-clamp-2">
                {business.description}
              </p>
            </div>
          )}

          {/* Contact Details & Rating in single row */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {business.address && (
                <span className="inline-flex items-center gap-1 min-w-0">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate max-w-xs text-[11px]">{business.address}</span>
                </span>
              )}

              {business.phone && (
                <span className="inline-flex items-center gap-1 min-w-0 text-[11px]">
                  <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{business.phone}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px]">
              {hasRating ? (
                <>
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span className="font-bold text-slate-800">{Number(rawAvg).toFixed(1)}</span>
                  <span className="text-slate-400">({reviewCount})</span>
                </>
              ) : (
                <span className="text-slate-400">No reviews yet</span>
              )}
            </div>
          </div>
        </article>

        {/* 3. B2B Endorsement Submission Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4"
        >
          {serverError && (
            <div
              role="alert"
              className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Attribution Notice */}
          <div className="p-3 rounded-lg bg-teal-50/70 border border-teal-200 text-xs text-teal-900 flex items-center gap-2">
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
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors min-h-[38px] cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors min-h-[38px] focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish B2B Endorsement</span>
                </>
              )}
            </button>
          </div>
        </form>

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
      </main>

      <PublicFooter />
    </div>
  );
}
