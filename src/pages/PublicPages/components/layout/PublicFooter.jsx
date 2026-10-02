import React from "react";
import { Link } from "react-router";
import { Star } from "lucide-react";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200/80 py-6 sm:py-8 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand Logo & Short Identifier */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-bold text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded p-0.5"
            >
              <div className="w-6 h-6 rounded-md bg-slate-900 flex items-center justify-center text-teal-400">
                <Star className="w-3.5 h-3.5 fill-teal-400 text-teal-400" />
              </div>
              <span className="tracking-tight text-base font-bold">
                Trust<span className="text-teal-700">Rate</span>
              </span>
            </Link>
            <span className="text-xs text-slate-400 hidden sm:inline" aria-hidden="true">|</span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Authentic community ratings
            </span>
          </div>

          {/* Clean Inline Navigation Links */}
          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-1.5 text-xs sm:text-sm">
            <Link
              to="/explore"
              className="text-slate-600 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded py-0.5"
            >
              Directory
            </Link>
            <Link
              to="/about"
              className="text-slate-600 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded py-0.5"
            >
              About
            </Link>
            <Link
              to="/faq"
              className="text-slate-600 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded py-0.5"
            >
              FAQ
            </Link>
            <Link
              to="/contact"
              className="text-slate-600 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded py-0.5"
            >
              Contact
            </Link>
            <Link
              to="/privacy-policy"
              className="text-slate-500 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded py-0.5"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-slate-500 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded py-0.5"
            >
              Terms
            </Link>
          </nav>
        </div>

        {/* Minimized Copyright & Metadata Row */}
        <div className="mt-4 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
          <p>© {currentYear} TrustRate. Community ratings protected by device cooldowns.</p>
          <p className="text-slate-400">Philippines</p>
        </div>
      </div>
    </footer>
  );
}