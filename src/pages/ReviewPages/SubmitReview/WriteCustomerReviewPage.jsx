import React from "react";
import { Navigate, useParams } from "react-router";

/**
 * WriteCustomerReviewPage
 * Redirects customer review requests directly to the business profile page
 * with the ?writeReview=true query parameter to trigger the in-page popup modal.
 */
export default function WriteCustomerReviewPage() {
  const { businessId } = useParams();
  return <Navigate to={`/business/${businessId || ""}?writeReview=true`} replace />;
}
