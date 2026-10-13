import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { useUserAuth } from "../../../../hooks/useUserAuth";
import GoogleSignInButton from "../../../SignInPages/components/GoogleSignInButton";
import AuthLegalNotice from "../../../SignInPages/components/AuthLegalNotice";

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

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sign-in-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Dimmed Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xl z-10 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="flex justify-center mb-2">
            <img
              src="/logo.png"
              alt="TrustRate Logo"
              className="w-10 h-10 object-contain"
            />
          </div>
          <h2 id="sign-in-modal-title" className="text-xl font-bold tracking-tight text-slate-900">
            Sign In to TrustRate
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
      </div>
    </div>
  );
}
