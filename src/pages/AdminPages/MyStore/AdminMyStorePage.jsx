import React from "react";
import { Link } from "react-router";
import {
  Building,
  Plus,
  RotateCw,
} from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import AdminOwnerBusinessCard from "../components/storefronts/AdminOwnerBusinessCard";
import PortfolioStatsOverview from "../../BusinessPages/components/dashboard/PortfolioStatsOverview";
import { useBusinessDirectory } from "../../../hooks/useBusinessDirectory";

export default function AdminMyStorePage() {
  const { businesses, isLoading, isError, refetch } = useBusinessDirectory();
  const businessList = businesses || [];

  return (
    <AdminLayout
      title="My Storefronts"
      description="Manage your personal or flagship business storefronts, customer feedback, and review channels."
      actions={
        <Link
          to="/admin/my-store/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white text-xs font-semibold cursor-pointer min-h-[38px] transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register Storefront</span>
        </Link>
      }
    >
      <div className="space-y-5">
        {/* Loading State */}
        {isLoading && (
          <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
            <RotateCw className="w-6 h-6 animate-spin text-teal-700 mx-auto mb-2" />
            <span>Loading your storefronts...</span>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center justify-between">
            <span>Failed to load storefronts.</span>
            <button
              type="button"
              onClick={() => refetch()}
              className="font-semibold text-red-900 underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && businessList.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mx-auto">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                No Storefronts Registered Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                As the Founder, you can register your personal business or flagship brand to test and collect public customer ratings.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/admin/my-store/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold cursor-pointer min-h-[38px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register First Storefront</span>
              </Link>
            </div>
          </div>
        )}

        {/* Active Storefronts Content */}
        {!isLoading && !isError && businessList.length > 0 && (
          <div className="space-y-4">
            {/* Portfolio metric cards */}
            <PortfolioStatsOverview businesses={businessList} />

            {/* List Header */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-900">
                Active Storefronts ({businessList.length} of 5)
              </span>
            </div>

            {/* Full-width Business Cards Grid */}
            <div className="grid grid-cols-1 gap-4">
              {businessList.map((biz) => (
                <AdminOwnerBusinessCard key={biz.id || biz.slug} business={biz} />
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
