import React from "react";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout({
  children,
  activeBusinessSlug,
  title,
  description,
  action,
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-teal-700 selection:text-white">
      {/* Accessible Skip Link */}
      <a
        href="#dashboard-main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-teal-700 text-white font-semibold rounded shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-700"
      >
        Skip to main content
      </a>

      {/* Top Navbar */}
      <DashboardNavbar />

      {/* Main Body with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Sidebar */}
          <DashboardSidebar activeBusinessSlug={activeBusinessSlug} />

          {/* Primary Main Content Panel */}
          <main id="dashboard-main" tabIndex={-1} className="flex-1 w-full min-w-0">
            {/* Optional Header Banner */}
            {(title || action) && (
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-slate-200">
                <div>
                  {title && (
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      {title}
                    </h1>
                  )}
                  {description && (
                    <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>
                {action && <div className="shrink-0 w-full sm:w-auto">{action}</div>}
              </div>
            )}

            {/* Page Content */}
            {children}
          </main>
        </div>
      </div>

      {/* Subtle Owner Portal Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-500 text-center sm:text-left">
          <p>TrustRate Business Management. All customer reviews are cryptographically recorded.</p>
          <div className="flex items-center gap-4">
            <a href="/faq" className="hover:text-slate-800 transition-colors py-1">Owner FAQ</a>
            <a href="/contact" className="hover:text-slate-800 transition-colors py-1">Support</a>
            <a href="/terms" className="hover:text-slate-800 transition-colors py-1">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}