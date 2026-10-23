import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  Trash2,
  RotateCw,
  Search,
  Check,
  X,
  ExternalLink,
  Phone,
  Globe,
} from "lucide-react";
import { useAdmin } from "../../../../hooks/useAdmin";
import { adminService } from "../../../../services/adminService";
import { businessService } from "../../../../services/businessService";
import { DeleteBusinessModal } from "../../../BusinessPages/components/profile/BusinessActionModals";

export default function AdminBusinessesSection({ overview, refetchOverview }) {
  const { verifyBusiness, deleteBusiness, isVerifying, isDeletingBusiness } = useAdmin();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'unverified' | 'verified'
  const [processingId, setProcessingId] = useState(null);
  const [businessToDelete, setBusinessToDelete] = useState(null);

  // Fetch admin businesses queue with fallback to public directory
  const {
    data: businessData,
    isLoading: isLoadingBusinesses,
    refetch: refetchBusinesses,
  } = useQuery({
    queryKey: ["admin-businesses-queue", statusFilter, search],
    queryFn: async () => {
      try {
        const res = await adminService.getBusinesses({
          status: statusFilter !== "all" ? statusFilter : undefined,
          search: search.trim() || undefined,
          limit: 100,
        });
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          return res.data;
        }
      } catch (e) {
        // Fallback below
      }

      // Graceful fallback to business directory if backend admin queue isn't mounted yet
      const fallbackRes = await businessService.getBusinesses({ limit: 100, search: search.trim() || undefined });
      return fallbackRes.success && Array.isArray(fallbackRes.data) ? fallbackRes.data : [];
    },
    staleTime: 30000,
  });

  const businesses = Array.isArray(businessData)
    ? businessData
    : overview?.recent_businesses || [];

  const filtered = businesses.filter((b) => {
    const q = search.toLowerCase();
    const matchesSearch =
      b.name?.toLowerCase().includes(q) ||
      b.slug?.toLowerCase().includes(q) ||
      b.category?.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (statusFilter === "verified") return Boolean(b.is_verified);
    if (statusFilter === "unverified") return !b.is_verified;
    return true;
  });

  const handleToggleVerify = async (businessId, currentVerified) => {
    setProcessingId(businessId);
    try {
      await verifyBusiness({ businessId, is_verified: !currentVerified });
      toast.success(currentVerified ? "Storefront marked as unverified." : "Storefront verified successfully.");
      refetchBusinesses();
      if (refetchOverview) refetchOverview();
    } catch (err) {
      toast.error(err?.message || "Failed to update verification status.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteConfirm = async (businessId) => {
    try {
      await deleteBusiness(businessId);
      toast.success("Business storefront deleted successfully.");
      refetchBusinesses();
      if (refetchOverview) refetchOverview();
      setBusinessToDelete(null);
      return { success: true };
    } catch (err) {
      const errMsg = err?.message || "Failed to delete storefront.";
      toast.error(errMsg);
      return { success: false, message: errMsg };
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1 max-w-md w-full">
          <label htmlFor="admin-business-search" className="sr-only">
            Filter storefronts
          </label>
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="admin-business-search"
            name="search"
            type="search"
            autoComplete="off"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter storefronts by name, slug, or category..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 min-h-[44px] sm:min-h-[38px] transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer min-h-[30px] ${
                statusFilter === "all"
                  ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("unverified")}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer min-h-[30px] ${
                statusFilter === "unverified"
                  ? "bg-white text-amber-800 shadow-2xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Unverified
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("verified")}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer min-h-[30px] ${
                statusFilter === "verified"
                  ? "bg-white text-teal-800 shadow-2xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Verified
            </button>
          </div>

          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
            Showing <strong>{filtered.length}</strong> storefronts
          </span>
        </div>
      </div>

      {/* Table & Mobile Card Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {isLoadingBusinesses ? (
          <div className="p-8 sm:p-12 text-center text-xs text-slate-500">
            <RotateCw className="w-6 h-6 animate-spin text-teal-700 mx-auto mb-2" />
            <span>Loading registered storefronts...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
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
          <>
            {/* Mobile Card Feed */}
            <div className="md:hidden divide-y divide-slate-100">
              {filtered.map((biz) => (
                <div key={biz.id || biz.slug} className="p-3.5 space-y-3 bg-white">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-xs text-slate-900 break-words">{biz.name}</span>
                        {biz.is_verified && (
                          <img
                            src="/assets/verified-shield.png"
                            alt="Verified Storefront"
                            title="Verified Storefront"
                            className="w-3.5 h-3.5 object-contain inline-block shrink-0 drop-shadow-2xs"
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                      </div>
                      <p className="font-mono text-[11px] text-slate-500 mt-0.5 truncate">
                        /{biz.slug}
                      </p>
                      {(biz.phone || biz.website) && (
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-1 flex-wrap">
                          {biz.phone && <span>📞 {biz.phone}</span>}
                          {biz.website && (
                            <a
                              href={biz.website.startsWith("http") ? biz.website : `https://${biz.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-700 hover:underline"
                            >
                              🌐 {biz.website.replace(/^https?:\/\//, "")}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="shrink-0 inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {biz.category || "General"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleToggleVerify(biz.id, biz.is_verified)}
                      disabled={isVerifying && processingId === biz.id}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer border transition-colors min-h-[44px] ${
                        biz.is_verified
                          ? "bg-teal-50 text-teal-800 border-teal-300 hover:bg-teal-100"
                          : "bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {isVerifying && processingId === biz.id ? (
                        <RotateCw className="w-3.5 h-3.5 animate-spin text-teal-700" />
                      ) : biz.is_verified ? (
                        <Check className="w-3.5 h-3.5 text-teal-700" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span>{biz.is_verified ? "Verified" : "Unverified"}</span>
                    </button>

                    <a
                      href={`/business/${biz.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-slate-50 transition-colors"
                      title="View public storefront page"
                      aria-label={`View storefront ${biz.name}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      onClick={() => setBusinessToDelete(biz)}
                      disabled={isDeletingBusiness && processingId === biz.id}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg cursor-pointer disabled:opacity-40 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
                      title="Permanently remove storefront"
                      aria-label={`Delete storefront ${biz.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
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
                            <img
                              src="/assets/verified-shield.png"
                              alt="Verified Storefront"
                              title="Verified Storefront"
                              className="w-3.5 h-3.5 object-contain inline-block shrink-0 drop-shadow-2xs"
                              loading="lazy"
                              decoding="async"
                            />
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">
                        <div>/{biz.slug}</div>
                        {(biz.phone || biz.website) && (
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-sans mt-0.5">
                            {biz.phone && <span>📞 {biz.phone}</span>}
                            {biz.website && (
                              <a
                                href={biz.website.startsWith("http") ? biz.website : `https://${biz.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-700 hover:underline"
                              >
                                🌐 {biz.website.replace(/^https?:\/\//, "")}
                              </a>
                            )}
                          </div>
                        )}
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
                            onClick={() => setBusinessToDelete(biz)}
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
          </>
        )}
      </div>

      {/* Reusable Accessible Delete Confirmation Modal */}
      {businessToDelete && (
        <DeleteBusinessModal
          isOpen={Boolean(businessToDelete)}
          onClose={() => setBusinessToDelete(null)}
          business={businessToDelete}
          onDelete={handleDeleteConfirm}
          isDeleting={isDeletingBusiness}
        />
      )}
    </div>
  );
}
