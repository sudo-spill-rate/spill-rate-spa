import React from "react";

// Mga Pages mula sa BusinessPages/ folder
import BusinessDashboardPage from "../pages/BusinessPages/Dashboard/BusinessDashboardPage";
import BusinessManageProfilePage from "../pages/BusinessPages/Profile/BusinessManageProfilePage";
import CreateBusinessPage from "../pages/BusinessPages/CreateBusiness/CreateBusinessPage";
import BusinessExplorePage from "../pages/BusinessPages/Explore/BusinessExplorePage";
import DashboardExploreBusinessViewPage from "../pages/BusinessPages/Explore/DashboardExploreBusinessViewPage";

// Providers para sa Business Owner
import { BusinessProvider } from "../context/business/businessContextProvider";
import { ManageReviewProvider } from "../context/manageReview/manageReviewContextProvider";
import { ReviewProvider } from "../context/review/reviewContextProvider";

export const BusinessRoutes = [
    {
        key: "owner-dashboard",
        path: "/dashboard",
        element: (
            <BusinessProvider>
                <BusinessDashboardPage />
            </BusinessProvider>
        ),
    },
    {
        key: "owner-create-business",
        path: "/dashboard/business/new",
        element: (
            <BusinessProvider>
                <CreateBusinessPage />
            </BusinessProvider>
        ),
    },
    {
        key: "owner-manage-business",
        path: "/dashboard/business/:id",
        element: (
            <BusinessProvider>
                <ManageReviewProvider>
                    <BusinessManageProfilePage />
                </ManageReviewProvider>
            </BusinessProvider>
        ),
    },
    {
        key: "owner-explore-directory",
        path: "/dashboard/explore",
        element: (
            <BusinessProvider>
                <BusinessExplorePage />
            </BusinessProvider>
        ),
    },
    {
        key: "owner-explore-business-view",
        path: "/dashboard/explore/business/:slug",
        element: (
            <BusinessProvider>
                <ReviewProvider>
                    <DashboardExploreBusinessViewPage />
                </ReviewProvider>
            </BusinessProvider>
        ),
    },
];

export default BusinessRoutes;