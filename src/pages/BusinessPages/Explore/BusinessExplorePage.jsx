import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import AdminDirectorySection from "../../AdminPages/components/directory/AdminDirectorySection";

export default function BusinessExplorePage() {
  return (
    <DashboardLayout
      title="Explore Storefronts"
      description="Discover local establishments, browse community ratings, and view customer feedback."
    >
      <AdminDirectorySection />
    </DashboardLayout>
  );
}
