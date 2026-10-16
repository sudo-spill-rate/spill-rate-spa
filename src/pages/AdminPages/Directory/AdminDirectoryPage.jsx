import React from "react";
import AdminLayout from "../components/layout/AdminLayout";
import AdminDirectorySection from "../components/directory/AdminDirectorySection";

export default function AdminDirectoryPage() {
  return (
    <AdminLayout
      title="Platform Directory"
      description="Explore and search all live storefronts registered across the SpillRate ecosystem."
    >
      <AdminDirectorySection />
    </AdminLayout>
  );
}
