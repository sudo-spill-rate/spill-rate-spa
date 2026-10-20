import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useUserAuth } from "../../../../hooks/useUserAuth";
import GoogleSignInButton from "../../../SignInPages/components/GoogleSignInButton";
import AuthLegalNotice from "../../../SignInPages/components/AuthLegalNotice";
import BaseModal from "../../../../components/common/BaseModal";

export default function SignInModal({ isOpen, onClose, redirectPath = "/dashboard" }) {
  const { loginWithGoogle, isAuthenticated, isLoading } = useUserAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Close modal if user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated, onClose]);

  const handleGoogleSignIn = async () => {
    try {
      setErrorMessage("");
      setIsRedirecting(true);
      await loginWithGoogle(redirectPath);
    } catch (err) {
      setIsRedirecting(false);
      setErrorMessage(
        err?.message || "Failed to initialize Google authentication. Please try again."
      );
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      titleId="sign-in-modal-title"
      maxWidth="max-w-sm"
      isProcessing={isRedirecting || isLoading}
      className="p-6 sm:p-7 space-y-5"
    >
      {/* Modal Header */}
      <div className="text-center space-y-1.5 pt-1">
        <div className="flex justify-center mb-2">
          <img
            src="/logo.png"
            alt="SpillRate Logo"
            className="w-10 h-10 object-contain"
          />
        </div>
        <h2 id="sign-in-modal-title" className="text-xl font-bold tracking-tight text-slate-900">
          Sign In to SpillRate
        </h2>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Manage your business listings and community endorsements.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
          <span className="flex-1">{errorMessage}</span>
        </div>
      )}

      {/* Google Sign In Button */}
      <div>
        <GoogleSignInButton
          onClick={handleGoogleSignIn}
          isLoading={isRedirecting || isLoading}
        />
      </div>

      {/* Legal Notice */}
      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 text-center">
        <AuthLegalNotice />
      </div>
    </BaseModal>
  );
}
