import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  CheckCircle2,
  XCircle,
  RotateCw,
  AlertCircle,
  Eye,
  Calendar,
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

        <button
          type="button"
          onClick={() => refetchReports()}
          disabled={isLoadingReports}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer min-h-[36px] transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isLoadingReports ? "animate-spin text-teal-700" : ""}`} />
          <span>Refresh Queue</span>
        </button>
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
          <div className="overflow-x-auto">
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
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-slate-900">
                      {report.business_name || report.business_id || "Unknown Store"}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-900 block truncate max-w-xs">
                          {report.reason}
                        </span>
                        {report.review_text && (
                          <button
                            type="button"
                            onClick={() => setSelectedReviewText(report.review_text)}
                            className="text-[11px] text-teal-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Preview flagged text</span>
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-slate-600 font-mono text-[11px]">
                      {report.reporter_email || "Anonymous user"}
                    </td>

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

                    <td className="px-4 py-3.5 text-slate-500 text-[11px] whitespace-nowrap">
                      {report.created_at ? (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{new Date(report.created_at).toLocaleDateString()}</span>
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      {report.status === "pending" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setActionToConfirm({ reportId: report.id, action: "resolved" })}
                            disabled={isResolving && processingId === report.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40 min-h-[36px]"
                            title="Resolve ticket and apply moderation"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Resolve</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActionToConfirm({ reportId: report.id, action: "dismissed" })}
                            disabled={isResolving && processingId === report.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40 min-h-[36px]"
                            title="Dismiss false report"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Dismiss</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Archived</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {/* Review preview modal */}
      <BaseModal
        isOpen={Boolean(selectedReviewText)}
        onClose={() => setSelectedReviewText(null)}
        title="Flagged Review Content"
        maxWidth="max-w-lg"
      >
        <div className="space-y-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
            {selectedReviewText}
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setSelectedReviewText(null)}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer min-h-[36px]"
            >
              Close Preview
            </button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
