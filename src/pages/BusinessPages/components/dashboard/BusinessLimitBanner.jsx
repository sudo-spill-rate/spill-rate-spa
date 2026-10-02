import React from "react";
import { Link } from "react-router";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function BusinessLimitBanner({ count = 0, maxLimit = 5 }) {
  const isAtLimit = count >= maxLimit;
  const remaining = Math.max(0, maxLimit - count);
  const percentage = Math.min(100, Math.round((count / maxLimit) * 100));

  if (isAtLimit) {
    return (
      <div
        role="alert"
        className="mb-6 sm:mb-8 p-3.5 sm:p-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-amber-900">
              Free Tier Quota Reached ({count} of {maxLimit} profiles active)
            </h3>
            <p className="mt-0.5 text-xs text-amber-800 leading-relaxed">
              Standard accounts are limited to 5 registered businesses. All existing profiles continue to receive and display customer feedback without interruption.
            </p>
          </div>
        </div>

        <Link
          to="/contact"
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg border border-amber-300 transition-colors shrink-0 min-h-[44px] w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-amber-600"
        >
          Request Quota Increase
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden sm:flex mb-6 sm:mb-8 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900">
              Account Capacity: {count} of {maxLimit} profiles registered
            </h3>
            <span className="text-[10px] sm:text-[11px] font-medium text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full shrink-0">
              {remaining} {remaining === 1 ? "slot" : "slots"} available
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            Standard accounts can register up to {maxLimit} business profiles to gather verified customer feedback.
          </p>
        </div>
      </div>

      {/* Visual Capacity Meter */}
      <div className="w-full sm:w-44 shrink-0 space-y-1 sm:space-y-1.5">
        <div className="flex justify-between text-[11px] font-medium text-slate-500">
          <span>Capacity</span>
          <span className="font-semibold text-slate-700">{percentage}%</span>
        </div>
        <div
          className="w-full bg-slate-200 rounded-full h-2 overflow-hidden"
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={maxLimit}
          aria-label="Account business capacity"
        >
          <div
            className="h-full bg-teal-600 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}