import React from "react";
import AdminNavbar from "./AdminNavbar";
import AdminDashboardSidebar from "./AdminDashboardSidebar";

export default function AdminLayout({
  children,
  title,
  description,
  actions,
  sidebar,
}) {
  const activeSidebar = sidebar !== undefined ? sidebar : <AdminDashboardSidebar />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-teal-700 selection:text-white">
      {/* Top Navbar */}
      <AdminNavbar />

      {/* Main Body with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-3.5 sm:py-5">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
          {/* Sidebar */}
          {activeSidebar}

          {/* Primary Main Content Panel */}
          <main className="flex-1 w-full min-w-0">
            {/* Header Banner */}
            {(title || actions) && (
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 pb-3 sm:pb-4 border-b border-slate-200">
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
                {actions && <div className="shrink-0 w-full sm:w-auto">{actions}</div>}
              </div>
            )}

            {/* Page Content */}
            {children}
          </main>
        </div>
      </div>

      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        SpillRate &bull; Platform Management & Moderation Environment
      </footer>
    </div>
  );
}
