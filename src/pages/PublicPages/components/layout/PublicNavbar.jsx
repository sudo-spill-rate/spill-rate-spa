import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Menu, X, User, LogOut, Compass, Info } from "lucide-react";
import { useUserAuth } from "../../../../hooks/useUserAuth";
import { useBodyScrollLock } from "../../../../hooks/useBodyScrollLock";
import SignInModal from "./SignInModal";

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useUserAuth();

  // Lock body scroll when mobile menu overlay is open
  useBodyScrollLock(mobileMenuOpen);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Open modal if ?signin=true is in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("signin") === "true") {
      setIsSignInModalOpen(true);
    }
  }, [location.search]);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: "Directory", path: "/explore", icon: Compass },
    { label: "About", path: "/about", icon: Info },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Brand Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-lg sm:text-xl text-slate-900 group focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-lg p-1"
            >
              <img
                src="/logo.png"
                alt="SpillRate Logo"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0"
              />
              <span className="tracking-tight text-lg sm:text-xl font-bold">
                Spill<span className="text-teal-700">Rate</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/"}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                      isActive
                        ? "text-teal-800 bg-teal-50 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Right Action Buttons (Desktop) */}
            <div className="hidden md:flex items-center gap-2.5">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to={user?.role === "founder" ? "/admin/dashboard" : (user?.is_admin || user?.role === "admin") ? "/admin/dashboard" : "/dashboard"}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[36px]"
                  >
                    {user?.avatar_url || user?.picture ? (
                      <img
                        src={user.avatar_url || user.picture}
                        alt={user.name || "User account"}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-slate-600" />
                    )}
                    <span>
                      {user?.role === "founder" ? "Founder Portal" : (user?.is_admin || user?.role === "admin") ? "Admin Portal" : "Dashboard"}
                    </span>
                  </Link>
                  <button
                    onClick={logout}
                    title="Sign out"
                    className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="sr-only">Sign out</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSignInModalOpen(true)}
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[36px] inline-flex items-center justify-center cursor-pointer"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
                className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Navigation Modal / Overlay */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-50 md:hidden bg-white flex flex-col"
        >
          {/* Top Bar: Perfectly aligned with the Navbar position & dimensions */}
          <div className="border-b border-slate-200 px-4 sm:px-6 shrink-0">
            <div className="flex items-center justify-between h-14 sm:h-16 max-w-7xl mx-auto">
              {/* Brand Logo */}
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 font-bold text-lg sm:text-xl text-slate-900 group focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-lg p-1"
              >
                <img
                  src="/logo.png"
                  alt="SpillRate Logo"
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0"
                />
                <span className="tracking-tight text-lg sm:text-xl font-bold">
                  Spill<span className="text-teal-700">Rate</span>
                </span>
              </Link>

              {/* Close Button ('X') in the exact same spot as the hamburger toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Full Screen Menu Content with Solid Theme Background */}
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 flex flex-col justify-between max-w-md w-full mx-auto">
            <nav aria-label="Mobile Navigation" className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === "/"}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-base font-semibold transition-colors min-h-[48px] focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                        isActive
                          ? "text-teal-800 bg-teal-50 border border-teal-200/80 shadow-2xs font-bold"
                          : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                      }`
                    }
                  >
                    {Icon && <Icon className="w-5 h-5 text-slate-500" />}
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Auth / Account Actions */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to={user?.role === "founder" ? "/admin/dashboard" : (user?.is_admin || user?.role === "admin") ? "/admin/dashboard" : "/dashboard"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-xl text-center min-h-[48px] focus:outline-none focus:ring-2 focus:ring-teal-600 transition-colors"
                  >
                    <User className="w-5 h-5 text-slate-700" />
                    <span>
                      {user?.role === "founder" ? "Go to Founder Portal" : (user?.is_admin || user?.role === "admin") ? "Go to Admin Portal" : "Go to Business Dashboard"}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 text-red-700 hover:bg-red-50 rounded-xl font-medium text-sm transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsSignInModalOpen(true);
                  }}
                  className="w-full py-3.5 px-4 text-center font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-xl min-h-[48px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer shadow-xs transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Render SignInModal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      />
    </>
  );
}