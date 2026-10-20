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
          <div className="py-3.5 border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-slate-600">
            <span className="leading-relaxed">
              Ratings reflect unfiltered community feedback. Scores are mathematical averages from 1 to 5 stars.
            </span>
            <Link
              to="/explore"
              className="font-semibold text-teal-700 hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded shrink-0 min-h-[44px] inline-flex items-center"
            >
              Browse all businesses →
            </Link>
          </div>
        )}

        {/* Main Footer Links & Brand */}
        <div className="py-5 sm:py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-5">
          {/* Brand Logo & Short Identifier */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-bold text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded min-h-[44px] md:min-h-0 p-1 md:p-0.5"
              aria-label="SpillRate homepage"
            >
              <img
                src="/logo.png"
                alt="SpillRate Logo"
                className="w-6 h-6 object-contain shrink-0"
              />
              <span className="tracking-tight text-base font-bold">
                Spill<span className="text-teal-700">Rate</span>
              </span>
            </Link>
            <span className="text-xs text-slate-300 hidden sm:inline" aria-hidden="true">|</span>
            <span className="text-xs text-slate-600 hidden sm:inline">
              Authentic community ratings
            </span>
          </div>

          {/* Desktop & Mobile Responsive Navigation Links */}
          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-x-5 sm:gap-x-6 lg:gap-x-8 gap-y-2 text-xs sm:text-sm font-medium">
            <Link
              to="/explore"
              className="text-slate-600 hover:text-slate-950 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded py-2 md:py-1 min-h-[44px] md:min-h-0 inline-flex items-center"
            >
              Directory
            </Link>
            <Link
              to="/about"
              className="text-slate-600 hover:text-slate-950 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded py-2 md:py-1 min-h-[44px] md:min-h-0 inline-flex items-center"
            >
              About
            </Link>
            <Link
              to="/faq"
              className="text-slate-600 hover:text-slate-950 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded py-2 md:py-1 min-h-[44px] md:min-h-0 inline-flex items-center"
            >
              FAQ
            </Link>
            <Link
              to="/contact"
              className="text-slate-600 hover:text-slate-950 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded py-2 md:py-1 min-h-[44px] md:min-h-0 inline-flex items-center"
            >
              Contact
            </Link>
            <Link
              to="/privacy-policy"
              className="text-slate-600 hover:text-slate-950 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded py-2 md:py-1 min-h-[44px] md:min-h-0 inline-flex items-center"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-slate-600 hover:text-slate-950 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded py-2 md:py-1 min-h-[44px] md:min-h-0 inline-flex items-center"
            >
              Terms
            </Link>
          </nav>
        </div>

        {/* Minimized Copyright & Metadata Row */}
        <div className="pt-3.5 pb-5 border-t border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-600">
          <p>© {currentYear} SpillRate. Community ratings protected by device cooldowns.</p>
          <p className="text-slate-500 font-medium">Philippines</p>
        </div>
      </div>
    </footer>
  );
}