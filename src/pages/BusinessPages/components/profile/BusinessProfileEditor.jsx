import React, { useState } from "react";
import {
  Building,

  MapPin,
  Phone,
  Globe,
  Calendar,
  Copy,
  Check,
  ShieldAlert,
} from "lucide-react";

export default function BusinessProfileEditor({ business }) {
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!business) return null;

  const publicUrl = `${window.location.origin}/business/${business.slug}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const formattedDate = business.created_at
    ? new Date(business.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="space-y-6">
      {/* 1. Main Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-slate-100">
          {/* Logo / Thumbnail */}
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
            {business.image_url && !imageError ? (
              <img
                src={business.image_url}
                alt={`Logo of ${business.name}`}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <Building className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
            )}
          </div>

          {/* Core Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                {business.name}
              </h2>
              {business.is_verified && (
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  <img
                    src="/assets/verified-shield.png"
                    alt=""
                    className="w-3.5 h-3.5 object-contain shrink-0 drop-shadow-2xs"
                    loading="lazy"
                    decoding="async"
                    aria-hidden="true"
                  />
                  <span>Verified Identity</span>
                </span>
              )}
            </div>

            {business.category && (
              <p className="mt-1 text-xs font-medium text-slate-500">
                Industry: <span className="text-slate-800">{business.category}</span>
              </p>
            )}

            {business.description && (
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {business.description}
              </p>
            )}
          </div>
        </div>

        {/* Contact and Location Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-4 sm:pt-6">
          <div className="space-y-3">
            <div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Store Location
              </span>
              <p className="text-xs text-slate-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{business.address || "No physical address provided"}</span>
              </p>
            </div>

            <div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Telephone / Mobile
              </span>
              <p className="text-xs text-slate-800 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{business.phone || "No phone number registered"}</span>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Official Website
              </span>
              <p className="text-xs text-slate-800 flex items-center gap-2 truncate">
                <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                {business.website ? (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 hover:text-teal-800 hover:underline truncate"
                  >
                    {business.website}
                  </a>
                ) : (
                  <span>No external website listed</span>
                )}
              </p>
            </div>

            {formattedDate && (
              <div>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Registered On
                </span>
                <p className="text-xs text-slate-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{formattedDate}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Public Review Link Sharing Box */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-6 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Public Customer Review Link
        </h3>
        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
          Share this dedicated link with customers via receipts, emails, or SMS to gather direct feedback.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 truncate select-all min-h-[44px] flex items-center">
            {publicUrl}
          </div>

          <button
            type="button"
            onClick={handleCopyUrl}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600 w-full sm:w-auto shrink-0 shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-teal-600" />
                <span className="text-teal-700">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Integrity Note */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <span className="font-bold text-slate-900">Cryptographic Integrity Notice:</span> Customer ratings and timestamps cannot be edited by business owners. You can moderate visibility and pin authentic testimonials using the Customer Reviews tab above.
        </div>
      </div>
    </div>
  );
}