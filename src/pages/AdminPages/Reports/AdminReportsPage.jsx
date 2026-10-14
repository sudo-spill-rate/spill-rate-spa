import React from "react";
import AdminLayout from "../components/layout/AdminLayout";
import AdminReportsSection from "../components/reports/AdminReportsSection";

export default function AdminReportsPage() {
  return (
    <AdminLayout
      title="Flagged Reports"
      description="Audit and resolve consumer and merchant moderation reports across all storefronts."
    >
      <AdminReportsSection />
    </AdminLayout>
  );
}
