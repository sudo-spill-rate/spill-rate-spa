import React from "react";
import { Loader2, ShieldCheck } from "lucide-react";

export default function OAuthProcessingState({ message = "Verifying your Google session..." }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="p-8 sm:p-10 bg-white rounded-xl border border-slate-200 shadow-xs text-center space-y-4 max-w-md mx-auto"
    >
      <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
        <Loader2 className="w-6 h-6 animate-spin text-teal-700" aria-hidden="true" />
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-900">Authenticating</h2>
        <p className="mt-1 text-sm text-slate-600 leading-relaxed">{message}</p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-teal-700 shrink-0" aria-hidden="true" />
        <span>Secure authentication powered by Google OAuth</span>
      </div>
    </div>
  );
}