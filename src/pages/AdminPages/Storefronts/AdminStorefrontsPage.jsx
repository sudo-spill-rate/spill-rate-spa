import React from "react";
import AdminLayout from "../components/layout/AdminLayout";
import AdminBusinessesSection from "../components/storefronts/AdminBusinessesSection";
import { useAdmin } from "../../../hooks/useAdmin";

export default function AdminStorefrontsPage() {
  const { overview, refetchOverview } = useAdmin();

  return (
    <AdminLayout>
      <div className="w-full max-w-full min-w-0">
        <AdminBusinessesSection
          overview={overview}
          refetchOverview={refetchOverview}
        />
      </div>
    </AdminLayout>
  );
}
