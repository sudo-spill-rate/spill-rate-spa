import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Star } from "lucide-react";
import { useUserAuth } from "../../../hooks/useUserAuth";
import SignInCard from "../components/SignInCard";

export default function SignInPage() {
  const { loginWithGoogle, isAuthenticated, isLoading } = useUserAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const errorParam = searchParams.get("error");
  const redirectParam = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    if (errorParam) {
      setErrorMessage(decodeURIComponent(errorParam));
    }
  }, [errorParam]);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(redirectParam, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectParam]);

  const handleGoogleSignIn = async () => {
    try {
      setErrorMessage("");
      setIsRedirecting(true);
      await loginWithGoogle(redirectParam);
    } catch (err) {
      setIsRedirecting(false);
      setErrorMessage(
        err?.message || "Failed to initialize Google authentication. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 px-4 py-8">
      {/* Top Header Lockup */}
      <header className="max-w-7xl mx-auto w-full">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 font-bold text-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded p-1"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-teal-400">
            <Star className="w-4 h-4 fill-teal-400 text-teal-400" />
          </div>
          <span className="tracking-tight text-xl font-bold">
            Trust<span className="text-teal-700">Rate</span>
          </span>
        </Link>
      </header>

      {/* Centered Sign In Content */}
      <main className="max-w-md mx-auto w-full my-8">
        <SignInCard
          errorMessage={errorMessage}
          onDismissError={() => setErrorMessage("")}
          onGoogleSignIn={handleGoogleSignIn}
          isLoading={isRedirecting || isLoading}
        />
      </main>

      {/* Footer Utility Link */}
      <footer className="max-w-7xl mx-auto w-full text-center text-xs text-slate-500 space-y-1">
        <p>© {new Date().getFullYear()} TrustRate. Dedicated to genuine local feedback.</p>
        <p>
          Need assistance?{" "}
          <Link
            to="/contact"
            className="text-teal-700 hover:text-teal-900 font-medium underline focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
          >
            Contact support
          </Link>
        </p>
      </footer>
    </div>
  );
}