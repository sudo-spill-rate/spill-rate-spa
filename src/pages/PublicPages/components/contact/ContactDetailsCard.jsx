import React from "react";
import { Link } from "react-router";

export default function ContactDetailsCard() {
  return (
    <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-1">
          Direct Assistance
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Have an inquiry about a business profile or review moderation? Our operational team is available to assist.
        </p>
      </div>

      <div className="space-y-3.5 text-sm">
        <div className="pb-3 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">Email Support</h3>
          <p className="text-slate-600 mt-1 text-xs sm:text-sm">
            <a
              href="mailto:spillrate@gmail.com"
              className="text-teal-700 hover:text-teal-800 font-medium underline focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
            >
              spillrate@gmail.com
            </a>
          </p>
        </div>

        <div className="pb-3 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">Operating Hours</h3>
          <p className="text-slate-700 mt-1 text-xs sm:text-sm">
            Monday to Friday, 9:00 AM to 6:00 PM (PHT)
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Weekend inquiries are answered on the following business day.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">Headquarters</h3>
          <p className="text-slate-700 mt-1 text-xs sm:text-sm">
            Metro Manila, Philippines
          </p>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 leading-relaxed">
        <p>
          Business owner accounts require official document verification before merchant access is granted.
        </p>
        <p>
          Looking for quick answers? Visit our{" "}
          <Link
            to="/faq"
            className="text-teal-700 hover:text-teal-800 font-medium underline focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
          >
            FAQ section
          </Link>{" "}
          for common inquiries.
        </p>
      </div>
    </div>
  );
}