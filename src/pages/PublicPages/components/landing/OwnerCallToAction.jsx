import React from "react";
import { Link } from "react-router";
import { Building2, CheckCircle2, MessageSquare } from "lucide-react";

export default function OwnerCallToAction() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Narrative Headline & Intent */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              Manage your business presence and reply directly to customer feedback.
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              Local establishments can claim their listing to monitor incoming ratings, understand firsthand customer sentiment, and publicly address feedback to build neighborhood trust.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-sm transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-xs"
              >
                Register or Claim Your Business
              </Link>
              <Link
                to="/about"
                className="text-xs sm:text-sm font-medium text-slate-600 hover:text-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded p-1"
              >
                Read our verification standards
              </Link>
            </div>
          </div>

          {/* Right Column: Distinct Merchant Capabilities Card */}
          <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-7 rounded-xl border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Merchant Account Benefits</h3>
                <p className="text-xs text-slate-500">Free tools for verified Philippine businesses</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Official Verified Badge:</strong> Confirms genuine ownership and builds credibility on directory searches.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Public Response Tools:</strong> Clarify misunderstandings and thank patrons directly under their reviews.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <span>
                  <strong>No Paid Manipulation:</strong> A fair, level playing field where quality and authentic service speak for themselves.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}