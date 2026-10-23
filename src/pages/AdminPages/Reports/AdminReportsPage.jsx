import React from "react";
import AdminLayout from "../components/layout/AdminLayout";
import AdminReportsSection from "../components/reports/AdminReportsSection";

export default function AdminReportsPage() {
  return (
    <AdminLayout>
      <div className="w-full max-w-full min-w-0">
        <AdminReportsSection />
      </div>
    </AdminLayout>
  );
}
