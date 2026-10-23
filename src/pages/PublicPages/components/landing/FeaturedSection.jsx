import { useMemo } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { businessService } from "../../../../services/businessService";
import BusinessCard from "../../../../components/common/BusinessCard";
import { useUserAuth } from "../../../../hooks/useUserAuth";

export default function FeaturedSection() {
  const { isAuthenticated } = useUserAuth();
  const {
    data: businesses = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["featured-businesses"],
    queryFn: async () => {
      const res = await businessService.getBusinesses({ limit: 15 });
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch featured businesses");
      }
      return res.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  // Deterministic daily rotation to pick 10 featured establishments per day from the 15 fetched
  const featuredTen = useMemo(() => {
    if (!businesses || businesses.length === 0) return [];
    if (businesses.length <= 10) return businesses;

    // Daily seed based on current date (YYYY-MM-DD)
    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    // Deterministic pseudo-random sort
    const shuffled = [...businesses].sort((a, b) => {
      const hashA = ((a.id || 0) * 9301 + 49297 + dateSeed) % 233280;
      const hashB = ((b.id || 0) * 9301 + 49297 + dateSeed) % 233280;
      return hashA - hashB;
    });

    return shuffled.slice(0, 10);
  }, [businesses]);

  return (
    <div className="w-full flex-1 flex flex-col">
      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4.5 flex-1" aria-busy="true">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-xs animate-pulse space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 bg-slate-200 rounded" />
                  <div className="h-3.5 w-1/2 bg-slate-100 rounded" />
                </div>
                <div className="w-16 h-16 sm:w-14 sm:h-14 rounded-xl bg-slate-200 shrink-0" />
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-2/3 bg-slate-100 rounded" />
                  <div className="h-3 w-4/5 bg-slate-100 rounded" />
                  <div className="h-3 w-1/2 bg-slate-100 rounded" />
                </div>
                <div className="w-16 h-16 rounded-lg bg-slate-100 shrink-0" />
              </div>
              <div className="pt-2 border-t border-slate-100 h-5 bg-slate-50 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="p-5 sm:p-6 text-center bg-white rounded-xl border border-slate-200 shadow-xs my-auto">
          <AlertCircle className="w-6 h-6 text-amber-600 mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm font-semibold text-slate-900">Unable to load featured businesses</p>
          <p className="text-xs text-slate-600 mt-1 mb-3.5">Please verify your connection and try again.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px] cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && businesses.length === 0 && (
        <div className="p-6 sm:p-8 text-center bg-white rounded-xl border border-slate-200 shadow-xs my-auto">
          <CheckCircle2 className="w-9 h-9 text-slate-400 mx-auto mb-2.5" aria-hidden="true" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            No businesses registered yet
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Be the first local merchant to register your establishment and start collecting authentic community feedback.
          </p>
          <div className="mt-3.5 sm:mt-4">
            <Link
              to={isAuthenticated ? "/dashboard/business/new" : "/?signin=true"}
              className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              Register Your Business
            </Link>
          </div>
        </div>
      )}

      {/* Real Data Cards Grid: 1 col mobile, 2 cols tablet, 3 cols desktop */}
      {!isLoading && !isError && featuredTen.length > 0 && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4.5 pb-3 sm:pb-6">
          {featuredTen.map((biz) => (
            <BusinessCard key={biz.id} biz={biz} />
          ))}
        </div>
      )}
    </div>
  );
}
