import React from "react";
import { Link } from "react-router";
import { Compass, Home } from "lucide-react";

export default function PageNotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 shadow-xs text-center space-y-6">
        {/* 404 Status Badge */}
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
            Error 404
          </span>
        </div>

        {/* Main Title & Context */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Page not found
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md mx-auto">
            The link you followed may be incorrect, or the establishment listing may have been moved or updated.
          </p>
        </div>

        {/* Functional Recovery Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-sm transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-xs"
          >
            <Compass className="w-4 h-4 text-teal-400" />
            <span>Search Business Directory</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-2xs"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>Return to Homepage</span>
          </Link>
        </div>

        {/* Support Link */}
        <p className="text-xs text-slate-500 pt-4 border-t border-slate-100">
          Need assistance locating a listing?{" "}
          <Link
            to="/contact"
            className="text-teal-700 hover:text-teal-900 font-semibold underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded p-0.5 inline-block"
          >
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}
