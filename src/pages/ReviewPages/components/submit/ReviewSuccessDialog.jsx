import React, { useEffect } from "react";
import { Link } from "react-router";
import { CheckCircle2 } from "lucide-react";

export default function ReviewSuccessDialog({ businessSlug, businessName, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div className="max-w-md w-full bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <h2 id="success-dialog-title" className="text-xl font-bold text-slate-900">
            Review Submitted
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Thank you for sharing your genuine experience. Your rating has been counted toward the community average for{" "}
            <span className="font-semibold text-slate-900">{businessName || "this establishment"}</span>.
          </p>
        </div>

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={`/business/${businessSlug}`}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-xs"
          >
            View Business Profile
          </Link>
          <Link
            to="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            Explore More Spots
          </Link>
        </div>
      </div>
    </div>
  );
}