import React from "react";
import AdminLayout from "../components/layout/AdminLayout";
import AdminUsersSection from "../components/users/AdminUsersSection";

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <div className="w-full max-w-full min-w-0">
        <AdminUsersSection />
      </div>
    </AdminLayout>
  );
}
