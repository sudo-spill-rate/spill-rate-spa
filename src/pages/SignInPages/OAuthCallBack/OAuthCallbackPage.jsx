import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useUserAuth } from "../../../hooks/useUserAuth";
import OAuthProcessingState from "../components/OAuthProcessingState";

export default function OAuthCallbackPage() {
  const { setToken, checkAuth, isAuthenticated } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(true);
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const processCallback = async () => {
      try {
        // 1. Check for error parameters in query string
        const searchParams = new URLSearchParams(location.search);
        const searchError =
          searchParams.get("error_description") || searchParams.get("error");

        if (searchError) {
          throw new Error(decodeURIComponent(searchError));
        }

        // 2. Check for error parameters in hash fragment
        const rawHash = location.hash || window.location.hash || "";
        const cleanHash = rawHash.startsWith("#") ? rawHash.substring(1) : rawHash;
        const hashParams = new URLSearchParams(cleanHash);

        const hashError =
          hashParams.get("error_description") || hashParams.get("error");
        if (hashError) {
          throw new Error(decodeURIComponent(hashError));
        }

        // 3. Extract access token from hash or query
        const tokenFromHash = hashParams.get("access_token");
        const tokenFromSearch =
          searchParams.get("access_token") || searchParams.get("token");

        const accessToken = tokenFromHash || tokenFromSearch;

        const targetDestination =
          sessionStorage.getItem("auth_redirect_target") || "/dashboard";

        if (accessToken) {
          // Remove hash from browser history for security
          window.history.replaceState(null, "", window.location.pathname);

          await setToken(accessToken);
          sessionStorage.removeItem("auth_redirect_target");
          navigate(targetDestination, { replace: true });
          return;
        }

        // 4. Fallback: check if existing session or storage is valid
        const alreadyAuthed = await checkAuth();
        if (alreadyAuthed) {
          sessionStorage.removeItem("auth_redirect_target");
          navigate(targetDestination, { replace: true });
          return;
        }

        throw new Error(
          "No authentication credentials found in the callback URL. Please try signing in again."
        );
      } catch (err) {
        setIsProcessing(false);
        setErrorMessage(
          err?.message ||
            "Failed to complete Google authentication. Please try signing in again."
        );
      }
    };

    processCallback();
  }, [location, setToken, checkAuth, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      {isProcessing && <OAuthProcessingState />}

      {!isProcessing && errorMessage && (
        <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" aria-hidden="true" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Authentication Incomplete
            </h1>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              {errorMessage}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              Return Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}