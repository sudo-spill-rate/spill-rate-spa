import React from "react";
import GoogleSignInButton from "./GoogleSignInButton";
import AuthErrorAlert from "./AuthErrorAlert";
import AuthLegalNotice from "./AuthLegalNotice";
import { ShieldCheck, UserCheck } from "lucide-react";

export default function SignInCard({
  errorMessage,
  onDismissError,
  onGoogleSignIn,
  isLoading = false,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Sign In to TrustRate
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
          Authenticate using your Google account to submit verified community reviews or manage your business profile.
        </p>
      </div>

      {errorMessage && (
        <AuthErrorAlert message={errorMessage} onDismiss={onDismissError} />
      )}

      <div>
        <GoogleSignInButton
          onClick={onGoogleSignIn}
          isLoading={isLoading}
        />
      </div>

      {/* Purpose & Privacy Safeguards */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2.5 text-xs text-slate-600">
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            <strong>Anti-Spam Verification:</strong> Verified accounts paired with device cooldowns prevent fake boosts and review-bombing.
          </span>
        </div>
        <div className="flex items-start gap-2">
          <UserCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            <strong>Merchant Recognition:</strong> Business owners can request verification to reply publicly to customers.
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <AuthLegalNotice />
      </div>
    </div>
  );
}