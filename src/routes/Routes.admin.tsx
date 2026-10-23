import React from "react";

// Platform Workspace Pages
import AdminOverviewPage from "../pages/AdminPages/Overview/AdminOverviewPage";
import AdminGoogleOverviewPage from "../pages/AdminPages/GoogleOverview/AdminGoogleOverviewPage";
import AdminGoogleVisitorsPage from "../pages/AdminPages/GoogleOverview/AdminGoogleVisitorsPage";
import AdminGoogleSourcesPage from "../pages/AdminPages/GoogleOverview/AdminGoogleSourcesPage";
import AdminGooglePagesPage from "../pages/AdminPages/GoogleOverview/AdminGooglePagesPage";
import AdminReportsPage from "../pages/AdminPages/Reports/AdminReportsPage";
import AdminStorefrontsPage from "../pages/AdminPages/Storefronts/AdminStorefrontsPage";
import AdminCategoriesPage from "../pages/AdminPages/Categories/AdminCategoriesPage";
import AdminUsersPage from "../pages/AdminPages/Users/AdminUsersPage";
import AdminDirectoryPage from "../pages/AdminPages/Directory/AdminDirectoryPage";

// Founder Storefront Pages
import BusinessDashboardPage from "../pages/BusinessPages/Dashboard/BusinessDashboardPage";
import AdminCreateStorefrontPage from "../pages/AdminPages/CreateStorefront/AdminCreateStorefrontPage";
import BusinessManageProfilePage from "../pages/BusinessPages/Profile/BusinessManageProfilePage";

export const AdminRoutes = [
    // 1. Platform Governance Routes (Primary overview is /admin)
    {
        key: "admin-overview",
        path: "/admin",
        element: <AdminOverviewPage />,
    },
    {
        key: "admin-platform-reports",
        path: "/admin/platform/reports",
        element: <AdminReportsPage />,
    },
    {
        key: "admin-platform-storefronts",
        path: "/admin/platform/storefronts",
        element: <AdminStorefrontsPage />,
    },
    {
        key: "admin-platform-categories",
        path: "/admin/platform/categories",
        element: <AdminCategoriesPage />,
    },
    {
        key: "admin-platform-users",
        path: "/admin/platform/users",
        element: <AdminUsersPage />,
    },

    // 2. Google Analytics Standalone Routes
    {
        key: "admin-google-overview",
        path: "/admin/google/overview",
        element: <AdminGoogleOverviewPage />,
    },
    {
        key: "admin-google-visitors",
        path: "/admin/google/visitors",
        element: <AdminGoogleVisitorsPage />,
    },
    {
        key: "admin-google-sources",
        path: "/admin/google/traffic-sources",
        element: <AdminGoogleSourcesPage />,
    },
    {
        key: "admin-google-pages",
        path: "/admin/google/top-pages",
        element: <AdminGooglePagesPage />,
    },

    // 3. Founder Storefront Management Routes
    {
        key: "admin-my-store",
        path: "/admin/my-store",
        element: <BusinessDashboardPage />,
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
        element: <BusinessManageProfilePage />,
    },
];

export default AdminRoutes;
