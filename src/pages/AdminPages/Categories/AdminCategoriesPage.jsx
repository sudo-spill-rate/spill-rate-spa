import React, { useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import AdminCategoriesSection from "../components/categories/AdminCategoriesSection";
import CategoryManagerModal from "../components/categories/CategoryManagerModal";

export default function AdminCategoriesPage() {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  return (
    <AdminLayout
      title="Industry Categories"
      description="Create, maintain, and remove taxonomy categories used across business directory listings."
    >
      <AdminCategoriesSection
        onOpenAddModal={() => setIsCategoryModalOpen(true)}
      />

      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </AdminLayout>
  );
}
