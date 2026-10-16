import React from "react";
import { Link } from "react-router";
import { Compass, Home } from "lucide-react";

export default function PageNotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 px-4 py-8">
      {/* Top Header Lockup */}
      <header className="max-w-7xl mx-auto w-full">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 font-bold text-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded p-1"
        >
          <img
            src="/logo.png"
            alt="SpillRate Logo"
            className="w-8 h-8 object-contain shrink-0"
          />
          <span className="tracking-tight text-xl">
            Trust<span className="text-teal-700">Rate</span>
          </span>
        </Link>
      </header>

      {/* Main 404 Recovery Card */}
      <main className="max-w-lg mx-auto w-full text-center py-12">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-2">
          Error 404
        </p>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Page not found
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-md mx-auto">
          The link you followed may be incorrect, or the page may have been moved. You can search the local directory or return to the homepage.
        </p>

        {/* Functional Recovery Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-sm transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-xs"
          >
            <Compass className="w-4 h-4 text-teal-400" />
            <span>Search Business Directory</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-medium text-sm transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>Return to Homepage</span>
          </Link>
        </div>

        {/* Support Link */}
        <p className="mt-8 text-xs text-slate-500">
          Need help locating a listing?{" "}
          <Link
            to="/contact"
            className="text-teal-700 hover:text-teal-900 font-medium underline focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
          >
            Contact support
          </Link>
        </p>
      </main>

      {/* Bottom Footer Note */}
      <footer className="max-w-7xl mx-auto w-full text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} SpillRate. Transparent community ratings & reviews.</p>
      </footer>
    </div>
  );
}