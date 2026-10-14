import React from "react";

// Platform Workspace Pages mula sa AdminPages/ subfolders
import AdminOverviewPage from "../pages/AdminPages/Overview/AdminOverviewPage";
import AdminReportsPage from "../pages/AdminPages/Reports/AdminReportsPage";
import AdminStorefrontsPage from "../pages/AdminPages/Storefronts/AdminStorefrontsPage";
import AdminCategoriesPage from "../pages/AdminPages/Categories/AdminCategoriesPage";
import AdminDirectoryPage from "../pages/AdminPages/Directory/AdminDirectoryPage";

// Founder Storefront Pages mula sa AdminPages/ subfolders
import AdminMyStorePage from "../pages/AdminPages/MyStore/AdminMyStorePage";
import AdminCreateStorefrontPage from "../pages/AdminPages/CreateStorefront/AdminCreateStorefrontPage";
import AdminManageStorefrontPage from "../pages/AdminPages/ManageStorefront/AdminManageStorefrontPage";

export const AdminRoutes = [
    // 1. Platform Workspace Routes
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
        key: "admin-overview",
        path: "/admin/overview",
        element: <AdminOverviewPage />,
    },
    {
        key: "admin-reports",
        path: "/admin/reports",
        element: <AdminReportsPage />,
    },
    {
        key: "admin-storefronts",
        path: "/admin/storefronts",
        element: <AdminStorefrontsPage />,
    },
    {
        key: "admin-categories",
        path: "/admin/categories",
        element: <AdminCategoriesPage />,
    },
    {
        key: "admin-directory",
        path: "/admin/directory",
        element: <AdminDirectoryPage />,
    },

    // 2. Founder Storefront Management Routes (Exclusively inside AdminPages)
    {
        key: "admin-my-store",
        path: "/admin/my-store",
        element: <AdminMyStorePage />,
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
