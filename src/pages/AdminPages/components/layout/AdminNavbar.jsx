import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import {
  Settings,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  LayoutDashboard,
  BarChart3,
  Store,
} from "lucide-react";
import { useUserAuth } from "../../../../hooks/useUserAuth";
import { useBodyScrollLock } from "../../../../hooks/useBodyScrollLock";
import AccountSettingsModal from "../../../BusinessPages/components/layout/AccountSettingsModal";

export default function AdminNavbar() {
  const { user, logout } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock background body scroll when mobile menu is open
  useBodyScrollLock(mobileMenuOpen);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate("/", { replace: true });
    } catch {
      setIsLoggingOut(false);
    }
  };

  const isPlatformOverviewActive =
    location.pathname === "/admin/platform/overview" ||
    location.pathname === "/admin/overview" ||
    location.pathname === "/admin" ||
    location.pathname === "/admin/dashboard";
  const isGoogleOverviewActive = location.pathname === "/admin/google-overview";
  const isMyStoreActive = location.pathname.startsWith("/admin/my-store");

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Badge */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              to="/admin/platform/overview"
              className="flex items-center gap-2 sm:gap-2.5 focus:outline-none focus:ring-2 focus:ring-teal-700 rounded-lg p-1 min-h-[44px] min-w-0"
              aria-label="SpillRate Admin Overview"
            >
              <img
                src="/logo.png"
                alt="SpillRate Logo"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0"
              />
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 truncate">
                  SpillRate
                </span>
                <span className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full border border-teal-200 bg-teal-50 text-teal-800 shrink-0">
                  Platform Admin
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop User Session, Settings & Logout */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-xs font-bold text-slate-700">
                {user?.avatar_url || user?.picture ? (
                  <img
                    src={user.avatar_url || user.picture}
                    alt=""
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  user?.name?.charAt(0) || <UserIcon className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <div className="text-left text-xs">
                <p className="font-semibold text-slate-900 leading-tight truncate max-w-[140px]">
                  {user?.name || "Admin"}
                </p>
                <p className="text-[11px] text-slate-500 font-medium capitalize">
                  {user?.role || "Admin"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              aria-label="Account Settings"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors min-h-[38px] focus:outline-none focus:ring-2 focus:ring-teal-700 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Settings</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Sign out of founder portal"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-slate-200 hover:border-red-200 transition-colors min-h-[38px] focus:outline-none focus:ring-2 focus:ring-teal-700 cursor-pointer disabled:opacity-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-label="Open navigation menu"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-teal-700 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5 text-slate-600" />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Full-Screen Navigation Drawer / Modal */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Platform Admin Navigation"
          className="fixed inset-0 z-50 md:hidden bg-white flex flex-col"
        >
          {/* Top Bar inside Drawer: Identical height & alignment */}
          <div className="border-b border-slate-200 px-3.5 sm:px-6 shrink-0 bg-white">
            <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
              <Link
                to="/admin/overview"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 sm:gap-2.5 focus:outline-none focus:ring-2 focus:ring-teal-700 rounded-lg p-1 min-h-[44px] min-w-0"
              >
                <img
                  src="/logo.png"
                  alt="SpillRate Logo"
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0"
                />
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900">
                    SpillRate
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full border border-teal-200 bg-teal-50 text-teal-800 shrink-0">
                    Platform Admin
                  </span>
                </div>
              </Link>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-teal-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-600" />
                <span>Close</span>
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-md w-full mx-auto">
            {/* User Profile Card */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsSettingsOpen(true);
              }}
              aria-label="Manage account settings"
              className="w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs hover:bg-slate-100 transition-colors cursor-pointer text-left min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-700"
            >
              <div className="w-11 h-11 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center text-slate-700 font-bold text-sm shrink-0">
                {user?.avatar_url || user?.picture ? (
                  <img
                    src={user.avatar_url || user.picture}
                    alt=""
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  user?.name?.charAt(0) || <UserIcon className="w-5 h-5 text-slate-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {user?.name || "Admin"}
                  </p>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-800 shrink-0">
                    {user?.role || "Founder"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {user?.email || "founder@spillrate.internal"}
                </p>
              </div>
            </button>

            {/* Overview Links: Platform Overview & Google Overview */}
            <div className="space-y-1.5 pt-1">
              <Link
                to="/admin/platform/overview"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 text-sm font-semibold rounded-xl transition-colors min-h-[46px] ${
                  isPlatformOverviewActive
                    ? "bg-teal-50 text-teal-900 font-bold border border-teal-200/90 shadow-2xs"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-slate-500" />
                <span>Platform Overview</span>
              </Link>

              <Link
                to="/admin/google-overview"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 text-sm font-semibold rounded-xl transition-colors min-h-[46px] ${
                  isGoogleOverviewActive
                    ? "bg-teal-50 text-teal-900 font-bold border border-teal-200/90 shadow-2xs"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <BarChart3 className="w-4 h-4 text-slate-500" />
                <span>Google Overview</span>
              </Link>

              <Link
                to="/admin/my-store"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 text-sm font-semibold rounded-xl transition-colors min-h-[46px] ${
                  isMyStoreActive
                    ? "bg-teal-50 text-teal-900 font-bold border border-teal-200/90 shadow-2xs"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Store className="w-4 h-4 text-slate-500" />
                <span>My Store</span>
              </Link>
            </div>

            {/* System Actions */}
            <div className="pt-3 border-t border-slate-100 space-y-2 pb-6">
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
