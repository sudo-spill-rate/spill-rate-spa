import React from "react";
import AdminLayout from "../components/layout/AdminLayout";
import AdminBusinessesSection from "../components/storefronts/AdminBusinessesSection";
import { useAdmin } from "../../../hooks/useAdmin";

export default function AdminStorefrontsPage() {
  const { overview, refetchOverview } = useAdmin();

  return (
    <AdminLayout
      title="Storefront Verification"
      description="Audit registered storefronts, toggle verified badges, or remove non-compliant business entries."
    >
      <AdminBusinessesSection
        overview={overview}
        refetchOverview={refetchOverview}
      />
    </AdminLayout>
  );
}
