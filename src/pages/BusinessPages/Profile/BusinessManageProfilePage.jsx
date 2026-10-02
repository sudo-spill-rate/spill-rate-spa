import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
  ChevronLeft,
  ExternalLink,
  RotateCw,
  AlertTriangle,
  Building,
  CheckCircle2,
  Copy,
  Check,
  MapPin,
  Phone,
  Globe,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ReviewModerationHub from "../components/profile/ReviewModerationHub";
import BusinessRatingStatsCard from "../components/profile/BusinessRatingStatsCard";
import { ReviewProvider } from "../../../context/review/reviewContextProvider";
import { useBusinessProfile } from "../../../hooks/useBusinessProfile";

export default function BusinessManageProfilePage() {
  const { id } = useParams();
  const {
    selectedBusiness,
    fetchBusinessBySlug,
    clearSelectedBusiness,
    isLoading,
    error,
  } = useBusinessProfile();

  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBusinessBySlug(id);
    }
    return () => {
      clearSelectedBusiness();
    };
  }, [id, fetchBusinessBySlug, clearSelectedBusiness]);

  const handleCopyUrl = async () => {
    if (!selectedBusiness?.slug) return;
    const url = `${window.location.origin}/business/${selectedBusiness.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is denied
    }
  };

  return (
    <DashboardLayout activeBusinessSlug={id}>
      {/* 1. Breadcrumb / Back Link */}
      <div className="mb-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded p-1 min-h-[44px]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* 2. Loading State */}
      {isLoading && !selectedBusiness && (
        <div className="space-y-6" aria-busy="true" aria-label="Loading business profile">
          <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse space-y-4">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-slate-200 rounded-xl" />
              <div className="space-y-2">
                <div className="h-6 w-56 bg-slate-200 rounded" />
                <div className="h-4 w-32 bg-slate-100 rounded" />
              </div>
            </div>
          </div>
          <div className="h-48 bg-white rounded-xl border border-slate-200 animate-pulse" />
        </div>
      )}

      {/* 3. Error State */}
      {!isLoading && error && (
        <div
          role="alert"
          className="p-6 bg-white rounded-xl border border-red-200 shadow-sm flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h2 className="text-base font-bold text-slate-900">
              Business profile not found
            </h2>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              {error || "The requested business profile could not be loaded. It may have been deleted or the link is incorrect."}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => id && fetchBusinessBySlug(id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors min-h-[44px]"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
              <Link
                to="/dashboard"
                className="px-4 py-2 text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 4. Unified Profile & Review Management Hub */}
      {!isLoading && selectedBusiness && (
        <div className="space-y-4">
          {/* Single Consolidated Business Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-xs space-y-2.5 sm:space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
              <div className="flex items-start gap-3 sm:gap-3.5 flex-1 min-w-0">
                {/* Storefront Logo or Fallback */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                  {selectedBusiness.image_url && !imageError ? (
                    <img
                      src={selectedBusiness.image_url}
                      alt={`Logo of ${selectedBusiness.name}`}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <Building className="w-6 h-6 text-slate-400" />
                  )}
                </div>

                {/* Name, Verified Badge, Category, and Slug */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight break-words">
                      {selectedBusiness.name}
                    </h1>
                    {selectedBusiness.is_verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    )}
                    {selectedBusiness.category && (
                      <span className="text-[10px] sm:text-[11px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                        {selectedBusiness.category}
                      </span>
                    )}
                  </div>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Slug: <span className="font-mono text-slate-700 break-all">{selectedBusiness.slug}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons: 2-column grid on mobile, inline on sm+ */}
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors min-h-[44px] shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-teal-600" />
                      <span className="text-teal-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                <Link
                  to={`/business/${selectedBusiness.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors min-h-[44px] shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-600 truncate"
                >
                  <span className="truncate">View Public</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                </Link>
              </div>
            </div>

            {/* Short Description */}
            {selectedBusiness.description && (
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap break-words line-clamp-3 sm:line-clamp-none">
                  {selectedBusiness.description}
                </p>
              </div>
            )}

            {/* Contact Details & Location: compact inline wrap */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <span className="inline-flex items-center gap-1.5 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate max-w-xs">{selectedBusiness.address || "No physical address provided"}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 min-w-0">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{selectedBusiness.phone || "No phone registered"}</span>
              </span>

              {selectedBusiness.website ? (
                <a
                  href={selectedBusiness.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-800 hover:underline min-w-0 truncate"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate max-w-xs">{selectedBusiness.website.replace(/^https?:\/\//, "")}</span>
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-slate-400 min-w-0">
                  <Globe className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span>No website registered</span>
                </span>
              )}
            </div>
          </div>

          {/* 2. Rating Statistics & Performance Summary */}
          <ReviewProvider key={selectedBusiness.slug}>
            <BusinessRatingStatsCard business={selectedBusiness} />

            {/* 3. Customer Reviews & Moderation Feed */}
            <ReviewModerationHub businessSlug={selectedBusiness.slug} />
          </ReviewProvider>
        </div>
      )}
    </DashboardLayout>
  );
}