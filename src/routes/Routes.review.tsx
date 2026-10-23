import React from "react";
import PublicBusinessProfilePage from "../pages/ReviewPages/BusinessView/PublicBusinessProfilePage";
import WriteB2BEndorsementPage from "../pages/ReviewPages/SubmitReview/WriteB2BEndorsementPage";
import WriteCustomerReviewPage from "../pages/ReviewPages/SubmitReview/WriteCustomerReviewPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const ReviewRoutes = [
    // 1. Public Business View (Profile info + Customer reviews feed)
    {
        key: "business-public-view",
        path: "/business/:slug",
        element: <PublicBusinessProfilePage />,
    },

    // 2. Public Customer Review Submission Flow (Redirects to in-page Popup Modal)
    {
        key: "business-write-review-public",
        path: "/business/:businessId/write-review",
        element: <WriteCustomerReviewPage />,
    },

    // 3. Authenticated Business Owner B2B Endorsement Flow
    {
        key: "business-write-review-b2b",
        path: "/business/:reviewerId/:businessId/write-review",
        element: (
            <ProtectedRoute>
                <WriteB2BEndorsementPage />
            </ProtectedRoute>
        ),
    },
];

export default ReviewRoutes;