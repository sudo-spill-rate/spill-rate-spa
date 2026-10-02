import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Menu, X, Star, Building2, User, LogOut, Compass, HelpCircle, PhoneCall, Info } from "lucide-react";
import { useUserAuth } from "../../../../hooks/useUserAuth";

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useUserAuth();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
    { label: "Home", path: "/" },
    { label: "Directory", path: "/explore", icon: Compass },
    { label: "About", path: "/about", icon: Info },
    { label: "FAQ", path: "/faq", icon: HelpCircle },
    { label: "Contact", path: "/contact", icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold text-xl text-slate-900 group focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-lg p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-teal-400">
              <Star className="w-4 h-4 fill-teal-400 text-teal-400" />
            </div>
            <span className="tracking-tight text-xl font-bold">
              Trust<span className="text-teal-700">Rate</span>
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
                  `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 ${
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
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  {user?.avatar_url || user?.picture ? (
                    <img
                      src={user.avatar_url || user.picture}
                      alt={user.name || "User account"}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-slate-600" />
                  )}
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="sr-only">Sign out</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px]"
                >
                  <Building2 className="w-4 h-4 text-teal-400" />
                  <span>Business Portal</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="p-2.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-lg">
          <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                      isActive
                        ? "text-teal-800 bg-teal-50 font-semibold"
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

          <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-100 text-slate-900 font-semibold rounded-lg text-center min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <User className="w-5 h-5" />
                  <span>Go to Business Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-red-700 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full py-3 px-4 text-center font-medium text-slate-700 hover:bg-slate-100 rounded-lg min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-900 text-white font-semibold rounded-lg text-center min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <Building2 className="w-4 h-4 text-teal-400" />
                  <span>Business Portal</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}