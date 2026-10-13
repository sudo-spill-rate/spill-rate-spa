import React from "react";
import { Link } from "react-router";
import { Building2, CheckCircle2, MessageSquare } from "lucide-react";

export default function OwnerCallToAction() {
  return (
    <section className="bg-white py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50/70 rounded-2xl border border-slate-200/90 p-4 sm:p-8 lg:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            {/* Left Column: Narrative Headline & Intent */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
                Claim your business page and connect with customers.
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                Manage your official presence, monitor incoming ratings, and publicly respond to customer feedback to build neighborhood credibility.
              </p>

              <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3">
                <Link
                  to="/dashboard/business/new"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-xs sm:text-sm transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-xs"
                >
                  Register Business
                </Link>
                <Link
                  to="/about"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  Verification Standards
                </Link>
              </div>
            </div>

            {/* Right Column: Distinct Merchant Capabilities Card */}
            <div className="lg:col-span-5 bg-white p-3.5 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">Merchant Account Benefits</h3>
                  <p className="text-[11px] text-slate-500">Free management tools for verified businesses</p>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong className="text-slate-900 font-semibold">Official Verified Badge:</strong> Confirms genuine ownership and builds credibility on directory searches.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong className="text-slate-900 font-semibold">Public Response Tools:</strong> Clarify inquiries and thank patrons directly under customer reviews.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}