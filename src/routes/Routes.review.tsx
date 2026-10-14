import { Navigate, useParams } from "react-router";

// 1. Pages
import PublicBusinessProfilePage from "../pages/ReviewPages/BusinessView/PublicBusinessProfilePage";
import WriteB2BEndorsementPage from "../pages/ReviewPages/SubmitReview/WriteB2BEndorsementPage";

// Component to seamlessly redirect standalone write-review URL to in-page modal popup
function RedirectToWriteReviewModal() {
    const { businessId } = useParams();
    return <Navigate to={`/business/${businessId}?writeReview=true`} replace />;
}

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

    // 2. Public Customer Review Submission Flow (Redirects to in-page Popup Modal)
    {
        key: "business-write-review-public",
        path: "/business/:businessId/write-review",
        element: <RedirectToWriteReviewModal />,
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