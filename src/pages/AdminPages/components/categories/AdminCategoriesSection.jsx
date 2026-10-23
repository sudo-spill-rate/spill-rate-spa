import React, { useState } from "react";
import { toast } from "react-toastify";
import { Plus, Trash2, RotateCw, Edit2 } from "lucide-react";
import { useCategories } from "../../../../hooks/useCategories";
import { useAdmin } from "../../../../hooks/useAdmin";
import BaseModal from "../../../../components/common/BaseModal";

export default function AdminCategoriesSection({ onOpenAddModal, onEditCategory }) {
  const { categories, refetch } = useCategories();
  const { deleteCategory, isDeletingCategory } = useAdmin();

  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete.id);
      toast.success(`Category "${categoryToDelete.name}" removed successfully.`);
      refetch();
      setCategoryToDelete(null);
    } catch (err) {
      toast.error(err?.message || "Failed to delete category.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Industry Categories ({categories?.length || 0})
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Standard business taxonomy applied across directories and ratings.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white rounded-lg text-xs font-semibold cursor-pointer min-h-[44px] sm:min-h-[38px] transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      {(!categories || categories.length === 0) ? (
        <div className="bg-white rounded-xl border border-slate-200/90 p-8 text-center text-slate-500 text-xs">
          No categories registered. Click &ldquo;Add Category&rdquo; to create the first one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id || cat.slug || cat.name}
              className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-3.5 shadow-xs hover:border-slate-300 transition-colors flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-xs text-slate-900 truncate">{cat.name}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                  /{cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {cat.id && (
                  <button
                    type="button"
                    onClick={() => onEditCategory && onEditCategory(cat)}
                    className="min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] p-2 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center justify-center shrink-0"
                    title={`Edit category ${cat.name}`}
                    aria-label={`Edit category ${cat.name}`}
                  >
                    <Edit2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                  </button>
                )}
                {cat.id && (
                  <button
                    type="button"
                    onClick={() => setCategoryToDelete(cat)}
                    disabled={isDeletingCategory}
                    className="min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] p-2 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition-colors disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center shrink-0"
                    title={`Delete category ${cat.name}`}
                    aria-label={`Delete category ${cat.name}`}
                  >
                    <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reusable Accessible Confirmation Modal */}
      {categoryToDelete && (
        <BaseModal
          isOpen={Boolean(categoryToDelete)}
          onClose={() => setCategoryToDelete(null)}
          title="Remove Industry Category?"
          titleId="delete-category-modal-title"
          maxWidth="max-w-md"
          isProcessing={isDeletingCategory}
        >
          <div className="space-y-3 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Are you sure you want to permanently remove category <strong className="text-slate-900">&ldquo;{categoryToDelete.name}&rdquo;</strong>? Existing storefronts with this category may need re-categorization.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 font-semibold">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                disabled={isDeletingCategory}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 min-h-[44px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeletingCategory}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white min-h-[44px] cursor-pointer disabled:opacity-50"
              >
                {isDeletingCategory ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Removing...</span>
                  </>
                ) : (
                  <span>Remove Category</span>
                )}
              </button>
            </div>
          </div>
        </BaseModal>
      )}
    </div>
  );
}
