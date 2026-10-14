import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Settings, LogOut, Menu, X, Shield, User as UserIcon } from "lucide-react";
import { useUserAuth } from "../../../../hooks/useUserAuth";
import AccountSettingsModal from "../../../BusinessPages/components/layout/AccountSettingsModal";

export default function AdminNavbar() {
  const { user, logout } = useUserAuth();
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate("/", { replace: true });
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Badge */}
          <div className="flex items-center gap-3">
            <Link
              to="/admin/overview"
              className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-teal-700 rounded-lg p-1"
            >
              <img
                src="/logo.png"
                alt="TrustRate Logo"
                className="w-8 h-8 object-contain shrink-0"
              />
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900">
                  TrustRate
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded border border-teal-200 bg-teal-50 text-teal-800">
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
                    className="w-full h-full object-cover"
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
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors min-h-[38px] focus:outline-none focus:ring-2 focus:ring-teal-700 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Settings</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Sign out of founder portal"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-md border border-slate-200 hover:border-red-200 transition-colors min-h-[38px] focus:outline-none focus:ring-2 focus:ring-teal-700 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-700 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-slate-600" /> : <Menu className="w-4 h-4 text-slate-600" />}
              <span>{mobileMenuOpen ? "Close" : "Menu"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-4">
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center text-slate-700 font-bold text-sm shrink-0">
              {user?.avatar_url || user?.picture ? (
                <img
                  src={user.avatar_url || user.picture}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.charAt(0) || <UserIcon className="w-5 h-5 text-slate-600" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.email || "founder@trustrate.internal"}
              </p>
              <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-800 capitalize">
                {user?.role || "founder"}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsSettingsOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors min-h-[44px] cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-600" />
              <span>Account Settings</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors min-h-[44px] cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
            </button>
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
