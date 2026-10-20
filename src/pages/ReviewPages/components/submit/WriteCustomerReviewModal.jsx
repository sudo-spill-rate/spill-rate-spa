import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Send,
  RotateCw,
  Clock,
} from "lucide-react";
import { reviewService } from "../../../../services/reviewService";
import { useUserAuth } from "../../../../hooks/useUserAuth";
import { useDeviceId } from "../../../../hooks/useDeviceId";
import { toast } from "react-toastify";
import BaseModal from "../../../../components/common/BaseModal";

import InteractiveStarPicker from "./InteractiveStarPicker";
import ReviewCommentTextarea from "./ReviewCommentTextarea";
import PhotoAttachmentUploader from "./PhotoAttachmentUploader";

export default function WriteCustomerReviewModal({
  isOpen,
  onClose,
  business,
  eligibility,
  onSuccess,
}) {
  const { user } = useUserAuth();
  const deviceId = useDeviceId();

  const [name, setName] = useState(user?.name || "");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Sync user name if available
  useEffect(() => {
    if (!name && user?.name) {
      setName(user.name);
    }
  }, [user?.name, name]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setComment("");
      setImages([]);
      setFormErrors({});
      setServerError("");
      setIsSubmittedSuccess(false);
      if (user?.name) setName(user.name);
    }
  }, [isOpen, user?.name]);

  // Keyboard accessibility: Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !business) return null;

  const isEligible = eligibility?.canReview ?? eligibility?.eligible ?? true;
  const cooldownHours = eligibility?.remainingHours ?? eligibility?.cooldown_remaining_hours ?? 0;
  const businessSlug = business.slug || business.id || "";

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
        toast.success("Review published successfully!");
        if (onSuccess) onSuccess();
      } else {
        throw new Error(response.message || "Failed to submit review. Please try again.");
      }
    } catch (err) {
      const errMsg = err?.message || "An unexpected error occurred. Please try again.";
      setServerError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Write a Review"
      description={
        <span>
          for <span className="font-semibold text-slate-800">{business.name}</span>
        </span>
      }
      titleId="write-review-title"
      maxWidth="max-w-lg"
      isProcessing={isSubmitting}
      className="max-h-[92vh] flex flex-col p-0 overflow-hidden"
      headerClassName="px-5 py-3.5 sticky top-0 bg-white z-10 shrink-0"
    >
      {/* Modal Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain">
        {/* Success State */}
        {isSubmittedSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Review Published Successfully
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you for your feedback! Your review has been added to{" "}
                  <strong className="text-slate-900">{business.name}</strong>.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm sm:text-xs rounded-lg transition-colors cursor-pointer min-h-[44px] sm:min-h-[38px] shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Cooldown banner only if on active cooldown */}
              {!isEligible && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    Review cooldown active. You can submit another review in {cooldownHours} {cooldownHours === 1 ? "hour" : "hours"}.
                  </span>
                </div>
              )}

              {/* Review Submission Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {serverError && (
                  <div
                    role="alert"
                    className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{serverError}</span>
                  </div>
                )}

                {/* Customer Name */}
                <div>
                  <label
                    htmlFor="modal-customer-name"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    Your Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="modal-customer-name"
                    name="customerName"
                    type="text"
                    value={name}
                    disabled={!isEligible || isSubmitting}
                    aria-invalid={!!formErrors.name}
                    aria-describedby={formErrors.name ? "modal-customer-name-error" : undefined}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (formErrors.name) {
                        setFormErrors((prev) => ({ ...prev, name: undefined }));
                      }
                    }}
                    placeholder="e.g., Maria Santos"
                    className={`w-full px-3 py-2 bg-white border rounded-lg text-base sm:text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px] sm:min-h-[38px] disabled:bg-slate-50 ${
                      formErrors.name ? "border-red-500" : "border-slate-300"
                    }`}
                  />
                  {formErrors.name && (
                    <p id="modal-customer-name-error" className="text-[11px] text-red-600 mt-1" role="alert">
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

                {/* Feedback Comment */}
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
                  placeholder="Share your firsthand experience with this business. What did you order or request? How was the service, quality, and overall value?"
                />

                {/* Photos */}
                <PhotoAttachmentUploader
                  images={images}
                  onChange={(imgs) => setImages(imgs)}
                  disabled={!isEligible || isSubmitting}
                />

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors min-h-[44px] sm:min-h-[38px] cursor-pointer flex items-center justify-center"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={!isEligible || isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 sm:py-2 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-semibold text-sm sm:text-xs rounded-lg transition-colors min-h-[44px] sm:min-h-[38px] focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <RotateCw className="w-4 h-4 sm:w-3.5 sm:h-3.5 animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        <span>Publish Review</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
    </BaseModal>
  );
}
