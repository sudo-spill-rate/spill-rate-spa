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
  const isGoogleSection = location.pathname.startsWith("/admin/google");
  const isMyStoreSection = location.pathname.startsWith("/admin/my-store");
  const isPlatformSection = !isGoogleSection && !isMyStoreSection;

  // 1. Google Overview Standalone Items
  const googleItems = [
    {
      id: "realtime",
      label: "Real-time",
      path: "/admin/google/overview",
      icon: Activity,
      isActive: location.pathname === "/admin/google/overview",
    },
    {
      id: "visitors",
      label: "Visitors",
      path: "/admin/google/visitors",
      icon: Users,
      isActive: location.pathname === "/admin/google/visitors",
    },
    {
      id: "sources",
      label: "Sources",
      path: "/admin/google/traffic-sources",
      icon: Globe,
      isActive: location.pathname === "/admin/google/traffic-sources",
    },
    {
      id: "pages",
      label: "Top Pages",
      path: "/admin/google/top-pages",
      icon: FileText,
      isActive: location.pathname === "/admin/google/top-pages",
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
      path: "/admin",
      icon: LayoutDashboard,
      isActive: location.pathname === "/admin",
    },
    {
      id: "reports",
      label: "Reports",
      path: "/admin/platform/reports",
      icon: ShieldAlert,
      badge: pendingReportsCount > 0 ? pendingReportsCount : null,
      isActive: location.pathname === "/admin/platform/reports",
    },
    {
      id: "storefronts",
      label: "Stores",
      path: "/admin/platform/storefronts",
      icon: Building2,
      isActive: location.pathname === "/admin/platform/storefronts",
    },
    {
      id: "categories",
      label: "Categories",
      path: "/admin/platform/categories",
      icon: Tags,
      isActive: location.pathname === "/admin/platform/categories",
    },
    {
      id: "users",
      label: "Users",
      path: "/admin/platform/users",
      icon: Users,
      isActive: location.pathname === "/admin/platform/users",
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
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 pt-1 pb-[max(0.375rem,env(safe-area-inset-bottom))] w-full"
      >
        <div className="flex items-center justify-around gap-1 max-w-md mx-auto w-full">
          {activeItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`relative flex flex-col items-center justify-center py-1 px-1.5 rounded-xl min-h-[46px] min-w-[44px] flex-1 transition-all ${
                  active
                    ? "text-teal-800 font-bold bg-teal-50/80 border border-teal-200/60 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 active:bg-slate-100 font-medium border border-transparent"
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
                <span className="text-[10px] mt-1 tracking-tight truncate w-full text-center px-0.5 leading-tight">
                  {item.label}
                </span>
                <span
                  className={`w-1 h-1 rounded-full mt-0.5 transition-opacity ${
                    active ? "bg-teal-700 opacity-100" : "opacity-0"
                  }`}
                  aria-hidden="true"
                />
              </Link>
            );
          })}

          {/* Promote Admin Button (Only shown in Platform Overview mode for Founder) */}
          {isPlatformSection && isFounder && (
            <button
              type="button"
              onClick={() => setIsPromoteModalOpen(true)}
              className="relative flex flex-col items-center justify-center py-1 px-1.5 rounded-xl min-h-[46px] min-w-[44px] flex-1 text-slate-600 hover:text-teal-700 active:bg-slate-100 font-medium cursor-pointer transition-colors border border-transparent"
              aria-label="Promote Admin"
              title="Promote User to Admin"
            >
              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8] text-teal-700" />
              <span className="text-[10px] mt-1 tracking-tight truncate w-full text-center px-0.5 leading-tight">
                Promote
              </span>
              <span className="w-1 h-1 rounded-full mt-0.5 opacity-0" aria-hidden="true" />
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
