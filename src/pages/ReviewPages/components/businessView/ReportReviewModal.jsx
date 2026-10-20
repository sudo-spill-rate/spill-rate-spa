import React, { useState, useEffect } from "react";
import { Flag, AlertCircle, CheckCircle, RotateCw } from "lucide-react";
import { reviewService } from "../../../../services/reviewService";
import { toast } from "react-toastify";
import BaseModal from "../../../../components/common/BaseModal";

const REPORT_REASONS = [
  { value: "spam", label: "Spam or promotional content" },
  { value: "fake", label: "Fake or paid review" },
  { value: "offensive", label: "Offensive, abusive, or harmful language" },
  { value: "conflict_of_interest", label: "Conflict of interest (competitor or employee)" },
  { value: "other", label: "Other violation" },
];

export default function ReportReviewModal({ review, isOpen, onClose }) {
  const [reason, setReason] = useState("spam");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setReason("spam");
      setDetails("");
      setError(null);
      setIsSuccess(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen || !review) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await reviewService.reportReview(review.id, {
        reason,
        details: details.trim() || undefined,
      });

      if (res.success) {
        setIsSuccess(true);
        toast.success("Report submitted for moderation.");
        setTimeout(() => {
          onClose();
        }, 2200);
      } else {
        const msg = res.message || "Failed to submit report. Please try again.";
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      const msg = err?.message || "Failed to submit report. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Report this Review"
      description={
        <span>
          Review by <strong className="text-slate-800">{review.name}</strong>
        </span>
      }
      icon={
        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
          <Flag className="w-4 h-4" />
        </div>
      }
      titleId="report-review-title"
      maxWidth="max-w-md"
      isProcessing={isSubmitting}
    >
        {isSuccess ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle className="w-10 h-10 text-teal-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">Report Submitted</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Thank you for keeping the platform safe. Our moderation team will review this submission.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="report-reason" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Reason for reporting <span className="text-red-500">*</span>
              </label>
              <select
                id="report-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px]"
                required
              >
                {REPORT_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="report-details" className="block text-xs font-semibold text-slate-700 mb-1">
                Additional Details (Optional)
              </label>
              <textarea
                id="report-details"
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain why this review violates platform trust guidelines..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-800"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg min-h-[40px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs min-h-[40px] disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                {isSubmitting ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Report</span>
                )}
              </button>
            </div>
          </form>
        )}
    </BaseModal>
  );
}
