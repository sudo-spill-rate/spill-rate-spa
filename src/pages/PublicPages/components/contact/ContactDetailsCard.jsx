import React from "react";
import { Link } from "react-router";
import { Mail, Clock, MapPin, HelpCircle, ShieldCheck } from "lucide-react";

export default function ContactDetailsCard() {
  return (
    <div className="bg-slate-100/90 p-6 sm:p-8 rounded-xl border border-slate-200/90 shadow-xs space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Direct Assistance</h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Have an urgent inquiry or questions about review moderation? Reach out to our operational team.
        </p>
      </div>

      <div className="space-y-4 text-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-white border border-slate-200 text-teal-700 shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">Email Support</h3>
            <p className="text-slate-600 mt-0.5">
              <a
                href="mailto:support@trustrate.local"
                className="text-teal-700 hover:text-teal-800 font-medium underline focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
              >
                support@trustrate.local
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-white border border-slate-200 text-teal-700 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">Operating Hours</h3>
            <p className="text-slate-600 mt-0.5">
              Monday to Friday, 9:00 AM to 6:00 PM (PHT)
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Inquiries submitted over the weekend are answered the following business day.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-white border border-slate-200 text-teal-700 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">Headquarters</h3>
            <p className="text-slate-600 mt-0.5">
              Metro Manila, Philippines
            </p>
          </div>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="pt-4 border-t border-slate-200 space-y-3">
        <div className="flex items-start gap-2.5 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <span>
            Business owner accounts require official document verification before merchant access is granted.
          </span>
        </div>

        <div className="flex items-start gap-2.5 text-xs text-slate-600">
          <HelpCircle className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <span>
            Looking for quick answers? Visit our{" "}
            <Link
              to="/faq"
              className="text-teal-700 hover:text-teal-800 font-medium underline focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
            >
              FAQ section
            </Link>{" "}
            for common inquiries.
          </span>
        </div>
      </div>
    </div>
  );
}