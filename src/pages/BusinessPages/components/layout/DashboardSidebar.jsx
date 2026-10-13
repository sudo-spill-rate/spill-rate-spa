import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { useBusinessDirectory } from "../../../../hooks/useBusinessDirectory";

export default function DashboardSidebar({ activeBusinessSlug }) {
  const location = useLocation();
  const { businesses } = useBusinessDirectory();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const businessList = businesses || [];
  const businessCount = businessList.length;
  const quotaLimit = 5;

  // Determine currently selected business
  const currentBusiness =
    businessList.find(
      (b) =>
        b.slug === activeBusinessSlug ||
        location.pathname.includes(`/dashboard/business/${b.slug}`)
    ) || businessList[0];

  const currentSlug = currentBusiness?.slug;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  return (
    <aside
      className="hidden lg:block w-64 shrink-0"
      aria-label="Dashboard sidebar navigation"
    >
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col divide-y divide-slate-100">
        {/* Top: Active Storefront Switcher */}
        <div className="p-3.5 bg-slate-50/50">
          <div className="relative" ref={dropdownRef}>
            {businessCount > 0 ? (
              <>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={dropdownOpen}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-slate-900 truncate">
                        {currentBusiness?.name}
                      </span>
                      {currentBusiness?.is_verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                      {currentBusiness?.category || "Storefront"}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown list of businesses strictly for switching */}
                {dropdownOpen && (
                  <div
                    role="menu"
                    aria-orientation="vertical"
                    className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-30 max-h-56 overflow-y-auto"
                  >
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Storefront
                    </div>
                    {businessList.map((biz) => (
                      <Link
                        key={biz.id || biz.slug}
                        to={`/dashboard/business/${biz.slug}`}
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                          biz.slug === currentSlug
                            ? "bg-teal-50 text-teal-800 font-semibold"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="truncate">{biz.name}</span>
                        {biz.is_verified && (
                          <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0 ml-1.5" />
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="px-3 py-2 text-xs text-slate-500 text-center font-medium">
                No Storefronts
              </div>
            )}
          </div>
        </div>

        {/* Middle: Clean Navigation Menu (Pure Typography, Zero Decorative Icons) */}
        <div className="p-3">
          <nav className="space-y-0.5" aria-label="Main navigation">
            <Link
              to="/dashboard"
              className={`flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors min-h-[36px] ${
                location.pathname === "/dashboard"
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span>Dashboard Overview</span>
            </Link>

            {currentSlug && (
              <>
                <Link
                  to={`/dashboard/business/${currentSlug}`}
                  className={`flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors min-h-[36px] ${
                    location.pathname === `/dashboard/business/${currentSlug}`
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>Storefront Details</span>
                </Link>

                <Link
                  to={`/business/${currentSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-2 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors min-h-[36px]"
                >
                  <span>Public Review Page</span>
                </Link>
              </>
            )}

            <Link
              to="/dashboard/explore"
              className={`flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors min-h-[36px] ${
                location.pathname === "/dashboard/explore"
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span>Explore Directory</span>
            </Link>
          </nav>
        </div>

        {/* Bottom: Minimal Quota Indicator */}
        <div className="p-3.5 bg-slate-50/50">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="font-semibold text-slate-700">Quota Limit</span>
            <span className="text-slate-500 font-medium">
              {businessCount} of {quotaLimit} active
            </span>
          </div>
          <div
            className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden"
            role="progressbar"
            aria-valuenow={businessCount}
            aria-valuemin={0}
            aria-valuemax={quotaLimit}
          >
            <div
              className={`h-full transition-all duration-300 ${
                businessCount >= quotaLimit ? "bg-amber-600" : "bg-teal-600"
              }`}
              style={{
                width: `${Math.min(100, (businessCount / quotaLimit) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}