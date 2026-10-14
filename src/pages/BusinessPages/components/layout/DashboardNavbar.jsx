import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import {
  Building,
  LayoutDashboard,
  Compass,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  User as UserIcon,
  Settings,
  Shield,
} from "lucide-react";
import { useUserAuth } from "../../../../hooks/useUserAuth";
import { useBusinessDirectory } from "../../../../hooks/useBusinessDirectory";
import { useBodyScrollLock } from "../../../../hooks/useBodyScrollLock";
import AccountSettingsModal from "./AccountSettingsModal";

export default function DashboardNavbar() {
  const { user, logout } = useUserAuth();
  const { businesses } = useBusinessDirectory();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Lock background body scroll when mobile full-screen menu is open
  useBodyScrollLock(mobileMenuOpen);

  const businessCount = businesses?.length || 0;
  const quotaLimit = 5;
  const quotaPercentage = Math.min(100, Math.round((businessCount / quotaLimit) * 100));

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate("/", { replace: true });
    } catch {
      setIsLoggingOut(false);
    }
  };

  const mobileNavLinks = [
    { label: "Dashboard Overview", path: "/dashboard", icon: LayoutDashboard },
    { label: "Directory Explorer", path: "/dashboard/explore", icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Portal Tag */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 sm:gap-2.5 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-lg p-1"
            >
              <img
                src="/logo.png"
                alt="TrustRate Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0"
              />
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">TrustRate</span>
                <span className="text-[10px] sm:text-xs font-medium text-teal-800 bg-teal-50 border border-teal-200 px-1.5 sm:px-2 py-0.5 rounded-full">
                  Owner Portal
                </span>
              </div>
            </Link>
          </div>

          {/* User Profile & Logout (Desktop Utility Bar) */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2.5 text-right">
              {user?.avatar_url || user?.picture ? (
                <img
                  src={user.avatar_url || user.picture}
                  alt={user.name || "Owner profile"}
                  className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-900 leading-tight">
                  {user?.name || "Business Owner"}
                </p>
                <p className="text-[11px] text-slate-500 truncate max-w-[160px]">
                  {user?.email || "owner@trustrate.internal"}
                </p>
              </div>
            </div>

            {(user?.is_admin || user?.role === "admin" || user?.role === "founder") && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-md border border-teal-200 transition-colors min-h-[44px]"
              >
                <Shield className="w-3.5 h-3.5 text-teal-600" />
                <span>Admin Portal</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              aria-label="Account Settings"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Settings</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Sign out of owner dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-md border border-slate-200 hover:border-red-200 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-label="Open navigation menu"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600 transition-colors cursor-pointer"
            >
              <Menu className="w-4 h-4 text-slate-600" />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Full-Screen Navigation Modal / Overlay */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Owner Navigation Menu"
          className="fixed inset-0 z-50 md:hidden bg-white flex flex-col animate-fade-in"
        >
          {/* Top Bar: Exactly matching navbar height & layout */}
          <div className="border-b border-slate-200 px-3.5 sm:px-6 shrink-0 bg-white">
            <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
              {/* Brand Logo & Portal Tag */}
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 sm:gap-2.5 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-lg p-1"
              >
                <img
                  src="/logo.png"
                  alt="TrustRate Logo"
                  className="w-8 h-8 object-contain shrink-0"
                />
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">TrustRate</span>
                  <span className="text-[10px] sm:text-xs font-medium text-teal-800 bg-teal-50 border border-teal-200 px-1.5 sm:px-2 py-0.5 rounded-full">
                    Owner Portal
                  </span>
                </div>
              </Link>

              {/* Close Button ('X') in the exact position of the hamburger button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-600" />
                <span>Close</span>
              </button>
            </div>
          </div>

          {/* Full Screen Menu Content */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 max-w-md w-full mx-auto">
            {/* User Profile Card */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs">
              {user?.avatar_url || user?.picture ? (
                <img
                  src={user.avatar_url || user.picture}
                  alt={user.name || "Owner profile"}
                  className="w-11 h-11 rounded-full border border-slate-200 object-cover shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 shrink-0">
                  <UserIcon className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.name || "Business Owner"}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email || "owner@trustrate.internal"}</p>
              </div>
            </div>

            {/* Primary Nav Links */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1">
                Navigation
              </p>
              {mobileNavLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 text-sm font-semibold rounded-xl transition-colors min-h-[46px] ${
                      isActive
                        ? "bg-teal-50 text-teal-800 font-bold border border-teal-200/90 shadow-2xs"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Registered Businesses Quick Switcher (Mobile) */}
            {businesses && businesses.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Your Businesses</span>
                  <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/80">
                    {businessCount} of {quotaLimit}
                  </span>
                </div>
                <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                  {businesses.map((biz) => {
                    const isSelected = location.pathname.includes(`/dashboard/business/${biz.slug}`);
                    return (
                      <Link
                        key={biz.id || biz.slug}
                        to={`/dashboard/business/${biz.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-medium rounded-xl transition-colors min-h-[44px] ${
                          isSelected
                            ? "bg-teal-50 text-teal-900 font-bold border border-teal-200/90"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Building className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate">{biz.name}</span>
                        </div>
                        {biz.is_verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quota Progress Meter (Mobile) */}
            <div className="pt-2 border-t border-slate-100">
              <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Account Quota</span>
                  <span className="text-xs font-bold text-slate-800">{businessCount} of {quotaLimit} used</span>
                </div>
                <div
                  className="w-full bg-slate-200 rounded-full h-2 overflow-hidden"
                  role="progressbar"
                  aria-valuenow={businessCount}
                  aria-valuemin={0}
                  aria-valuemax={quotaLimit}
                >
                  <div
                    className={`h-full transition-all duration-300 ${
                      businessCount >= quotaLimit ? "bg-amber-600" : "bg-teal-600"
                    }`}
                    style={{ width: `${quotaPercentage}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  {businessCount >= quotaLimit
                    ? "Maximum limit of 5 business profiles reached."
                    : `${quotaLimit - businessCount} profile slot(s) remaining.`}
                </p>
              </div>
            </div>

            {/* Settings & Logout Action */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5 pb-4">
              {(user?.is_admin || user?.role === "admin" || user?.role === "founder") && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors min-h-[44px]"
                >
                  <Shield className="w-4 h-4 text-teal-600" />
                  <span>Admin Governance Portal</span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSettingsOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors min-h-[44px] cursor-pointer"
              >
                <Settings className="w-4 h-4 text-slate-600" />
                <span>Account Settings</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl transition-colors min-h-[44px] cursor-pointer disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Settings Modal */}
      <AccountSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </header>
  );
}