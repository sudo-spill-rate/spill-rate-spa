import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

export default function PublicLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-teal-700 selection:text-white">
      {/* Keyboard accessible skip-to-content anchor */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-slate-900 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
      >
        Skip to main content
      </a>

      <PublicNavbar />
      <main id="main-content" className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}