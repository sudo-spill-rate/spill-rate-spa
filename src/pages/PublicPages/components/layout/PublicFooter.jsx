import React from "react";
import { Link } from "react-router";
import { Star, ShieldCheck } from "lucide-react";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        {/* Main Content Grid: 12-column layout tailored to actual content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-slate-200/80">
          {/* Brand & Purpose: spans 5 columns on desktop */}
          <div className="md:col-span-5 space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 font-bold text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded p-0.5"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-teal-400">
                <Star className="w-4 h-4 fill-teal-400 text-teal-400" />
              </div>
              <span className="tracking-tight text-xl">
                Trust<span className="text-teal-700">Rate</span>
              </span>
            </Link>

            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              An open community ratings directory for local businesses and consumers. All scores are direct arithmetic averages protected by device cooldown anti-spam safeguards.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" aria-hidden="true" />
              <span>Strict zero pay-to-remove policy for all reviews</span>
            </div>
          </div>

          {/* Navigation Group 1: For Consumers (3 columns) */}
          <div className="md:col-span-2 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wide text-slate-900">
              For Patrons
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/explore"
                  className="text-slate-600 hover:text-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
                >
                  Explore Directory
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-slate-600 hover:text-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
                >
                  How Trust Works
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-slate-600 hover:text-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
                >
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-slate-600 hover:text-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
                >
                  Report an Issue
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Group 2: For Business Owners (3 columns) */}
          <div className="md:col-span-3 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wide text-slate-900">
              For Business Owners
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
                >
                  Register Your Establishment
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
                >
                  Merchant Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-slate-600 hover:text-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
                >
                  Verification Standards
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-slate-600 hover:text-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
                >
                  Merchant Support Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Group 3: Legal & Privacy (2 columns) */}
          <div className="md:col-span-2 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wide text-slate-900">
              Governance
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-slate-600 hover:text-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-slate-600 hover:text-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@trustrate.local"
                  className="text-slate-600 hover:text-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
                >
                  Direct Inquiries
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Attribution & Integrity Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} TrustRate Platform. Dedicated to genuine local community feedback.</p>
          <div className="flex flex-wrap items-center gap-4 text-slate-500">
            <span>Operating Region: Philippines</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Support: support@trustrate.local</span>
          </div>
        </div>
      </div>
    </footer>
  );
}