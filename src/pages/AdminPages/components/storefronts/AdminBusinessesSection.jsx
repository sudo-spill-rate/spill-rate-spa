import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  Trash2,
  RotateCw,
  Search,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import { useAdmin } from "../../../../hooks/useAdmin";
import { businessService } from "../../../../services/businessService";

export default function AdminBusinessesSection({ overview, refetchOverview }) {
  const { verifyBusiness, deleteBusiness, isVerifying, isDeletingBusiness } = useAdmin();

  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState(null);

  // Fetch all registered businesses from directory
  const {
    data: businessResponse,
    isLoading: isLoadingBusinesses,
    refetch: refetchBusinesses,
  } = useQuery({
    queryKey: ["admin-all-businesses"],
    queryFn: () => businessService.getBusinesses({ limit: 100 }),
    staleTime: 30000,
  });

  const businesses =
    businessResponse?.success && Array.isArray(businessResponse.data)
      ? businessResponse.data
      : overview?.recent_businesses || [];

  const filtered = businesses.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.name?.toLowerCase().includes(q) ||
      b.slug?.toLowerCase().includes(q) ||
      b.category?.toLowerCase().includes(q)
    );
  });

  const handleToggleVerify = async (businessId, currentVerified) => {
    setProcessingId(businessId);
    try {
      await verifyBusiness({ businessId, is_verified: !currentVerified });
      refetchBusinesses();
      if (refetchOverview) refetchOverview();
    } catch (err) {
      alert(err?.message || "Failed to update verification status.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (businessId, businessName) => {
    const confirmation = window.prompt(
      `DANGER: Permanent deletion of "${businessName}". All associated reviews and feedback will be destroyed.\nType "${businessName}" to confirm:`
    );
    if (confirmation !== businessName) {
      if (confirmation !== null) alert("Confirmation failed. Store name did not match.");
      return;
    }

    setProcessingId(businessId);
    try {
      await deleteBusiness(businessId);
      refetchBusinesses();
      if (refetchOverview) refetchOverview();
    } catch (err) {
      alert(err?.message || "Failed to delete storefront.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter storefronts by name, slug, or category..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 min-h-[38px] transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong>{filtered.length}</strong> registered businesses
          </span>
          <button
            type="button"
            onClick={() => {
              refetchBusinesses();
              if (refetchOverview) refetchOverview();
            }}
            disabled={isLoadingBusinesses}
            className="p-2 border border-slate-300 rounded-lg bg-white text-slate-700 hover:bg-slate-50 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700"
            title="Refresh storefront list"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoadingBusinesses ? "animate-spin text-teal-700" : ""}`} />
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {isLoadingBusinesses ? (
          <div className="p-12 text-center text-xs text-slate-500">
            <RotateCw className="w-6 h-6 animate-spin text-teal-700 mx-auto mb-2" />
            <span>Loading registered storefronts...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="font-bold text-sm text-slate-900">
              No matching storefronts found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {search.trim()
                ? "Try clearing or broadening your search input."
                : "No storefronts have been registered on the platform yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse" aria-label="Storefronts verification table">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th scope="col" className="px-4 py-3">Storefront Name</th>
                  <th scope="col" className="px-4 py-3">Slug</th>
                  <th scope="col" className="px-4 py-3">Category</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((biz) => (
                  <tr key={biz.id || biz.slug} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>{biz.name}</span>
                        {biz.is_verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0" title="Verified Storefront" />
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">
                      /{biz.slug}
                    </td>

                    <td className="px-4 py-3.5 text-slate-600">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {biz.category || "General"}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleToggleVerify(biz.id, biz.is_verified)}
                        disabled={isVerifying && processingId === biz.id}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold cursor-pointer border transition-colors min-h-[32px] ${
                          biz.is_verified
                            ? "bg-teal-50 text-teal-800 border-teal-300 hover:bg-teal-100"
                            : "bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100"
                        }`}
                        title="Click to toggle verification status"
                      >
                        {isVerifying && processingId === biz.id ? (
                          <RotateCw className="w-3 h-3 animate-spin text-teal-700" />
                        ) : biz.is_verified ? (
                          <Check className="w-3 h-3 text-teal-700" />
                        ) : (
                          <X className="w-3 h-3 text-slate-400" />
                        )}
                        <span>{biz.is_verified ? "Verified" : "Unverified"}</span>
                      </button>
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/business/${biz.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                          title="View public storefront page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={() => handleDelete(biz.id, biz.name)}
                          disabled={isDeletingBusiness && processingId === biz.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40 min-h-[36px]"
                          title="Permanently remove storefront"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
