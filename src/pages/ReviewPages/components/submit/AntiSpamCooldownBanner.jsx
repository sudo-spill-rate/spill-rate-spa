import React from "react";
import { ShieldCheck, Clock, AlertTriangle } from "lucide-react";

export default function AntiSpamCooldownBanner({
  isEligible = true,
  cooldownRemainingHours = 0,
}) {
  if (!isEligible) {
    return (
      <div
        role="alert"
        className="p-4 sm:p-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3"
      >
        <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-amber-950">
            Submission Cooldown Active
          </h2>
          <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
            Our device-level safeguard prevents multiple rapid submissions from the same hardware. You may submit another review for this business in approximately {cooldownRemainingHours} {cooldownRemainingHours === 1 ? "hour" : "hours"}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-xs flex items-center gap-2.5">
      <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" aria-hidden="true" />
      <span>
        <strong>Anti-Spam Verification:</strong> Submissions enforce device-based cooling intervals to ensure genuine feedback.
      </span>
    </div>
  );
}