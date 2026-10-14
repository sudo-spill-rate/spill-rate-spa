import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  RotateCw,
  AlertCircle,
  Eye,
  Calendar,
} from "lucide-react";
import { useAdmin } from "../../../../hooks/useAdmin";

export default function AdminReportsSection() {
  const { reports, isLoadingReports, reportsError, refetchReports, resolveReport, isResolving } = useAdmin();
  const [filter, setFilter] = useState("all");
  const [processingId, setProcessingId] = useState(null);
  const [selectedReviewText, setSelectedReviewText] = useState(null);

  const reportList = Array.isArray(reports) ? reports : [];

  const filteredReports = reportList.filter((r) => {
    if (filter === "all") return true;
    return r.status?.toLowerCase() === filter.toLowerCase();
  });

  const handleAction = async (reportId, action) => {
    const actionLabel = action === "resolved" ? "resolve and remove/penalize review" : "dismiss";
    if (!window.confirm(`Are you sure you want to ${actionLabel}?`)) return;

    setProcessingId(reportId);
    try {
      await resolveReport({ reportId, action });
      refetchReports();
    } catch (err) {
      alert(err?.message || "Failed to process report action.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters and Refresh bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-2 sm:p-2.5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Clean Segmented Control Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          {["all", "pending", "resolved", "dismissed"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors cursor-pointer min-h-[36px] ${
                filter === status
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

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
                        "—"
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      {report.status === "pending" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAction(report.id, "resolved")}
                            disabled={isResolving && processingId === report.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40 min-h-[36px]"
                            title="Resolve ticket and apply moderation"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Resolve</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAction(report.id, "dismissed")}
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

      {/* Review preview modal */}
      {selectedReviewText && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-5 space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Flagged Review Content</h3>
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
        </div>
      )}
    </div>
  );
}
