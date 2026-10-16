import React from "react";
import { Link, useLocation } from "react-router";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  return (
    <footer className="bg-slate-50 border-t border-slate-200/80 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* On Homepage: Notice row directly integrated into the footer top */}
        {isHomePage && (
          <div className="py-3 sm:py-3.5 border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs sm:text-sm text-slate-500">
            <span>
              Ratings reflect unfiltered community feedback. Scores are mathematical averages from 1 to 5 stars.
            </span>
            <Link
              to="/explore"
              className="font-semibold text-teal-700 hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded shrink-0"
            >
              Browse all businesses →
            </Link>
          </div>
        )}

        {/* Main Footer Links & Brand */}
        <div className="py-4 sm:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          {/* Brand Logo & Short Identifier */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-bold text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded p-0.5"
            >
              <img
                src="/logo.png"
                alt="SpillRate Logo"
                className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0"
              />
              <span className="tracking-tight text-base font-bold">
                Spill<span className="text-teal-700">Rate</span>
              </span>
            </Link>
            <span className="text-xs text-slate-300 hidden sm:inline" aria-hidden="true">|</span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Authentic community ratings
            </span>
          </div>

          {/* Clean Inline Navigation Links */}
          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-1 text-xs sm:text-sm">
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
        <div className="pt-3 pb-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
          <p>© {currentYear} SpillRate. Community ratings protected by device cooldowns.</p>
          <p className="text-slate-400">Philippines</p>
        </div>
      </div>
    </footer>
  );
}