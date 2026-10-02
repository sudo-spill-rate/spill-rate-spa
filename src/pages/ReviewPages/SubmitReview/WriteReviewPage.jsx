import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Building, AlertCircle, Send, LogIn } from "lucide-react";
import { businessService } from "../../../services/businessService";
import { reviewService } from "../../../services/reviewService";
import { useUserAuth } from "../../../hooks/useUserAuth";
import { useDeviceId } from "../../../hooks/useDeviceId";

import AntiSpamCooldownBanner from "../components/submit/AntiSpamCooldownBanner";
import InteractiveStarPicker from "../components/submit/InteractiveStarPicker";
import ReviewCommentTextarea from "../components/submit/ReviewCommentTextarea";
import PhotoAttachmentUploader from "../components/submit/PhotoAttachmentUploader";
import B2BEndorsementToggle from "../components/submit/B2BEndorsementToggle";
import ReviewSuccessDialog from "../components/submit/ReviewSuccessDialog";

export default function WriteReviewPage() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loginWithGoogle } = useUserAuth();
  const deviceId = useDeviceId();

  // 1. Fetch Business Info
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

  // 2. Eligibility / Cooldown check
  const { data: eligibilityResponse, isLoading: isEligibilityLoading } = useQuery({
    queryKey: ["review-eligibility", businessSlug, deviceId],
    queryFn: () => reviewService.checkEligibility(businessSlug, deviceId),
    enabled: Boolean(businessSlug && deviceId),
  });

  const eligibility = eligibilityResponse?.data;
  const isEligible = eligibility?.eligible ?? true;
  const cooldownHours = eligibility?.cooldown_remaining_hours ?? 0;

  // Form State
  const [name, setName] = useState(user?.name || "");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [isB2B, setIsB2B] = useState(false);
  const [reviewerBusinessId, setReviewerBusinessId] = useState("");

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

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
        reviewer_business_id: isB2B && reviewerBusinessId.trim() ? reviewerBusinessId.trim() : undefined,
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

  // Business Error
  if (isBusinessError || !business) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl border border-slate-200 shadow-xs text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h1 className="text-xl font-bold text-slate-900">Establishment Not Found</h1>
          <p className="text-sm text-slate-600">
            Cannot submit a review because the business record could not be loaded.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[40px]"
          >
            Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            to={`/business/${businessSlug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded p-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to {business.name}</span>
          </Link>
        </div>

        {/* Header Summary */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs mb-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider">
                Write a Review
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {business.name}
              </h1>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Your review helps community members make informed decisions and encourages local businesses to maintain high standards.
          </p>
        </div>

        {/* Authentication Notice if not logged in */}
        {!isAuthenticated && (
          <div className="mb-6 p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-semibold">Sign in for automatic verification</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Signing in with Google connects your name and verifies review legitimacy.
              </p>
            </div>
            <button
              type="button"
              onClick={() => loginWithGoogle(`/business/${businessId}/write-review`)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors min-h-[38px] focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In with Google</span>
            </button>
          </div>
        )}

        {/* Cooldown Status Banner */}
        <div className="mb-6">
          <AntiSpamCooldownBanner
            isEligible={isEligible}
            cooldownRemainingHours={cooldownHours}
          />
        </div>

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

          {/* Name Field */}
          <div>
            <label htmlFor="reviewer-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Your Name <span className="text-red-600">*</span>
            </label>
            <input
              id="reviewer-name"
              type="text"
              value={name}
              disabled={!isEligible || isSubmitting}
              onChange={(e) => {
                setName(e.target.value);
                if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: undefined }));
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

          {/* Interactive Star Picker */}
          <InteractiveStarPicker
            value={rating}
            onChange={(r) => {
              setRating(r);
              if (formErrors.rating) setFormErrors((prev) => ({ ...prev, rating: undefined }));
            }}
            disabled={!isEligible || isSubmitting}
            error={formErrors.rating}
          />

          {/* Feedback Textarea */}
          <ReviewCommentTextarea
            value={comment}
            onChange={(c) => {
              setComment(c);
              if (formErrors.comment) setFormErrors((prev) => ({ ...prev, comment: undefined }));
            }}
            disabled={!isEligible || isSubmitting}
            error={formErrors.comment}
          />

          {/* Photo Attachment Uploader */}
          <PhotoAttachmentUploader
            images={images}
            onChange={(imgs) => setImages(imgs)}
            disabled={!isEligible || isSubmitting}
          />

          {/* B2B Endorsement Toggle */}
          <B2BEndorsementToggle
            isB2B={isB2B}
            onToggle={setIsB2B}
            businessId={reviewerBusinessId}
            onBusinessIdChange={setReviewerBusinessId}
            disabled={!isEligible || isSubmitting}
          />

          {/* Submit Button */}
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
          businessSlug={businessSlug}
          businessName={business.name}
          onClose={() => navigate(`/business/${businessSlug}`)}
        />
      )}
    </div>
  );
}