import React, { useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import AdminCategoriesSection from "../components/categories/AdminCategoriesSection";
import CategoryManagerModal from "../components/categories/CategoryManagerModal";

export default function AdminCategoriesPage() {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const handleOpenAdd = () => {
    setCategoryToEdit(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (cat) => {
    setCategoryToEdit(cat);
    setIsCategoryModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCategoryModalOpen(false);
    setCategoryToEdit(null);
  };

  return (
    <AdminLayout>
      <div className="w-full max-w-full min-w-0">
        <AdminCategoriesSection
          onOpenAddModal={handleOpenAdd}
          onEditCategory={handleEditCategory}
        />

        <CategoryManagerModal
          isOpen={isCategoryModalOpen}
          onClose={handleCloseModal}
          categoryToEdit={categoryToEdit}
        />
      </div>
    </AdminLayout>
  );
}
