import React from "react";
import PublicPageHeader from "../components/layout/PublicPageHeader";
import FeaturedSection from "../components/landing/FeaturedSection";

export default function LandingPage() {
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 w-full flex-1 flex flex-col">
        <FeaturedSection />
      </div>
    </div>
  );
}