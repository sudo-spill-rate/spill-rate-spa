import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  ChevronDown,
  Check,
  LayoutDashboard,
  ShieldAlert,
  Building2,
  Tags,
  Compass,
  Store,
  PlusCircle,
  Activity,
  Users,
  Globe,
  FileText,
  BarChart3,
  UserPlus,
} from "lucide-react";

import { useUserAuth } from "../../../../hooks/useUserAuth";
import { useAdmin } from "../../../../hooks/useAdmin";
import PromoteAdminModal from "../promote/PromoteAdminModal";

export default function AdminDashboardSidebar({
  pendingReportsCount: propCount,
  onOpenPromoteModal,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const { overview } = useAdmin();

  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isFounder = user?.role === "founder";
  const pendingReportsCount =
    typeof propCount === "number" ? propCount : overview?.stats?.pending_reports || 0;

  // Identify current active workspace (Platform, Google, or My Store)
  const isGoogleSection = location.pathname.startsWith("/admin/google");
  const isMyStoreSection = location.pathname.startsWith("/admin/my-store");
  const isPlatformSection = !isGoogleSection && !isMyStoreSection;

  const searchParams = new URLSearchParams(location.search);
  const currentGoogleTab = searchParams.get("tab") || "realtime";

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsWorkspaceDropdownOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsWorkspaceDropdownOpen(false);
      }
    }
    if (isWorkspaceDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isWorkspaceDropdownOpen]);

  const handleOpenPromote = () => {
    if (onOpenPromoteModal) {
      onOpenPromoteModal();
    } else {
      setIsPromoteModalOpen(true);
    }
  };

  // 3 Primary Workspaces for the Dropdown
  const workspaces = [
    {
      id: "platform",
      title: "Platform Overview",
      subtitle: "Governance & Moderation",
      path: "/admin",
      icon: LayoutDashboard,
      isActive: isPlatformSection,
    },
    {
      id: "google",
      title: "Google Overview",
      subtitle: "Traffic & Analytics",
      path: "/admin/google/overview",
      icon: BarChart3,
      isActive: isGoogleSection,
    },
    {
      id: "mystore",
      title: "My Store",
      subtitle: "Founder Storefronts",
      path: "/admin/my-store",
      icon: Store,
      isActive: isMyStoreSection,
    },
  ];

  const currentWorkspace = workspaces.find((w) => w.isActive) || workspaces[0];

  const handleSelectWorkspace = (path) => {
    setIsWorkspaceDropdownOpen(false);
    navigate(path);
  };

  return (
    <aside
      className="hidden lg:block w-60 xl:w-64 shrink-0 lg:sticky lg:top-4"
      aria-label="Admin sidebar navigation"
    >
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-visible flex flex-col divide-y divide-slate-100">
        {/* Top: 3-Way Workspace Switcher Dropdown */}
        <div className="p-2.5 bg-slate-50/60 relative" ref={dropdownRef}>
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Admin Workspace
            </span>
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${
                isFounder
                  ? "bg-teal-50 text-teal-800 border-teal-200"
                  : "bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              {isFounder ? "Founder" : "Admin"}
            </span>
          </div>

          {/* Dropdown Trigger Button */}
          <button
            type="button"
            onClick={() => setIsWorkspaceDropdownOpen((prev) => !prev)}
            aria-expanded={isWorkspaceDropdownOpen}
            aria-haspopup="listbox"
            className="w-full flex items-center justify-between gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 shadow-2xs text-left cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700 min-h-[44px]"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-md bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shrink-0">
                <currentWorkspace.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-bold text-xs text-slate-900 block truncate leading-tight">
                  {currentWorkspace.title}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block truncate leading-tight">
                  {currentWorkspace.subtitle}
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                isWorkspaceDropdownOpen ? "rotate-180 text-teal-700" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu Options */}
          {isWorkspaceDropdownOpen && (
            <div
              role="listbox"
              aria-label="Select admin workspace"
              className="absolute left-2.5 right-2.5 top-full mt-1.5 z-50 bg-white rounded-xl border border-slate-200 shadow-lg p-1.5 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150"
            >
              {workspaces.map((ws) => {
                const Icon = ws.icon;
                const isSelected = ws.isActive;

                return (
                  <button
                    key={ws.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectWorkspace(ws.path)}
                    className={`w-full flex items-center justify-between gap-2 p-2 rounded-lg text-left text-xs transition-colors cursor-pointer min-h-[38px] ${
                      isSelected
                        ? "bg-teal-50/80 text-teal-900 font-bold border border-teal-200/60"
                        : "hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? "text-teal-700" : "text-slate-500"
                        }`}
                      />
                      <div className="min-w-0">
                        <span className="block truncate font-semibold">
                          {ws.title}
                        </span>
                        <span className="block text-[10px] text-slate-500 truncate">
                          {ws.subtitle}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Dynamic Navigation Links based on active workspace (matches BottomNavbar) */}
        <div className="p-2.5">
          {/* 1. Platform Overview Navigation */}
          {isPlatformSection && (
            <>
              <div className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Platform Governance
              </div>
              <nav className="space-y-0.5 mt-1" aria-label="Platform governance routes">
                <Link
                  to="/admin"
                  className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors min-h-[34px] ${
                    location.pathname === "/admin"
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                    <span>Overview</span>
                  </div>
                </Link>

                <Link
                  to="/admin/platform/reports"
                  className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors min-h-[34px] ${
                    location.pathname === "/admin/platform/reports"
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
                    <span>Flagged Reports</span>
                  </div>
                  {pendingReportsCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-red-600 text-white">
                      {pendingReportsCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/admin/platform/storefronts"
                  className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors min-h-[34px] ${
                    location.pathname === "/admin/platform/storefronts"
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Storefronts</span>
                  </div>
                </Link>

                <Link
                  to="/admin/platform/categories"
                  className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors min-h-[34px] ${
                    location.pathname === "/admin/platform/categories"
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Tags className="w-3.5 h-3.5 text-slate-500" />
                    <span>Categories</span>
                  </div>
                </Link>

                <Link
                  to="/admin/platform/users"
                  className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors min-h-[34px] ${
                    location.pathname === "/admin/platform/users"
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>Users & Moderation</span>
                  </div>
                </Link>
              </nav>
            </>
          )}

          {/* 2. Google Overview Standalone Navigation */}
          {isGoogleSection && (
            <>
              <div className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Google Analytics 4
              </div>
              <nav className="space-y-0.5 mt-1" aria-label="Google Analytics routes">
                <Link
                  to="/admin/google/overview"
                  className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors min-h-[34px] ${
                    location.pathname === "/admin/google/overview"
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-slate-500" />
                    <span>Real-time</span>
                  </div>
                </Link>

                <Link
                  to="/admin/google/visitors"
                  className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors min-h-[34px] ${
                    location.pathname === "/admin/google/visitors"
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>Visitors</span>
                  </div>
                </Link>

                <Link
                  to="/admin/google/traffic-sources"
                  className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors min-h-[34px] ${
                    location.pathname === "/admin/google/traffic-sources"
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    <span>Traffic Sources</span>
                  </div>
                </Link>

                <Link
                  to="/admin/google/top-pages"
                  className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors min-h-[34px] ${
                    location.pathname === "/admin/google/top-pages"
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Top Pages</span>
                  </div>
                </Link>
              </nav>
            </>
          )}

          {/* 3. My Store Navigation */}
          {isMyStoreSection && (
            <>
              <div className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Founder Storefronts
              </div>
              <nav className="space-y-0.5 mt-1" aria-label="Founder storefront routes">
                <Link
                  to="/admin/my-store"
                  className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors min-h-[34px] ${
                    location.pathname === "/admin/my-store" ||
                    (!location.pathname.endsWith("/new") && !location.pathname.endsWith("/directory"))
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Store className="w-3.5 h-3.5 text-slate-500" />
                    <span>My Stores</span>
                  </div>
                </Link>

                <Link
                  to="/admin/my-store/new"
                  className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors min-h-[34px] ${
                    location.pathname === "/admin/my-store/new"
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span>Add Store</span>
                  </div>
                </Link>

                <Link
                  to="/admin/my-store/directory"
                  className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors min-h-[34px] ${
                    location.pathname === "/admin/my-store/directory"
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-slate-500" />
                    <span>Store Directory</span>
                  </div>
                </Link>
              </nav>
            </>
          )}
        </div>

        {/* Bottom Actions based on active workspace */}
        <div className="p-2.5 bg-slate-50/50 space-y-2">
          {isPlatformSection && isFounder && (
            <button
              type="button"
              onClick={handleOpenPromote}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold cursor-pointer min-h-[36px] transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Promote Admin</span>
            </button>
          )}


          {isMyStoreSection && (
            <Link
              to="/admin/my-store/new"
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold cursor-pointer min-h-[36px] transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Register Store</span>
            </Link>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
            <span>Founder Portal</span>
            <span className="font-mono text-[10px] text-slate-400">Platform v1.0</span>
          </div>
        </div>
      </div>

      <PromoteAdminModal
        isOpen={isPromoteModalOpen}
        onClose={() => setIsPromoteModalOpen(false)}
      />
    </aside>
  );
}
