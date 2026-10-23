import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  CheckCircle2,
  XCircle,
  RotateCw,
  AlertCircle,
  Eye,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { useAdmin } from "../../../../hooks/useAdmin";
import BaseModal from "../../../../components/common/BaseModal";
import SegmentedTabs from "../../../../components/common/SegmentedTabs";

export default function AdminReportsSection() {
  const { reports, isLoadingReports, reportsError, refetchReports, resolveReport, isResolving } = useAdmin();
  const [filter, setFilter] = useState("all");
  const [processingId, setProcessingId] = useState(null);
  const [selectedReviewText, setSelectedReviewText] = useState(null);
  const [actionToConfirm, setActionToConfirm] = useState(null);

  const reportList = Array.isArray(reports) ? reports : [];

  const filteredReports = reportList.filter((r) => {
    if (filter === "all") return true;
    return r.status?.toLowerCase() === filter.toLowerCase();
  });

  const handleConfirmAction = async () => {
    if (!actionToConfirm) return;
    const { reportId, action } = actionToConfirm;

    setProcessingId(reportId);
    try {
      await resolveReport({ reportId, action });
      toast.success(
        action === "resolved"
          ? "Report resolved and review moderated."
          : "Report dismissed successfully."
      );
      refetchReports();
      setActionToConfirm(null);
    } catch (err) {
      toast.error(err?.message || "Failed to process report action.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters and Refresh bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-2 sm:p-2.5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Reusable Accessible Segmented Control Tabs */}
        <SegmentedTabs
          tabs={[
            { id: "all", label: "All", count: reportList.length },
            {
              id: "pending",
              label: "Pending",
              count: reportList.filter((r) => (r.status || "pending").toLowerCase() === "pending").length,
            },
            {
              id: "resolved",
              label: "Resolved",
              count: reportList.filter((r) => r.status?.toLowerCase() === "resolved").length,
            },
            {
              id: "dismissed",
              label: "Dismissed",
              count: reportList.filter((r) => r.status?.toLowerCase() === "dismissed").length,
            },
          ]}
          activeTab={filter}
          onChange={setFilter}
          ariaLabel="Filter flagged reports by status"
        />
      </div>

      {/* Error state */}
      {reportsError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>Failed to load reports: {reportsError}</span>
        </div>
      )}

      {/* Reports Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {isLoadingReports ? (
          <div className="p-12 text-center text-xs text-slate-500">
            <RotateCw className="w-6 h-6 animate-spin text-teal-700 mx-auto mb-2" />
            <span>Loading moderation reports...</span>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="font-bold text-sm text-slate-900">
              No moderation tickets found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {filter === "all"
                ? "There are currently no flagged reviews on the platform."
                : `No reports matching status "${filter}".`}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile View: High-density Card List (Zero horizontal blowout) */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredReports.map((report) => {
                const businessName =
                  report.business?.name ||
                  report.business_name ||
                  (report.business?.slug ? `/${report.business.slug}` : null);
                const businessSlug = report.business?.slug;
                const previewText =
                  report.review?.comment ||
                  report.review_text ||
                  report.details;

                return (
                  <div key={report.id} className="p-3.5 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        {businessSlug ? (
                          <a
                            href={`/business/${businessSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-xs text-slate-900 hover:text-teal-700 hover:underline inline-flex items-center gap-1 truncate"
                          >
                            <span className="truncate">{businessName || "Storefront"}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                          </a>
                        ) : (
                          <span className="font-bold text-xs text-slate-900 block truncate">
                            {businessName || "Storefront (Unlisted)"}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-mono block">
                          {businessSlug ? `/${businessSlug}` : report.business_id ? `ID: ${report.business_id.slice(0, 8)}...` : ""}
                        </span>
                      </div>

                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border shrink-0 ${
                          report.status === "pending"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : report.status === "resolved"
                            ? "bg-teal-50 text-teal-800 border-teal-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {report.status || "Pending"}
                      </span>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800 capitalize">
                          Reason: {report.reason}
                        </span>
                        {report.created_at && (
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5" />
                            {new Date(report.created_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {previewText && (
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedReviewText({
                              comment: previewText,
                              author: report.review?.name || "Customer",
                              rating: report.review?.rating,
                              businessName: businessName || "Storefront",
                              reason: report.reason,
                            })
                          }
                          className="text-[11px] text-teal-700 hover:text-teal-800 font-semibold inline-flex items-center gap-1 cursor-pointer pt-0.5"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Preview flagged review</span>
                        </button>
                      )}
                    </div>

                    {report.status === "pending" ? (
                      <div className="grid grid-cols-2 gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={() => setActionToConfirm({ reportId: report.id, action: "resolved" })}
                          disabled={isResolving && processingId === report.id}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-700"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Resolve</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActionToConfirm({ reportId: report.id, action: "dismissed" })}
                          disabled={isResolving && processingId === report.id}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-slate-400"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Dismiss</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-400 font-medium pt-0.5">
                        Status: Archived ({report.status})
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop View: Full Data Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse" aria-label="Flagged reviews table">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    <th scope="col" className="px-4 py-3">Storefront</th>
                    <th scope="col" className="px-4 py-3">Reason</th>
                    <th scope="col" className="px-4 py-3">Reporter</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3">Reported At</th>
                    <th scope="col" className="px-4 py-3 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReports.map((report) => {
                    const businessName =
                      report.business?.name ||
                      report.business_name ||
                      (report.business?.slug ? `/${report.business.slug}` : null);
                    const businessSlug = report.business?.slug;
                    const previewText =
                      report.review?.comment ||
                      report.review_text ||
                      report.details;

                    return (
                      <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Storefront Name or Honest Fallback */}
                        <td className="px-4 py-3.5 font-semibold text-slate-900">
                          {businessName ? (
                            <div className="min-w-0">
                              {businessSlug ? (
                                <a
                                  href={`/business/${businessSlug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-slate-900 hover:text-teal-700 font-semibold hover:underline inline-flex items-center gap-1 max-w-[200px] truncate"
                                  title={`Open ${businessName}`}
                                >
                                  <span className="truncate">{businessName}</span>
                                  <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                                </a>
                              ) : (
                                <span className="block truncate max-w-[200px]" title={businessName}>
                                  {businessName}
                                </span>
                              )}
                              {businessSlug && (
                                <span className="text-[11px] text-slate-500 font-mono block truncate">
                                  /{businessSlug}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="min-w-0">
                              <span className="text-slate-700 font-medium block">
                                Storefront (Unlisted)
                              </span>
                              <span
                                className="text-[10px] text-slate-500 font-mono block truncate max-w-[140px]"
                                title={report.business_id}
                              >
                                ID: {report.business_id ? `${report.business_id.slice(0, 8)}...` : "N/A"}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Reason & Flagged Preview Button */}
                        <td className="px-4 py-3.5">
                          <div className="space-y-1">
                            <span className="font-semibold text-slate-900 block truncate max-w-xs capitalize">
                              {report.reason}
                            </span>
                            {previewText && (
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedReviewText({
                                    comment: previewText,
                                    author: report.review?.name || "Customer",
                                    rating: report.review?.rating,
                                    businessName: businessName || "Storefront",
                                    reason: report.reason,
                                  })
                                }
                                className="text-[11px] text-teal-700 hover:text-teal-800 hover:underline inline-flex items-center gap-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-700 rounded py-0.5"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Preview flagged review</span>
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Reporter Information */}
                        <td className="px-4 py-3.5 text-slate-600 font-mono text-[11px]">
                          {report.reporter_email ? (
                            <span className="truncate block max-w-[150px]" title={report.reporter_email}>
                              {report.reporter_email}
                            </span>
                          ) : report.reporter_ip ? (
                            <span title={`Reporter IP: ${report.reporter_ip}`} className="text-slate-500 font-mono text-[10px]">
                              IP: {report.reporter_ip}
                            </span>
                          ) : (
                            <span className="text-slate-500 font-sans">Community User</span>
                          )}
                        </td>

                        {/* Ticket Status */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                              report.status === "pending"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : report.status === "resolved"
                                ? "bg-teal-50 text-teal-800 border-teal-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {report.status || "Pending"}
                          </span>
                        </td>

                        {/* Reported Date */}
                        <td className="px-4 py-3.5 text-slate-500 text-[11px] whitespace-nowrap">
                          {report.created_at ? (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-500" />
                              <span>{new Date(report.created_at).toLocaleDateString()}</span>
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>

                        {/* Moderation Actions */}
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          {report.status === "pending" ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setActionToConfirm({ reportId: report.id, action: "resolved" })}
                                disabled={isResolving && processingId === report.id}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40 min-h-[36px] focus:outline-none focus:ring-2 focus:ring-teal-700"
                                title="Resolve ticket and apply moderation"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Resolve</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setActionToConfirm({ reportId: report.id, action: "dismissed" })}
                                disabled={isResolving && processingId === report.id}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40 min-h-[36px] focus:outline-none focus:ring-2 focus:ring-slate-400"
                                title="Dismiss false report"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Dismiss</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-medium">Archived</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Action Confirmation Modal */}
      {actionToConfirm && (
        <BaseModal
          isOpen={Boolean(actionToConfirm)}
          onClose={() => setActionToConfirm(null)}
          title={
            actionToConfirm.action === "resolved"
              ? "Resolve & Penalize Review?"
              : "Dismiss Flagged Report?"
          }
          titleId="confirm-report-action-title"
          maxWidth="max-w-md"
          isProcessing={isResolving}
        >
          <div className="space-y-3 text-xs">
            <p className="text-slate-600 leading-relaxed">
              {actionToConfirm.action === "resolved" ? (
                <>
                  Are you sure you want to <strong className="text-red-700">resolve</strong> this report? The offending customer review will be penalized or removed from public view.
                </>
              ) : (
                <>
                  Are you sure you want to <strong className="text-slate-800">dismiss</strong> this report? The review will remain published and active on the directory.
                </>
              )}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 font-semibold">
              <button
                type="button"
                onClick={() => setActionToConfirm(null)}
                disabled={isResolving}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 min-h-[44px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={isResolving}
                className={`w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg text-white min-h-[44px] cursor-pointer disabled:opacity-50 ${
                  actionToConfirm.action === "resolved"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-teal-700 hover:bg-teal-800"
                }`}
              >
                {isResolving ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>
                    {actionToConfirm.action === "resolved"
                      ? "Resolve & Remove"
                      : "Dismiss Report"}
                  </span>
                )}
              </button>
            </div>
          </div>
        </BaseModal>
      )}

      {/* Enriched Review Preview Modal */}
      {selectedReviewText && (
        <BaseModal
          isOpen={Boolean(selectedReviewText)}
          onClose={() => setSelectedReviewText(null)}
          title="Flagged Review Details"
          maxWidth="max-w-lg"
        >
          <div className="space-y-3.5 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-semibold text-slate-800">
                  Storefront: {selectedReviewText.businessName}
                </span>
                {typeof selectedReviewText.rating === "number" && (
                  <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    ★ {selectedReviewText.rating}.0
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600">
                Report Reason: <strong className="text-slate-900 capitalize">{selectedReviewText.reason}</strong>
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Review Content / Feedback
              </span>
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
                {selectedReviewText.comment || "No text feedback was provided with this review."}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedReviewText(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer min-h-[38px] focus:outline-none focus:ring-2 focus:ring-teal-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </BaseModal>
      )}
    </div>
  );
}
