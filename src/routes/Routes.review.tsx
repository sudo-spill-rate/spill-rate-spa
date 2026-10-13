import React from "react";

// 1. Pages
import PublicBusinessProfilePage from "../pages/ReviewPages/BusinessView/PublicBusinessProfilePage";
import WriteCustomerReviewPage from "../pages/ReviewPages/SubmitReview/WriteCustomerReviewPage";
import WriteB2BEndorsementPage from "../pages/ReviewPages/SubmitReview/WriteB2BEndorsementPage";

// 2. Providers & Guards
import { ReviewProvider } from "../context/review/reviewContextProvider";
import { ProtectedRoute } from "./ProtectedRoute";

export const ReviewRoutes = [
    // 1. Public Business View (Profile info + Customer reviews feed)
    {
        key: "business-public-view",
        path: "/business/:slug",
        element: (
            <ReviewProvider>
                <PublicBusinessProfilePage />
            </ReviewProvider>
        ),
    },

    // 2. Public Customer Review Submission Flow
    {
        key: "business-write-review-public",
        path: "/business/:businessId/write-review",
        element: (
            <ReviewProvider>
                <WriteCustomerReviewPage />
            </ReviewProvider>
        ),
    },

    // 3. Authenticated Business Owner B2B Endorsement Flow ("Naka Sign in nasa Loob na")
    {
        key: "business-write-review-b2b",
        path: "/business/:reviewerId/:businessId/write-review",
        element: (
            <ProtectedRoute>
                <ReviewProvider>
                    <WriteB2BEndorsementPage />
                </ReviewProvider>
            </ProtectedRoute>
        ),
    },
];

export default ReviewRoutes;