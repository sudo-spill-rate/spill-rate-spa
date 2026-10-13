import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  Building,
  AlertCircle,
  Send,
  MapPin,
  Phone,
  Globe,
  Star,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { businessService } from "../../../services/businessService";
import { reviewService } from "../../../services/reviewService";
import { useUserAuth } from "../../../hooks/useUserAuth";
import { useDeviceId } from "../../../hooks/useDeviceId";

import AntiSpamCooldownBanner from "../components/submit/AntiSpamCooldownBanner";
import InteractiveStarPicker from "../components/submit/InteractiveStarPicker";
import ReviewCommentTextarea from "../components/submit/ReviewCommentTextarea";
import PhotoAttachmentUploader from "../components/submit/PhotoAttachmentUploader";
import ReviewSuccessDialog from "../components/submit/ReviewSuccessDialog";

export default function WriteCustomerReviewPage() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const deviceId = useDeviceId();
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

  // 2. Cooldown & Eligibility Check
  const { data: eligibilityResponse } = useQuery({
    queryKey: ["review-eligibility", businessSlug, deviceId],
    queryFn: () => reviewService.checkEligibility(businessSlug, deviceId),
    enabled: Boolean(businessSlug && deviceId),
  });

  const eligibility = eligibilityResponse?.data;
  const isEligible = eligibility?.eligible ?? true;
  const cooldownHours = eligibility?.cooldown_remaining_hours ?? 0;

  // 3. Form State
  const [name, setName] = useState(user?.name || "");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  useEffect(() => {
    if (!name && user?.name) {
      setName(user.name);
    }
  }, [user?.name, name]);

  const validate = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = "Please provide your name.";
    }
    if (!rating || rating < 1 || rating > 5) {
      errors.rating = "Please select a star rating from 1 to 5.";
    }
    if (!comment.trim()) {
      errors.comment = "Please write a brief comment describing your experience.";
    } else if (comment.trim().length < 10) {
      errors.comment = "Feedback must be at least 10 characters long.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const response = await reviewService.submitReview(businessSlug, {
        name: name.trim(),
        rating,
        comment: comment.trim(),
        device_id: deviceId,
        images,
      });

      if (response.success) {
        setIsSubmittedSuccess(true);
      } else {
        throw new Error(response.message || "Failed to submit review. Please try again.");
      }
    } catch (err) {
      setServerError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading State
  if (isBusinessLoading) {
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

  // Error State
  if (isBusinessError || !business) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl border border-slate-200 shadow-xs text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h1 className="text-xl font-bold text-slate-900">Establishment Not Found</h1>
          <p className="text-sm text-slate-600">
            Cannot submit a review because the business record could not be loaded.
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
            to={`/business/${business.slug || business.id}`}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors"
          >
            View Profile
          </Link>
        </div>

        {/* Storefront Details Card (Styled identically to StorefrontFeedCard) */}
        <article
          aria-labelledby="review-target-heading"
          className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3.5"
        >
          {/* Header Row: Title & View Storefront Link */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span
              id="review-target-heading"
              className="text-[11px] font-bold uppercase tracking-wider text-teal-800"
            >
              Write a Customer Review
            </span>
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

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight break-words">
                  {business.name}
                </h1>

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

          {/* Rating */}
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

            <span className="text-[11px] text-slate-500">
              Community Verified
            </span>
          </div>
        </article>

        {/* Cooldown Status Banner */}
        <AntiSpamCooldownBanner
          isEligible={isEligible}
          cooldownRemainingHours={cooldownHours}
        />

        {/* Review Submission Form */}
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

          {/* Customer Name */}
          <div>
            <label
              htmlFor="customer-name"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
            >
              Your Name <span className="text-red-600">*</span>
            </label>
            <input
              id="customer-name"
              type="text"
              value={name}
              disabled={!isEligible || isSubmitting}
              onChange={(e) => {
                setName(e.target.value);
                if (formErrors.name) {
                  setFormErrors((prev) => ({ ...prev, name: undefined }));
                }
              }}
              placeholder="e.g. Maria Santos"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px] disabled:bg-slate-50 ${
                formErrors.name ? "border-red-500" : "border-slate-300"
              }`}
            />
            {formErrors.name && (
              <p className="text-xs text-red-600 mt-1" role="alert">
                {formErrors.name}
              </p>
            )}
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
            disabled={!isEligible || isSubmitting}
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
            disabled={!isEligible || isSubmitting}
            error={formErrors.comment}
            placeholder="What did you order or experience? How was the service and atmosphere? (minimum 10 characters)..."
          />

          {/* Photos */}
          <PhotoAttachmentUploader
            images={images}
            onChange={(imgs) => setImages(imgs)}
            disabled={!isEligible || isSubmitting}
          />

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={!isEligible || isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition-colors min-h-[48px] focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "Publishing Review..." : "Publish Review"}</span>
            </button>
            <p className="text-[11px] text-slate-500 text-center mt-3">
              By publishing, you confirm your review reflects an authentic firsthand customer visit.
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
          isB2B={false}
          onClose={() => navigate(`/business/${businessSlug}`)}
        />
      )}
    </div>
  );
}
