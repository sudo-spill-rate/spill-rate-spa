import React from "react";

// Mga Pages mula sa BusinessPages/ folder
import BusinessDashboardPage from "../pages/BusinessPages/Dashboard/BusinessDashboardPage";
import BusinessManageProfilePage from "../pages/BusinessPages/Profile/BusinessManageProfilePage";
import CreateBusinessPage from "../pages/BusinessPages/CreateBusiness/CreateBusinessPage";
import BusinessExplorePage from "../pages/BusinessPages/Explore/BusinessExplorePage";
import PublicBusinessProfilePage from "../pages/ReviewPages/BusinessView/PublicBusinessProfilePage";

export const BusinessRoutes = [
    {
        key: "owner-dashboard",
        path: "/dashboard",
        element: <BusinessDashboardPage />,
    },
    {
        key: "owner-create-business",
        path: "/dashboard/business/new",
        element: <CreateBusinessPage />,
    },
    {
        key: "owner-manage-business",
        path: "/dashboard/business/:id",
        element: <BusinessManageProfilePage />,
    },
    {
        key: "owner-explore-directory",
        path: "/dashboard/explore",
        element: <BusinessExplorePage />,
    },
    {
        key: "owner-explore-business-view",
        path: "/dashboard/explore/business/:slug",
        element: <PublicBusinessProfilePage />,
    },
];

export default BusinessRoutes;