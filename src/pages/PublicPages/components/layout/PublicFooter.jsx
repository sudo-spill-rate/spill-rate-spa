import React from "react";
import { Link } from "react-router";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200/90 text-slate-600 text-xs py-4 sm:py-3.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Brand & Copyright */}
          <div className="flex items-center gap-2 text-slate-500 order-2 sm:order-1">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 font-bold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded"
              aria-label="SpillRate homepage"
            >
              <img
                src="/logo.png"
                alt=""
                className="w-4 h-4 object-contain shrink-0"
              />
              <span className="tracking-tight text-xs font-bold text-slate-900">
                Spill<span className="text-teal-700">Rate</span>
              </span>
            </Link>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span>© {currentYear} SpillRate</span>
          </div>

          {/* Compact Inline Navigation Links */}
          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-5 gap-y-1 font-medium text-slate-600 order-1 sm:order-2">
            <Link
              to="/explore"
              className="hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded py-0.5"
            >
              Directory
            </Link>
            <Link
              to="/about"
              className="hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded py-0.5"
            >
              About
            </Link>
            <Link
              to="/faq"
              className="hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded py-0.5"
            >
              FAQ
            </Link>
            <Link
              to="/contact"
              className="hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded py-0.5"
            >
              Contact
            </Link>
            <Link
              to="/privacy-policy"
              className="hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded py-0.5"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded py-0.5"
            >
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
