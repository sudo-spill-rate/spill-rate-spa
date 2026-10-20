import React from "react";

// Platform Workspace Pages mula sa AdminPages/ subfolders
import AdminOverviewPage from "../pages/AdminPages/Overview/AdminOverviewPage";
import AdminGoogleOverviewPage from "../pages/AdminPages/GoogleOverview/AdminGoogleOverviewPage";
import AdminReportsPage from "../pages/AdminPages/Reports/AdminReportsPage";
import AdminStorefrontsPage from "../pages/AdminPages/Storefronts/AdminStorefrontsPage";
import AdminCategoriesPage from "../pages/AdminPages/Categories/AdminCategoriesPage";
import AdminDirectoryPage from "../pages/AdminPages/Directory/AdminDirectoryPage";

// Founder Storefront Pages mula sa AdminPages/ subfolders
import AdminMyStorePage from "../pages/AdminPages/MyStore/AdminMyStorePage";
import AdminCreateStorefrontPage from "../pages/AdminPages/CreateStorefront/AdminCreateStorefrontPage";
import AdminManageStorefrontPage from "../pages/AdminPages/ManageStorefront/AdminManageStorefrontPage";

export const AdminRoutes = [
    // 1. Platform Workspace Routes (/admin/platform/* may backward compatibility)
    {
        key: "admin-root",
        path: "/admin",
        element: <AdminOverviewPage />,
    },
    {
        key: "admin-dashboard",
        path: "/admin/dashboard",
        element: <AdminOverviewPage />,
    },
    {
        key: "admin-platform-overview",
        path: "/admin/platform/overview",
        element: <AdminOverviewPage />,
    },
    {
        key: "admin-overview-legacy",
        path: "/admin/overview",
        element: <AdminOverviewPage />,
    },
    {
        key: "admin-platform-reports",
        path: "/admin/platform/reports",
        element: <AdminReportsPage />,
    },
    {
        key: "admin-reports-legacy",
        path: "/admin/reports",
        element: <AdminReportsPage />,
    },
    {
        key: "admin-platform-storefronts",
        path: "/admin/platform/storefronts",
        element: <AdminStorefrontsPage />,
    },
    {
        key: "admin-storefronts-legacy",
        path: "/admin/storefronts",
        element: <AdminStorefrontsPage />,
    },
    {
        key: "admin-platform-categories",
        path: "/admin/platform/categories",
        element: <AdminCategoriesPage />,
    },
    {
        key: "admin-categories-legacy",
        path: "/admin/categories",
        element: <AdminCategoriesPage />,
    },
    {
        key: "admin-platform-directory",
        path: "/admin/platform/directory",
        element: <AdminDirectoryPage />,
    },
    {
        key: "admin-directory-legacy",
        path: "/admin/directory",
        element: <AdminDirectoryPage />,
    },

    // 2. Google Overview Routes
    {
        key: "admin-google-overview",
        path: "/admin/google-overview",
        element: <AdminGoogleOverviewPage />,
    },
    {
        key: "admin-google-overview-nested",
        path: "/admin/google/overview",
        element: <AdminGoogleOverviewPage />,
    },

    // 2. Founder Storefront Management Routes (Exclusively inside AdminPages)
    {
        key: "admin-my-store",
        path: "/admin/my-store",
        element: <AdminMyStorePage />,
    },
    {
        key: "admin-my-store-directory",
        path: "/admin/my-store/directory",
        element: <AdminDirectoryPage />,
    },
    {
        key: "admin-create-store",
        path: "/admin/my-store/new",
        element: <AdminCreateStorefrontPage />,
    },
    {
        key: "admin-manage-store",
        path: "/admin/my-store/:id",
        element: <AdminManageStorefrontPage />,
    },
];

export default AdminRoutes;
