import React from "react";
import { AlertCircle } from "lucide-react";

export default function ReviewCommentTextarea({
  value = "",
  onChange,
  maxLength = 500,
  error,
  disabled = false,
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor="review-comment"
          className="block text-xs font-bold uppercase tracking-wider text-slate-700"
        >
          Your Feedback <span className="text-red-600">*</span>
        </label>
        <span
          className={`text-xs ${
            value.length > maxLength * 0.9 ? "text-amber-600 font-semibold" : "text-slate-400"
          }`}
        >
          {value.length} / {maxLength}
        </span>
      </div>

      <textarea
        id="review-comment"
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? "review-comment-error" : undefined}
        placeholder="Share your firsthand experience with this business. What did you order or request? How was the service, quality, and overall value?"
        className={`w-full p-3.5 bg-white border rounded-xl text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 leading-relaxed disabled:bg-slate-50 disabled:text-slate-500 ${
          error ? "border-red-500" : "border-slate-300"
        }`}
      />

      {error && (
        <p id="review-comment-error" className="text-xs text-red-600 flex items-center gap-1 mt-1" role="alert">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}