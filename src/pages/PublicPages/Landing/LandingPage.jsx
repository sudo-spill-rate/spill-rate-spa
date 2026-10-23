import React from "react";
import PublicPageHeader from "../components/layout/PublicPageHeader";
import FeaturedSection from "../components/landing/FeaturedSection";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

export default function LandingPage() {
  useDocumentTitle(
    "SpillRate - Discover, Review, and Rate Trusted Businesses",
    "Discover local businesses, read verified customer feedback, and share authentic ratings and reviews with photos.",
    "/"
  );

  return (
    <div className="flex-1 flex flex-col">
      <PublicPageHeader
        title="Featured Establishments"
        description="Verified local businesses with real customer ratings and active community feedback."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Featured" },
        ]}
        compact={true}
      />

      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2.5 sm:py-5 w-full flex-1 flex flex-col">
        <FeaturedSection />
      </div>
    </div>
  );
}
