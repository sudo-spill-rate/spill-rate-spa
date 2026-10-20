import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  ShieldAlert,
  Building2,
  Tags,
  Compass,
  Store,
  UserPlus,
  Activity,
  Users,
  Globe,
  FileText,
  PlusCircle,
} from "lucide-react";
import { useUserAuth } from "../../../../hooks/useUserAuth";
import { useAdmin } from "../../../../hooks/useAdmin";
import PromoteAdminModal from "../promote/PromoteAdminModal";

export default function AdminBottomNavbar() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentGoogleTab = searchParams.get("tab") || "realtime";

  const { user } = useUserAuth();
  const { overview } = useAdmin();
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);

  const isFounder = user?.role === "founder";
  const pendingReportsCount = overview?.stats?.pending_reports || 0;

  // Determine current context
  const isGoogleSection = location.pathname === "/admin/google-overview";
  const isMyStoreSection = location.pathname.startsWith("/admin/my-store");
  const isPlatformSection = !isGoogleSection && !isMyStoreSection;

  // 1. Google Overview Items
  const googleItems = [
    {
      id: "realtime",
      label: "Real-time",
      path: "/admin/google-overview?tab=realtime",
      icon: Activity,
      isActive: isGoogleSection && currentGoogleTab === "realtime",
    },
    {
      id: "visitors",
      label: "Visitors",
      path: "/admin/google-overview?tab=visitors",
      icon: Users,
      isActive: isGoogleSection && currentGoogleTab === "visitors",
    },
    {
      id: "sources",
      label: "Sources",
      path: "/admin/google-overview?tab=sources",
      icon: Globe,
      isActive: isGoogleSection && currentGoogleTab === "sources",
    },
    {
      id: "pages",
      label: "Pages",
      path: "/admin/google-overview?tab=pages",
      icon: FileText,
      isActive: isGoogleSection && currentGoogleTab === "pages",
    },
  ];

  // 2. My Store Section Items
  const myStoreItems = [
    {
      id: "my-stores",
      label: "My Stores",
      path: "/admin/my-store",
      icon: Store,
      isActive:
        location.pathname === "/admin/my-store" ||
        (!location.pathname.endsWith("/new") && !location.pathname.endsWith("/directory")),
    },
    {
      id: "add-store",
      label: "Add Store",
      path: "/admin/my-store/new",
      icon: PlusCircle,
      isActive: location.pathname === "/admin/my-store/new",
    },
    {
      id: "directory",
      label: "Directory",
      path: "/admin/my-store/directory",
      icon: Compass,
      isActive: location.pathname === "/admin/my-store/directory",
    },
  ];

  // 3. Platform Overview (Governance) Items (Walang Directory, 4 items + Promote button)
  const platformItems = [
    {
      id: "overview",
      label: "Overview",
      path: "/admin/platform/overview",
      icon: LayoutDashboard,
      isActive:
        location.pathname === "/admin/platform/overview" ||
        location.pathname === "/admin/overview" ||
        location.pathname === "/admin" ||
        location.pathname === "/admin/dashboard",
    },
    {
      id: "reports",
      label: "Reports",
      path: "/admin/platform/reports",
      icon: ShieldAlert,
      badge: pendingReportsCount > 0 ? pendingReportsCount : null,
      isActive:
        location.pathname === "/admin/platform/reports" ||
        location.pathname === "/admin/reports",
    },
    {
      id: "storefronts",
      label: "Stores",
      path: "/admin/platform/storefronts",
      icon: Building2,
      isActive:
        location.pathname === "/admin/platform/storefronts" ||
        location.pathname === "/admin/storefronts",
    },
    {
      id: "categories",
      label: "Categories",
      path: "/admin/platform/categories",
      icon: Tags,
      isActive:
        location.pathname === "/admin/platform/categories" ||
        location.pathname === "/admin/categories",
    },
  ];

  // Select active items array
  const activeItems = isGoogleSection
    ? googleItems
    : isMyStoreSection
    ? myStoreItems
    : platformItems;

  return (
    <>
      <nav
        aria-label="Admin Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1"
      >
        <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
          {activeItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`relative flex flex-col items-center justify-center py-1 px-1.5 rounded-xl min-h-[46px] min-w-[46px] flex-1 transition-all ${
                  active
                    ? "text-teal-700 font-bold bg-teal-50/70"
                    : "text-slate-500 hover:text-slate-900 active:bg-slate-100 font-medium"
                }`}
                aria-label={item.label}
              >
                <div className="relative">
                  <Icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                      active ? "scale-105 stroke-[2.2]" : "stroke-[1.8]"
                    }`}
                  />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-extrabold min-w-[15px] text-center shadow-2xs">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight truncate max-w-[62px] text-center">
                  {item.label}
                </span>
                {active && (
                  <span
                    className="w-1 h-1 rounded-full bg-teal-700 mt-0.5"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}

          {/* Promote Admin Button (Only shown in Platform Overview mode for Founder) */}
          {isPlatformSection && isFounder && (
            <button
              type="button"
              onClick={() => setIsPromoteModalOpen(true)}
              className="relative flex flex-col items-center justify-center py-1 px-1.5 rounded-xl min-h-[46px] min-w-[46px] flex-1 text-slate-500 hover:text-teal-700 active:bg-slate-100 font-medium cursor-pointer transition-colors"
              aria-label="Promote Admin"
              title="Promote User to Admin"
            >
              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8] text-teal-700" />
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-[62px] text-center">
                Promote
              </span>
            </button>
          )}
        </div>
      </nav>

      {/* Promote Admin Modal */}
      {isPlatformSection && isFounder && (
        <PromoteAdminModal
          isOpen={isPromoteModalOpen}
          onClose={() => setIsPromoteModalOpen(false)}
        />
      )}
    </>
  );
}
