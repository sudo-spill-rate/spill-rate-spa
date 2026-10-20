import React, { useState } from "react";
import { toast } from "react-toastify";
import { Plus, AlertCircle, RotateCw } from "lucide-react";
import { useCategories } from "../../../../hooks/useCategories";
import { useAdmin } from "../../../../hooks/useAdmin";
import BaseModal from "../../../../components/common/BaseModal";

export default function CategoryManagerModal({ isOpen, onClose }) {
  const { refetch } = useCategories();
  const { addCategory, isAddingCategory } = useAdmin();

  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const slugPreview = categoryName.trim()
    ? "/" +
      categoryName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "";

  const handleClose = () => {
    if (isAddingCategory) return;
    setError(null);
    setCategoryName("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = categoryName.trim();
    if (!trimmed) {
      setError("Category name is required.");
      return;
    }

    setError(null);
    try {
      await addCategory({
        name: trimmed,
      });
      toast.success(`Category "${trimmed}" created successfully.`);
      refetch();
      setCategoryName("");
      onClose();
    } catch (err) {
      const errMsg = err?.message || "Failed to create category.";
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Industry Category"
      description="Create a new taxonomy category to organize storefronts and directory listings."
      titleId="add-category-modal-title"
      maxWidth="max-w-md"
      isProcessing={isAddingCategory}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div
            role="alert"
            className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label
            htmlFor="category-name-input"
            className="block text-xs font-semibold text-slate-700"
          >
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            id="category-name-input"
            name="categoryName"
            autoComplete="off"
            type="text"
            required
            autoFocus
            value={categoryName}
            onChange={(e) => {
              setCategoryName(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. Healthcare, Automotive, Food & Dining"
            className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700 min-h-[42px] transition-colors bg-white text-slate-900"
          />

          {slugPreview && (
            <p className="text-[11px] text-slate-500 pt-0.5">
              URL preview: <span className="font-mono text-teal-700 font-semibold">{slugPreview}</span>
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleClose}
            disabled={isAddingCategory}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 cursor-pointer min-h-[40px] transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isAddingCategory || !categoryName.trim()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50 min-h-[40px] transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2"
          >
            {isAddingCategory ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Creating Category...</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Create Category</span>
              </>
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
